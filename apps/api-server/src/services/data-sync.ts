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

  async syncTransactionToChain(txRecord: {
    id: string;
    userId: string;
    amount: number;
    currency: string;
    txSignature: string;
  }) {
    try {
      const sig = await this.connection.getTransaction(txRecord.txSignature, {
        maxSupportedTransactionVersion: 0,
      });
      if (sig) {
        await prisma.transactionRecord.update({
          where: { id: txRecord.id },
          data: {
            status: 'CONFIRMED',
            confirmedAt: new Date(sig.blockTime! * 1000),
          },
        });
      }
    } catch (error) {
      logger.error({ err: error, txId: txRecord.id }, 'Failed to sync transaction to chain');
    }
  }

  async syncPdaState(faxRequestId: string, pdaAddress: string) {
    try {
      const state = await this.connection.getAccountInfo(new PublicKey(pdaAddress));
      if (!state) return null;

      await prisma.faxRequest.update({
        where: { id: faxRequestId },
        data: { onchainPda: pdaAddress },
      });
      return state;
    } catch (error) {
      logger.error({ err: error, faxRequestId, pdaAddress }, 'Failed to sync PDA state');
      return null;
    }
  }

  async reconcilePendingTransactions() {
    const pending = await prisma.transactionRecord.findMany({
      where: { status: 'PENDING', txSignature: { not: null } },
    });

    for (const tx of pending) {
      if (tx.txSignature) {
        await blockchainQueue.add('confirm-transaction', {
          transactionId: tx.id,
          signature: tx.txSignature,
        });
      }
    }
    return pending.length;
  }

  async syncAllPendingTransactions() {
    const count = await this.reconcilePendingTransactions();
    logger.info({ count }, 'Reconciled pending transactions');
  }

  startAutoSync() {
    const interval = setInterval(() => this.syncAllPendingTransactions(), this.syncIntervalMs);
    this.intervals.push(interval);
    logger.info({ intervalMs: this.syncIntervalMs }, 'Data sync started');
  }

  stopAutoSync() {
    this.intervals.forEach(clearInterval);
    this.intervals = [];
    logger.info('Data sync stopped');
  }

  async getSyncStatus() {
    const pendingTxCount = await prisma.transactionRecord.count({ where: { status: 'PENDING' } });
    const totalTxCount = await prisma.transactionRecord.count();
    const contractsOnChain = await prisma.faxRequest.count({ where: { onchainPda: { not: null } } });
    return { pendingTxCount, totalTxCount, contractsOnChain };
  }
}

export const dataSyncService = new DataSyncService();
