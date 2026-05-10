import { env } from "../config/env";
import { logger } from "../utils/logger";
import { dbService } from "db-schema";

interface WorldIdProof {
  merkle_root: string;
  nullifier_hash: string;
  proof: string;
  verification_level: string;
}

interface WorldIdVerifyResponse {
  success: boolean;
  action_id: string;
  nullifier_hash: string;
  merkle_root: string;
}

export class WorldIdService {
  private appId: string;
  private action: string;

  constructor() {
    this.appId = env.WORLD_ID_APP_ID;
    this.action = env.WORLD_ID_ACTION;
  }

  async verifyProof(proof: WorldIdProof, signal?: string): Promise<WorldIdVerifyResponse> {
    try {
      const response = await fetch(
        `https://developer.worldcoin.org/api/v2/verify/${this.appId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            merkle_root: proof.merkle_root,
            nullifier_hash: proof.nullifier_hash,
            proof: proof.proof,
            verification_level: proof.verification_level || "orb",
            action: this.action,
            signal: signal || "",
          }),
        },
      );

      const result: WorldIdVerifyResponse = await response.json() as WorldIdVerifyResponse;

      if (result.success) {
        logger.info({ nullifierHash: result.nullifier_hash }, "World ID verification successful");
      } else {
        logger.warn({ nullifierHash: proof.nullifier_hash }, "World ID verification failed");
      }

      return result;
    } catch (error) {
      logger.error({ err: error }, "World ID verification request failed");
      throw error;
    }
  }

  async storeVerification(userId: string, proof: WorldIdProof): Promise<void> {
    await dbService.createVerification({
      userId,
      nullifierHash: proof.nullifier_hash,
      merkleRoot: proof.merkle_root,
      proof: proof.proof,
    });
    logger.info({ userId }, "World ID verification stored in database");
  }
}

export const worldIdService = new WorldIdService();
