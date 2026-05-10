import { Worker } from 'bullmq';
import { redis } from '../../lib/redis';
import { faxProcessor } from '../processors/fax-processor';
import { logger } from '../../lib/logger';

export const setupFaxWorker = () => {
  const worker = new Worker('fax-processing', faxProcessor, {
    connection: redis,
    concurrency: 5,
  });

  worker.on('completed', (job) => {
    logger.info({ jobId: job.id }, 'Fax job completed successfully');
  });

  worker.on('failed', (job, err) => {
    logger.error({ jobId: job?.id, err }, 'Fax job failed');
  });

  return worker;
};
