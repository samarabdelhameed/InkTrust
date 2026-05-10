import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import { env } from '../config/env';
import { logger } from '../utils/logger';
import { dataSyncService } from '../services/data-sync';

const connection = new IORedis(env.REDIS_URL, { maxRetriesPerRequest: null });

export const transactionConfirmationWorker = new Worker(
  'blockchain-execution',
  async (job) => {
    const { transactionId, signature } = job.data;
    logger.info({ transactionId, signature }, 'Confirming blockchain transaction');

    await dataSyncService.syncTransaction({
      id: transactionId,
      txSignature: signature,
    });

    return { confirmed: true, transactionId };
  },
  {
    connection,
    concurrency: 10,
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 500 },
  }
);

transactionConfirmationWorker.on('completed', (job) => {
  logger.info({ jobId: job.id }, 'Transaction confirmation completed');
});

transactionConfirmationWorker.on('failed', (job, err) => {
  logger.error({ jobId: job?.id, err }, 'Transaction confirmation failed');
});
