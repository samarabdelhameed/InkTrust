import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

export const prisma = new PrismaClient({
  log: [
    { emit: 'event', level: 'query' },
    { emit: 'stdout', level: 'error' },
    { emit: 'stdout', level: 'info' },
    { emit: 'stdout', level: 'warn' },
  ],
});

// @ts-ignore
prisma.$on('query', (e: any) => {
  logger.debug({ query: e.query, params: e.params, duration: e.duration }, 'Database Query');
});
