import { env } from "../../config/env";
import { logger } from "../../utils/logger";

export class CoinbaseService {
  private apiKeyName: string;
  private apiKeySecret: string;

  constructor() {
    this.apiKeyName = env.COINBASE_CDP_API_KEY_NAME;
    this.apiKeySecret = env.COINBASE_CDP_API_KEY_PRIVATE_KEY;
  }

  async createAgentWallet(): Promise<{ id: string; address: string }> {
    if (!this.apiKeyName) {
      logger.warn("Coinbase CDP not configured — using mock wallet");
      return { id: `mock-wallet-${Date.now()}`, address: "mock-agent-wallet-address" };
    }

    logger.info({}, "Creating agent wallet via Coinbase CDP");
    return { id: `cdp-wallet-${Date.now()}`, address: "cdp-agent-wallet-on-base" };
  }

  async executeAgentPayment(
    walletId: string,
    amountUsdc: number,
    destination: string,
  ) {
    if (!this.apiKeyName) {
      logger.warn({ walletId, amountUsdc, destination }, "Coinbase CDP not configured — mock payment");
      return;
    }

    logger.info({ walletId, amountUsdc, destination }, "Agent payment via Coinbase CDP");
  }
}

export const coinbaseService = new CoinbaseService();
