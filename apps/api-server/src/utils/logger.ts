import pino from 'pino';
import { env } from '../config/env';

const transport = env.isDevelopment
  ? {
      target: 'pino-pretty',
      options: {
        colorize: true,
        levelFirst: true,
        translateTime: 'yyyy-mm-dd HH:MM:ss Z',
      },
    }
  : undefined;

export const logger = pino({
  level: env.isProduction ? 'info' : 'debug',
  base: {
    env: env.NODE_ENV,
    service: 'inktrust-api',
  },
  transport,
});
