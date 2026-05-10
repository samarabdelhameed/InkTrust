import { Connection, Commitment } from '@solana/web3.js';
import { logger } from '../utils/logger';

export interface RPCConfig {
  url: string;
  weight: number;
}

export class BlockchainResilienceManager {
  private connections: { connection: Connection; weight: number }[] = [];
  private currentIdx = 0;

  constructor(rpcConfigs: RPCConfig[], commitment: Commitment = 'confirmed') {
    this.connections = rpcConfigs.map((config) => ({
      connection: new Connection(config.url, commitment),
      weight: config.weight,
    }));
  }

  async getConnection(): Promise<Connection> {
    const conn = this.connections[this.currentIdx].connection;
    try {
      // Quick health check
      await conn.getSlot();
      return conn;
    } catch (error) {
      logger.warn(`RPC ${this.connections[this.currentIdx].connection.rpcEndpoint} failed, switching...`);
      this.currentIdx = (this.currentIdx + 1) % this.connections.length;
      return this.getConnection();
    }
  }

  async sendWithRetry(tx: Buffer, retries = 3): Promise<string> {
    const connection = await this.getConnection();
    for (let i = 0; i < retries; i++) {
      try {
        const sig = await connection.sendRawTransaction(tx, {
          skipPreflight: false,
          maxRetries: 2,
        });
        return sig;
      } catch (error) {
        if (i === retries - 1) throw error;
        logger.error({ err: error, attempt: i + 1 }, 'Transaction broadcast failed');
        await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
    throw new Error('Transaction failed after retries');
  }
}

export const resilienceManager = new BlockchainResilienceManager([
  { url: process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com', weight: 100 },
  { url: 'https://api.devnet.solana.com', weight: 50 }, // Fallback to public
]);
