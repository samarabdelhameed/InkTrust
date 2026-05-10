import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('db-schema/client', () => ({
  prisma: {
    transactionRecord: {
      findMany: vi.fn().mockResolvedValue([
        { id: 'tx-1', txSignature: 'sig1', status: 'PENDING' },
        { id: 'tx-2', txSignature: 'sig2', status: 'PENDING' },
      ]),
      update: vi.fn().mockResolvedValue({}),
      count: vi.fn().mockResolvedValue(5),
    },
    faxRequest: {
      count: vi.fn().mockResolvedValue(3),
      update: vi.fn().mockResolvedValue({}),
    },
  },
}));

vi.mock('../../src/config/env', () => ({
  env: {
    SOLANA_RPC_URL: 'https://api.devnet.solana.com',
    REDIS_URL: 'redis://localhost:6379',
  },
}));

describe('DataSyncService', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('should reconcile pending transactions', async () => {
    const { DataSyncService } = await import('../../src/services/data-sync');
    const service = new DataSyncService();
    const count = await service.reconcilePendingTransactions();
    expect(count).toBe(2);
  });

  it('should return sync status', async () => {
    const { DataSyncService } = await import('../../src/services/data-sync');
    const service = new DataSyncService();
    const status = await service.getSyncStatus();
    expect(status).toHaveProperty('pendingTxCount');
    expect(status).toHaveProperty('totalTxCount');
    expect(status).toHaveProperty('contractsOnChain');
  });

  it('should support start and stop lifecycle', () => {
    const { DataSyncService } = await import('../../src/services/data-sync');
    const service = new DataSyncService();
    expect(() => service.startAutoSync()).not.toThrow();
    expect(() => service.stopAutoSync()).not.toThrow();
  });
});
