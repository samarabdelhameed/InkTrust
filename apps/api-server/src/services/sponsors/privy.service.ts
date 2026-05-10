import { PrivyClient } from "@privy-io/server-auth";
import { logger } from "../../utils/logger";

export class PrivyService {
  private privy: PrivyClient;

  constructor() {
    this.privy = new PrivyClient(
      process.env.PRIVY_APP_ID || "",
      process.env.PRIVY_APP_SECRET || ""
    );
  }

  async provisionInvisibleWallet(userId: string) {
    try {
      // Logic for provisioning embedded wallet for elderly user
      logger.info({ userId }, "Provisioning invisible wallet via Privy");
      return { address: "0xMockWalletAddress" };
    } catch (error) {
      logger.error({ err: error }, "Privy wallet provisioning failed");
      throw error;
    }
  }

  async verifyUserIdentity(authToken: string) {
    try {
      const verifiedClaims = await this.privy.verifyAuthToken(authToken);
      return verifiedClaims;
    } catch (error) {
      logger.error({ err: error }, "Privy auth verification failed");
      throw error;
    }
  }
}

export const privyService = new PrivyService();
