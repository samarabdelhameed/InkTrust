import { Queue, Worker, Job, QueueEvents } from 'bullmq';
import IORedis from 'ioredis';
import { env } from '../config/env';
import { logger } from '../utils/logger';

const redisConnection = new IORedis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

export const faxQueue = new Queue('fax-processing', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 5,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
    removeOnComplete: true,
    removeOnFail: false, // Keep failed jobs for DLQ analysis
  },
});

export async function setupQueues() {
  logger.info('[BullMQ] 🐂 Initializing hardened queues and workers');

  const worker = new Worker(
    'fax-processing',
    async (job: Job) => {
      logger.debug({ jobId: job.id }, 'Processing fax job');
      // Real processing logic would go here (e.g. AI parsing, blockchain broadcast)
    },
    {
      connection: redisConnection,
      concurrency: 5,
    }
  );

  worker.on('failed', (job, err) => {
    logger.error({ jobId: job?.id, err }, 'Job failed');
  });

  worker.on('stalled', (jobId) => {
    logger.warn({ jobId }, 'Job stalled');
  });
}
