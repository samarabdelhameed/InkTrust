import { prisma } from 'db-schema/client';
import { Connection, PublicKey } from '@solana/web3.js';
import { env } from '../config/env';
import { logger } from '../utils/logger';
import { blockchainQueue } from '../queues';

export class DataSyncService {
  private connection: Connection;
  private syncIntervalMs = 30_000;
  private intervals: ReturnType<typeof setInterval>[] = [];

  constructor() {
    this.connection = new Connection(env.SOLANA_RPC_URL, 'confirmed');
  }

  async syncTransaction(txRecord: {
    id: string;
    txSignature: string;
  }) {
    try {
      const sig = await this.connection.getTransaction(txRecord.txSignature, {
        maxSupportedTransactionVersion: 0,
      });
      if (sig) {
        await prisma.transaction.update({
          where: { id: txRecord.id },
          data: { status: 'CONFIRMED' },
        });
      }
    } catch (error) {
      logger.error({ err: error, txId: txRecord.id }, 'Failed to sync transaction');
    }
  }

  async reconcilePendingTransactions() {
    const pending = await prisma.transaction.findMany({
      where: { status: 'PENDING' },
    });

    for (const tx of pending) {
      await blockchainQueue.add('confirm-transaction', {
        transactionId: tx.id,
        signature: tx.txSignature,
      });
    }
    return pending.length;
  }

  async syncAllPending() {
    const count = await this.reconcilePendingTransactions();
    logger.info({ count }, 'Reconciled pending transactions');
  }

  startAutoSync() {
    const interval = setInterval(() => this.syncAllPending(), this.syncIntervalMs);
    this.intervals.push(interval);
    logger.info({ intervalMs: this.syncIntervalMs }, 'Data sync started');
  }

  stopAutoSync() {
    this.intervals.forEach(clearInterval);
    this.intervals = [];
    logger.info('Data sync stopped');
  }

  async getSyncStatus() {
    const pendingTxCount = await prisma.transaction.count({ where: { status: 'PENDING' } });
    const totalTxCount = await prisma.transaction.count();
    return { pendingTxCount, totalTxCount };
  }
}

export const dataSyncService = new DataSyncService();
