import { PrivyClient } from "@privy-io/server-auth";
import { logger } from "../../utils/logger";
import { env } from "../../config/env";

interface PrivyWallet {
  id: string;
  address: string;
  chain_type: string;
}

export class PrivyService {
  private privy: PrivyClient;
  private readonly apiBase = "https://api.privy.io";
  private readonly basicAuth: string;

  constructor() {
    const appId = process.env.PRIVY_APP_ID || "";
    const appSecret = process.env.PRIVY_APP_SECRET || "";
    this.privy = new PrivyClient(appId, appSecret);
    this.basicAuth = Buffer.from(`${appId}:${appSecret}`).toString("base64");
  }

  async provisionInvisibleWallet(userId: string) {
    const wallet = await this.createWallet();
    if (wallet) {
      logger.info({ userId, walletId: wallet.id, address: wallet.address }, "Privy wallet provisioned successfully");
      return { address: wallet.address, id: wallet.id };
    }
    logger.error({ userId }, "Failed to provision Privy wallet");
    throw new Error("Privy wallet provisioning failed");
  }

  private async createWallet(chainType: string = "solana"): Promise<PrivyWallet | null> {
    if (!env.PRIVY_APP_ID || !env.PRIVY_APP_SECRET) {
      logger.warn("Privy credentials not set");
      return null;
    }
    try {
      const res = await fetch(`${this.apiBase}/v1/wallets`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${this.basicAuth}`,
          "privy-app-id": env.PRIVY_APP_ID,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chain_type: chainType }),
      });
      if (!res.ok) {
        const text = await res.text();
        logger.warn({ status: res.status, body: text }, "Privy wallet API error");
        return null;
      }
      const wallet = (await res.json()) as PrivyWallet;
      return wallet;
    } catch (err: any) {
      logger.warn({ err: err.message }, "Privy create wallet request failed");
      return null;
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
