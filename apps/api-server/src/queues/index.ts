import { Queue, Worker, QueueEvents } from 'bullmq';
import IORedis from 'ioredis';
import { env } from '../config/env';
import { logger } from '../utils/logger';
import { dbService } from 'db-schema';

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
    logger.info({ jobId: job.id }, 'Ingesting new fax artifact');
    await ocrQueue.add('process-ocr', job.data);
  }, DEFAULT_WORKER_OPTS);

  new Worker('ai-orchestration', async (job) => {
    const { userId, intentType, intentHash } = job.data;
    logger.info({ jobId: job.id }, 'AI job received');
    await approvalQueue.add('init-approval', { userId, intentType, intentHash });
  }, DEFAULT_WORKER_OPTS);

  new Worker('blockchain-execution', async (job) => {
    logger.info({ jobId: job.id }, 'Executing blockchain transaction');
  }, DEFAULT_WORKER_OPTS);

  new Worker('email-dispatch', async (job) => {
    logger.info({ jobId: job.id }, 'Dispatching email');
  }, DEFAULT_WORKER_OPTS);

  const queueEvents = new QueueEvents('fax-ingestion', { connection: redisConnection });
  queueEvents.on('failed', ({ jobId, failedReason }) => {
    logger.error({ jobId, failedReason }, 'Critical queue job failure');
  });
}
