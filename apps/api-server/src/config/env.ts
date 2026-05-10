import path from "path";
import { cleanEnv, str, port, url } from 'envalid';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), ".env") });
dotenv.config({ path: path.resolve(process.cwd(), "../../.env") });

export const env = cleanEnv(process.env, {
  NODE_ENV: str({ choices: ['development', 'test', 'production'], default: 'development' }),
  PORT: port({ default: 3001 }),
  DATABASE_URL: str({ default: 'postgresql://inktrust:inktrust_dev@localhost:5432/inktrust_db' }),
  REDIS_URL: str({ default: 'redis://localhost:6379' }),
  NEXT_PUBLIC_APP_URL: url({ default: 'http://localhost:3000' }),
  SOLANA_RPC_URL: url({ default: 'https://api.devnet.solana.com' }),

  // Storage
  AWS_REGION: str({ default: 'us-east-1' }),
  S3_BUCKET: str({ default: 'inktrust-assets' }),
  AWS_ACCESS_KEY_ID: str({ default: 'inktrust_admin' }),
  AWS_SECRET_ACCESS_KEY: str({ default: 'inktrust_secret' }),
  S3_ENDPOINT: str({ default: '' }),
  SES_FROM_EMAIL: str({ default: 'notifications@inktrust.io' }),
  CORS_ALLOWED_ORIGINS: str({ default: 'http://localhost:3000' }),

  // Payments (dev defaults so app doesn't crash without them)
  STRIPE_SECRET_KEY: str({ default: '' }),
  STRIPE_WEBHOOK_SECRET: str({ default: '' }),
  COINBASE_CDP_API_KEY_NAME: str({ default: '' }),
  COINBASE_CDP_API_KEY_PRIVATE_KEY: str({ default: '' }),
  SWIG_API_KEY: str({ default: '' }),
  MOONPAY_SECRET_KEY: str({ default: '' }),

  // Fax
  TELNYX_API_KEY: str({ default: '' }),
  TELNYX_PUBLIC_KEY: str({ default: '' }),
  SYSTEM_FAX_NUMBER: str({ default: '' }),

  // AI
  GEMINI_API_KEY: str({ default: '' }),
  AGENT_PRIVATE_KEY: str({ default: '' }),

  // Auth
  PRIVY_APP_ID: str({ default: '' }),
  PRIVY_APP_SECRET: str({ default: '' }),

  // World ID
  WORLD_ID_APP_ID: str({ default: '' }),
  WORLD_ID_ACTION: str({ default: 'verify_caregiver_action' }),

  // Enryption
  ENCRYPTION_KEY: str({ default: '' }),
});
