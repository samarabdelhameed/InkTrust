import cors from 'cors';
import type { CorsOptions } from 'cors';

const ALLOWED_ORIGINS_ENV = process.env.CORS_ALLOWED_ORIGINS?.split(',').filter(Boolean) ?? [];

const DEV_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
];

const PHANTOM_ORIGINS = [
  'https://phantom.app',
  'https://api.phantom.app',
  'chrome-extension://*',
];

const BLINKS_ORIGINS = [
  'https://dial.to',
  'https://www.dial.to',
  'https://blinks.xyz',
  'https://solana.com',
  'https://app.dialect.to',
];

const EMBEDDED_WALLET_ORIGINS = [
  'https://auth.privy.io',
  'https://privy.io',
];

const ALLOWED_ORIGINS = [
  ...DEV_ORIGINS,
  ...PHANTOM_ORIGINS,
  ...BLINKS_ORIGINS,
  ...EMBEDDED_WALLET_ORIGINS,
  ...ALLOWED_ORIGINS_ENV,
];

const originValidation: CorsOptions['origin'] = (origin, callback) => {
  if (!origin || ALLOWED_ORIGINS.includes(origin)) {
    callback(null, true);
    return;
  }

  if (process.env.NODE_ENV === 'development') {
    callback(null, true);
    return;
  }

  if (origin?.startsWith('chrome-extension://')) {
    callback(null, true);
    return;
  }

  callback(new Error(`Origin ${origin} not allowed by CORS`));
};

export const corsConfig: CorsOptions = {
  origin: originValidation,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'x-privy-token',
    'x-phantom-app-id',
    'x-blink-version',
    'x-solana-action',
  ],
  exposedHeaders: [
    'Content-Type',
    'x-privy-token',
    'x-blink-version',
  ],
  credentials: true,
  maxAge: 86400,
};

export const createCorsMiddleware = () => cors(corsConfig);
