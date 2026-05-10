import { Queue } from 'bullmq';
import { redis } from '../../lib/redis';

export const faxQueue = new Queue('fax-processing', {
  connection: redis,
  defaultJobOptions: {
    attempts: 5,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
  },
});
