import { Request, Response } from "express";
import { env } from "../config/env";
import { logger } from "../utils/logger";
import { worldIdService } from "../services/world-id";

export const authController = {
  verifyWorldId: async (req: Request, res: Response) => {
    try {
      const { userId, merkle_root, nullifier_hash, proof, verification_level } = req.body;

      if (!userId || !merkle_root || !nullifier_hash || !proof) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const result = await worldIdService.verifyProof({
        merkle_root,
        nullifier_hash,
        proof,
        verification_level: verification_level || "orb",
      });

      if (result.success) {
        await worldIdService.storeVerification(userId, {
          merkle_root,
          nullifier_hash,
          proof,
          verification_level: verification_level || "orb",
        });

        logger.info({ userId }, "World ID verification complete");
        return res.json({ verified: true, nullifier_hash: result.nullifier_hash });
      }

      res.status(400).json({ verified: false, error: "Proof verification failed" });
    } catch (error) {
      logger.error({ err: error }, "World ID verification error");
      res.status(500).json({ error: "Verification failed" });
    }
  },

  privyWebhook: async (req: Request, res: Response) => {
    try {
      const { userId, walletAddress } = req.body;
      logger.info({ userId, walletAddress }, "Privy wallet provisioned");
      res.json({ status: "wallet_provisioned" });
    } catch (error) {
      logger.error({ err: error }, "Privy webhook error");
      res.status(500).json({ error: "Privy webhook failed" });
    }
  },
};
