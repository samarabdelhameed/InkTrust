import { Queue, Worker, QueueEvents } from 'bullmq';
import IORedis from 'ioredis';
import { env } from '../config/env';
import { logger } from '../utils/logger';
import { dbService } from 'db-schema';
import { storageService } from '../services';
import { geminiService } from '../services/ai/gemini.service';
import { arciumService } from '../services/arcium';
import { swigService } from '../services/swig';
import { moonPayService } from '../services/moonpay';
import { telnyxFaxOutService } from '../services/telnyx/fax-out';

const redisConnection = new IORedis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

export const faxIngestionQueue = new Queue('fax-ingestion', { connection: redisConnection });
export const ocrQueue = new Queue('ocr-processing', { connection: redisConnection });
export const aiProcessingQueue = new Queue('ai-orchestration', { connection: redisConnection });
export const approvalQueue = new Queue('approval-workflow', { connection: redisConnection });
export const blockchainQueue = new Queue('blockchain-execution', { connection: redisConnection });
export const receiptQueue = new Queue('receipt-generation', { connection: redisConnection });
export const escalationQueue = new Queue('escalation-moderation', { connection: redisConnection });
export const emailQueue = new Queue('email-dispatch', { connection: redisConnection });
export const deadLetterQueue = new Queue('dead-letter', { connection: redisConnection });

const DEFAULT_WORKER_OPTS = {
  connection: redisConnection,
  concurrency: 5,
  removeOnComplete: { count: 100 },
  removeOnFail: { count: 500 },
};

export async function setupQueues() {
  logger.info('[BullMQ] Initializing enterprise hybrid queue infrastructure');

  new Worker('fax-ingestion', async (job) => {
    const { faxId, mediaUrl, storageKey, from, to } = job.data;
    logger.info({ jobId: job.id, faxId }, 'Ingesting fax for AI processing');

    const mediaBuffer = storageKey
      ? (await storageService.downloadFile(storageKey)).body
      : null;

    let aiResult: any = { intent: 'manual_review_required', urgency: 'HIGH' };

    if (mediaBuffer) {
      aiResult = await geminiService.parseFaxIntent(Buffer.from(mediaBuffer));
    }

    const encryptedIntent = await arciumService.encrypt(JSON.stringify(aiResult));

    await ocrQueue.add('process-ocr', {
      faxId,
      from,
      to,
      aiResult,
      encryptedIntent,
      storageKey,
    });
  }, DEFAULT_WORKER_OPTS);

  new Worker('ocr-processing', async (job) => {
    const { faxId, aiResult, encryptedIntent } = job.data;
    logger.info({ jobId: job.id, faxId }, 'OCR processing complete, evaluating intent');

    const requiresApproval = aiResult.requires_approval !== false;
    const isFinancial = aiResult.intent_type === 'PURCHASE' || aiResult.intent_type === 'PAYMENT';

    if (requiresApproval || isFinancial) {
      await approvalQueue.add('init-approval', {
        faxId,
        intent: aiResult,
        encryptedIntent,
      });
    } else {
      await aiProcessingQueue.add('execute-agent', {
        faxId,
        intent: aiResult,
      });
    }
  }, DEFAULT_WORKER_OPTS);

  new Worker('ai-orchestration', async (job) => {
    const { faxId, intent } = job.data;
    logger.info({ jobId: job.id, faxId }, 'Executing agent for approved intent');

    const approvalCheck = await swigService.requestApproval('system', {
      amountUsdc: (intent.amount_jpy || 0) / 150,
      merchant: intent.items?.[0] || 'unknown',
      description: intent.raw_text || '',
    });

    if (!approvalCheck.approved && intent.amount_jpy > 5000) {
      await escalationQueue.add('manual-review', { faxId, intent });
      return;
    }

    await blockchainQueue.add('execute-transaction', {
      faxId,
      intent,
      approvalId: approvalCheck.transactionId,
    });
  }, DEFAULT_WORKER_OPTS);

  new Worker('approval-workflow', async (job) => {
    const { faxId, intent } = job.data;
    logger.info({ jobId: job.id, faxId }, 'Initiating caregiver approval workflow');

    const approvalUrl = `${env.NEXT_PUBLIC_APP_URL}/api/v1/actions/approve/${faxId}`;

    logger.info(
      { faxId, approvalUrl, amount: intent.amount_jpy },
      'Caregiver approval required — Blink URL generated',
    );
  }, DEFAULT_WORKER_OPTS);

  new Worker('blockchain-execution', async (job) => {
    const { faxId, intent, approvalId } = job.data;
    logger.info({ jobId: job.id, faxId }, 'Executing on-chain transaction');

    const amountUsdc = (intent.amount_jpy || 0) / 150;

    const moonCard = await moonPayService.createVirtualCard('agent-wallet-address');
    await moonPayService.chargeCard(moonCard.id, amountUsdc, intent.items?.[0] || 'merchant');

    await receiptQueue.add('generate-receipt', {
      faxId,
      amount: intent.amount_jpy || 0,
      merchant: intent.items?.[0] || 'InkTrust Service',
      status: 'completed',
    });
  }, DEFAULT_WORKER_OPTS);

  new Worker('receipt-generation', async (job) => {
    const { faxId, amount, merchant, status } = job.data;
    logger.info({ jobId: job.id, faxId }, 'Generating receipt fax');

    await telnyxFaxOutService.sendReceiptFax('senior-fax-number', {
      faxId,
      amount,
      merchant,
      status,
    });

    logger.info({ faxId }, 'Receipt fax sent');
  }, DEFAULT_WORKER_OPTS);

  new Worker('escalation-moderation', async (job) => {
    const { faxId, intent } = job.data;
    logger.info({ jobId: job.id, faxId }, 'Escalating to manual review');

    await dbService.createAuditReview({
      faxJobId: faxId,
      riskScore: intent.amount_jpy > 50000 ? 0.9 : 0.5,
      moderatorNotes: `Auto-escalated: ${intent.intent_type} for ¥${intent.amount_jpy}`,
    });
  }, DEFAULT_WORKER_OPTS);

  new Worker('email-dispatch', async (job) => {
    logger.info({ jobId: job.id }, 'Dispatching notification email');
  }, DEFAULT_WORKER_OPTS);

  const queueEvents = new QueueEvents('fax-ingestion', { connection: redisConnection });
  queueEvents.on('failed', ({ jobId, failedReason }) => {
    logger.error({ jobId, failedReason }, 'Critical queue job failure');
  });
}
