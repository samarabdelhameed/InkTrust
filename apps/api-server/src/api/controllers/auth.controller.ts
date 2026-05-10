import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { logger } from '../../lib/logger';
import axios from 'axios';

export class AuthController {
  static async verifyWorldId(req: Request, res: Response) {
    const { userId, proof, nullifierHash, merkleRoot } = req.body;

    try {
      // In production, verify against World ID API
      // const response = await axios.post('https://developer.worldcoin.org/api/v1/verify', { ... });
      
      const isVerified = true; // Mocking success for demo, but structure is real

      if (isVerified) {
        await prisma.worldIdVerification.create({
          data: {
            userId,
            nullifierHash,
            merkleRoot,
            proof,
          },
        });

        await prisma.user.update({
          where: { id: userId },
          data: { worldIdVerified: true },
        });

        return res.json({ status: 'verified' });
      }

      return res.status(400).json({ error: 'Verification failed' });
    } catch (error) {
      logger.error({ err: error }, 'World ID verification failed');
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}
