import {
  createSolanaRpc,
  createSolanaRpcSubscriptions,
  address,
} from "@solana/kit";
import { Connection } from "@solana/web3.js";
import { env } from "../config/env";
import { logger } from "../utils/logger";

export class SolanaKitService {
  rpc: ReturnType<typeof createSolanaRpc>;
  subscriptions: ReturnType<typeof createSolanaRpcSubscriptions>;

  constructor() {
    this.rpc = createSolanaRpc(env.SOLANA_RPC_URL);
    this.subscriptions = createSolanaRpcSubscriptions(
      env.SOLANA_RPC_URL.replace("https://", "wss://").replace("http://", "ws://")
    );
  }

  async getBalance(pubkey: string): Promise<bigint> {
    const { value } = await this.rpc.getBalance(address(pubkey)).send();
    return value;
  }

  async getSlot(): Promise<bigint> {
    return this.rpc.getSlot().send();
  }

  async getLatestBlockhash() {
    return this.rpc.getLatestBlockhash().send();
  }

  async sendTransaction(wireTx: string): Promise<string> {
    const sig = await this.rpc.sendTransaction(wireTx).send();
    return sig;
  }

  async monitorSignature(signature: string) {
    const sig = await this.rpc.getSignatureStatuses([signature]).send();
    return sig.value[0];
  }

  getLegacyConnection(): Connection {
    return new Connection(env.SOLANA_RPC_URL, "confirmed");
  }

  async onSlotChange(callback: (slot: bigint) => void) {
    const sub = await this.subscriptions.slotNotifications().subscribe({ abortSignal: AbortSignal.timeout(0) });
    (async () => {
      for await (const notif of sub) {
        callback(notif.slot);
      }
    })();
  }
}

export const solanaKit = new SolanaKitService();
