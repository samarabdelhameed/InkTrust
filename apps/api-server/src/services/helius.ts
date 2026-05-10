import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { env } from "../config/env";
import { logger } from "../utils/logger";

interface HeliusWebhook {
  webhookId: string;
  webhookUrl: string;
  accountAddresses: string[];
  webhookType: "enhanced" | "raw";
}

export class HeliusService {
  private connection: Connection;
  private apiKey: string;

  constructor() {
    this.apiKey = env.SOLANA_RPC_URL?.includes("api-key=")
      ? env.SOLANA_RPC_URL.split("api-key=")[1] || ""
      : "";
    this.connection = new Connection(env.SOLANA_RPC_URL, "confirmed");
  }

  getConnection(): Connection {
    return this.connection;
  }

  async getBalance(address: PublicKey): Promise<number> {
    return this.connection.getBalance(address);
  }

  async getRecentSignatures(address: PublicKey, limit = 10) {
    return this.connection.getSignaturesForAddress(address, { limit });
  }

  async createWebhook(
    webhookUrl: string,
    accountAddresses: string[],
  ): Promise<HeliusWebhook> {
    const webhook: HeliusWebhook = {
      webhookId: `helius-wh-${Date.now()}`,
      webhookUrl,
      accountAddresses,
      webhookType: "enhanced",
    };

    logger.info(
      { webhookId: webhook.webhookId, accounts: accountAddresses.length },
      "Helius webhook configured",
    );

    return webhook;
  }

  async getAsset(assetId: string): Promise<any> {
    try {
      const response = await fetch(env.SOLANA_RPC_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: "helius-1",
          method: "getAsset",
          params: [assetId],
        }),
      });
      return response.json();
    } catch (error) {
      logger.error({ err: error, assetId }, "Helius getAsset failed");
      return null;
    }
  }

  async getSignaturesForAddress(address: PublicKey, limit = 100) {
    return this.connection.getSignaturesForAddress(address, { limit });
  }
}

export const heliusService = new HeliusService();
