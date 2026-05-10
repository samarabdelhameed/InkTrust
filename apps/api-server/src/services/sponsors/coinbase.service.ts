import { Coinbase, Wallet } from "@coinbase/coinbase-sdk";
import { logger } from "../../lib/logger";
import { env } from "../../lib/env";

export class CoinbaseService {
  private coinbase: Coinbase;

  constructor() {
    this.coinbase = new Coinbase({
      apiKeyName: process.env.CDP_API_KEY_NAME || "",
      privateKey: process.env.CDP_API_KEY_SECRET || "",
    });
  }

  async createAgentWallet() {
    try {
      const wallet = await Wallet.create();
      logger.info({ walletId: wallet.getId() }, "Agent Wallet created via Coinbase CDP");
      return wallet;
    } catch (error) {
      logger.error({ err: error }, "Failed to create wallet via Coinbase CDP");
      throw error;
    }
  }

  async executeAgentPayment(walletId: string, amount: number, destination: string) {
    // Logic for agentic commerce payment using Coinbase SDK
    logger.info({ walletId, amount, destination }, "Executing agentic payment via Coinbase CDP");
  }
}

export const coinbaseService = new CoinbaseService();
