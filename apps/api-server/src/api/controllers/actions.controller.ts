import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { logger } from '../../lib/logger';
import { Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { env } from '../../lib/env';

export class ActionsController {
  static async getActionMetadata(req: Request, res: Response) {
    const { jobId } = req.params;

    try {
      const job = await prisma.faxJob.findUnique({
        where: { id: jobId },
        include: { user: true },
      });

      if (!job) return res.status(404).json({ error: 'Job not found' });

      const payload = {
        icon: 'https://inktrust.io/logo.png',
        label: 'Approve Payment',
        title: `Authorize payment for ${job.merchant}`,
        description: `User ${job.user.faxNumber} is requesting to pay ${job.amount} SOL to ${job.merchant}.`,
        links: {
          actions: [
            {
              label: 'Approve & Sign',
              href: `/api/actions/approve/${jobId}`,
            },
          ],
        },
      };

      return res.json(payload);
    } catch (error) {
      logger.error({ err: error }, 'Failed to get action metadata');
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async buildApproveTransaction(req: Request, res: Response) {
    const { jobId } = req.params;
    const { account } = req.body; // Caregiver wallet address

    try {
      const job = await prisma.faxJob.findUnique({
        where: { id: jobId },
        include: { user: true },
      });

      if (!job) return res.status(404).json({ error: 'Job not found' });

      const connection = new Connection(env.SOLANA_RPC_URL, 'confirmed');
      const caregiverPubkey = new PublicKey(account);
      
      // Building a mock approval transaction
      // In reality, this would be a CPI call to the Anchor program
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: caregiverPubkey,
          toPubkey: new PublicKey(job.user.embeddedWalletAddress),
          lamports: 0, // Zero SOL transfer, just for signature audit
        })
      );

      transaction.feePayer = caregiverPubkey;
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;

      const serializedTx = transaction.serialize({
        requireAllSignatures: false,
        verifySignatures: false,
      }).toString('base64');

      return res.json({
        transaction: serializedTx,
        message: `Approve payment of ${job.amount} SOL to ${job.merchant}`,
      });
    } catch (error) {
      logger.error({ err: error }, 'Failed to build approval transaction');
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}
