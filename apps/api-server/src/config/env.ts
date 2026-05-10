import { cleanEnv, str, port, url, host } from 'envalid';
import dotenv from 'dotenv';

dotenv.config();

export const env = cleanEnv(process.env, {
  NODE_ENV: str({ choices: ['development', 'test', 'production'], default: 'development' }),
  PORT: port({ default: 3001 }),
  DATABASE_URL: str(),
  REDIS_URL: str({ default: 'redis://localhost:6379' }),
  NEXT_PUBLIC_APP_URL: url({ default: 'http://localhost:3000' }),
  SOLANA_RPC_URL: url({ default: 'https://api.devnet.solana.com' }),
  AWS_REGION: str({ default: 'us-east-1' }),
  S3_BUCKET: str({ default: 'inktrust-assets' }),
  AWS_ACCESS_KEY_ID: str(),
  AWS_SECRET_ACCESS_KEY: str(),
  SES_FROM_EMAIL: str({ default: 'notifications@inktrust.io' }),
  STRIPE_SECRET_KEY: str({ devDefault: 'sk_test_mock' }),
  STRIPE_WEBHOOK_SECRET: str({ devDefault: 'whsec_mock' }),
});
