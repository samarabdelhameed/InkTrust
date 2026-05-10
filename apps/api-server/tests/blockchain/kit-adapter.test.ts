import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../src/config/env', () => ({
  env: {
    SOLANA_RPC_URL: 'https://api.devnet.solana.com',
  },
}));

describe('SolanaKitService', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('should be instantiated with RPC and subscriptions', async () => {
    const { SolanaKitService } = await import('../../src/blockchain/kit-adapter');
    const kit = new SolanaKitService();
    expect(kit.rpc).toBeDefined();
    expect(kit.subscriptions).toBeDefined();
  });

  it('should provide legacy connection', async () => {
    const { SolanaKitService } = await import('../../src/blockchain/kit-adapter');
    const kit = new SolanaKitService();
    const conn = kit.getLegacyConnection();
    expect(conn).toBeDefined();
  });
});
