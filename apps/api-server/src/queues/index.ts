import { Queue, Worker, Job, QueueEvents } from 'bullmq';
import IORedis from 'ioredis';
import { env } from '../config/env';
import { logger } from '../utils/logger';
import { dataService } from 'db-schema';

const redisConnection = new IORedis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

// ============================================================
// QUEUE DEFINITIONS
// ============================================================
export const faxIngestionQueue = new Queue('fax-ingestion', { connection: redisConnection });
export const ocrQueue = new Queue('ocr-processing', { connection: redisConnection });
export const aiProcessingQueue = new Queue('ai-orchestration', { connection: redisConnection });
export const approvalQueue = new Queue('approval-workflow', { connection: redisConnection });
export const blockchainQueue = new Queue('blockchain-execution', { connection: redisConnection });
export const receiptQueue = new Queue('receipt-generation', { connection: redisConnection });
export const escalationQueue = new Queue('escalation-moderation', { connection: redisConnection });

const DEFAULT_WORKER_OPTS = {
  connection: redisConnection,
  concurrency: 5,
  removeOnComplete: { count: 100 },
  removeOnFail: { count: 500 },
};

export async function setupQueues() {
  logger.info('[BullMQ] 🛡️ Initializing enterprise hybrid queue infrastructure');

  // 1. Fax Ingestion Worker
  new Worker('fax-ingestion', async (job) => {
    logger.info({ jobId: job.id }, 'Ingesting new fax artifact');
    // Flow: Ingest -> OCR
    await ocrQueue.add('process-ocr', job.data);
  }, DEFAULT_WORKER_OPTS);

  // 2. AI Orchestration Worker
  new Worker('ai-orchestration', async (job) => {
    const { userId, intentType, intentHash } = job.data;
    const dbJob = await dataService.createAIJob({ userId, intentType, intentHash });
    
    logger.info({ jobId: dbJob.id }, 'AI Job created, initiating processing');
    // Flow: AI -> Approval
    await approvalQueue.add('init-approval', { jobId: dbJob.id });
  }, DEFAULT_WORKER_OPTS);

  // 3. Blockchain Execution Worker
  new Worker('blockchain-execution', async (job) => {
    logger.info({ jobId: job.id }, 'Executing authorized blockchain transaction');
    // Flow: Execute -> Receipt
  }, DEFAULT_WORKER_OPTS);

  // Global Error Handlers
  const queueEvents = new QueueEvents('fax-ingestion', { connection: redisConnection });
  queueEvents.on('failed', ({ jobId, failedReason }) => {
    logger.error({ jobId, failedReason }, 'Critical queue job failure');
  });
}
