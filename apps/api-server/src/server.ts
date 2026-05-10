import app from './app';
import { env } from './lib/env';
import { logger } from './lib/logger';
import { setupFaxWorker } from './queues/workers/fax-worker';
import { prisma } from './lib/prisma';

const startServer = async () => {
  try {
    // 1. Validate DB Connection
    await prisma.$connect();
    logger.info('Database connected successfully');

    // 2. Initialize Workers
    setupFaxWorker();
    logger.info('Fax workers initialized');

    // 3. Listen
    const port = env.PORT || 3001;
    app.listen(port, () => {
      logger.info(`🚀 InkTrust API Server running on port ${port}`);
    });
  } catch (error) {
    logger.error({ err: error }, 'Failed to start server');
    process.exit(1);
  }
};

startServer();
