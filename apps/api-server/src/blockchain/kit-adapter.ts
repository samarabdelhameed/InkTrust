import { createSolanaRpc, createSolanaRpcSubscriptions, address } from "@solana/kit";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { env } from "../config/env";
import { logger } from "../utils/logger";

export class SolanaKitService {
  private rpc: ReturnType<typeof createSolanaRpc>;
  private subscriptions: ReturnType<typeof createSolanaRpcSubscriptions>;

  constructor() {
    this.rpc = createSolanaRpc(env.SOLANA_RPC_URL);
    this.subscriptions = createSolanaRpcSubscriptions(env.SOLANA_RPC_URL.replace("http", "ws"));
  }

  async getAccountBalance(pubkey: string) {
    try {
      const { value } = await this.rpc.getBalance(address(pubkey)).send();
      return value;
    } catch (error) {
      logger.error({ err: error, pubkey }, "Failed to fetch balance via Solana Kit");
      throw error;
    }
  }

  // Adapter to convert @solana/kit primitives back to @solana/web3.js if needed for Anchor
  getLegacyConnection(): Connection {
    return new Connection(env.SOLANA_RPC_URL, "confirmed");
  }

  async monitorTransaction(signature: string) {
    logger.info({ signature }, "Monitoring transaction via Solana Kit subscriptions");
    // Implementation of modern subscription logic
  }
}

export const solanaKit = new SolanaKitService();
