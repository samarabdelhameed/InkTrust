import * as anchor from "@coral-xyz/anchor";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { RPC_URLS, COMMITMENT } from "./config";
import { logger } from "../utils/logger";

let anchorIdl: any = {};
try {
  anchorIdl = require("../../../anchor/target/idl/inktrust_core.json");
} catch {
  anchorIdl = {};
}

export class BlockchainClient {
  private _connection: Connection;
  private provider: anchor.AnchorProvider;
  private _program: anchor.Program | null = null;

  constructor(network: keyof typeof RPC_URLS = "devnet") {
    this._connection = new Connection(RPC_URLS[network], COMMITMENT);
    const wallet = new anchor.Wallet(Keypair.generate());
    this.provider = new anchor.AnchorProvider(this._connection, wallet, { commitment: COMMITMENT });
    if (anchorIdl && Object.keys(anchorIdl).length > 0) {
      try {
        this._program = new anchor.Program(anchorIdl as any, this.provider);
      } catch (e) {
        logger.warn({ err: e }, "Failed to initialize Anchor program");
      }
    }
  }

  get program(): anchor.Program {
    if (!this._program) {
      throw new Error("Anchor program not initialized — deploy smart contract first");
    }
    return this._program;
  }

  get connection(): Connection {
    return this._connection;
  }

  get isReady(): boolean {
    return this._program !== null;
  }

  async getFaxRequestState(pda: PublicKey) {
    try {
      if (!this._program) throw new Error("Program not ready");
      return await (this._program.account as any).faxRequestState.fetch(pda);
    } catch {
      return { owner: PublicKey.default, caregiver: PublicKey.default, amount: 0, intent_hash: new Uint8Array(32), is_approved: false, is_executed: false, created_at: 0, bump: 0 };
    }
  }

  async getBalance(pubkey: PublicKey) {
    return await this._connection.getBalance(pubkey);
  }

  async getTransactionSignature(sig: string) {
    return await this._connection.getTransaction(sig, { maxSupportedTransactionVersion: 0 });
  }
}

export const blockchainClient = new BlockchainClient();
