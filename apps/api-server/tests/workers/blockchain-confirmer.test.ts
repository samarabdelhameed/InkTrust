import { describe, it, expect, vi } from 'vitest';

vi.mock('../../src/config/env', () => ({
  env: { REDIS_URL: 'redis://localhost:6379' },
}));

vi.mock('ioredis', () => {
  const MockRedis = vi.fn(() => ({
    on: vi.fn(),
    quit: vi.fn(),
  }));
  return { default: MockRedis };
});

describe('BlockchainConfirmerWorker', () => {
  it('should export worker instance', async () => {
    const mod = await import('../../src/workers/blockchain-confirmer');
    expect(mod.transactionConfirmationWorker).toBeDefined();
  });
});
