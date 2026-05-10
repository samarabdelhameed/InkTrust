import * as anchor from "@coral-xyz/anchor";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { RPC_URLS, COMMITMENT, PROGRAM_ID } from "./config";

let anchorTypes: any;
let anchorIdl: any;
try {
  anchorTypes = require("../../../anchor/target/types/inktrust_core");
  anchorIdl = require("../../../anchor/target/idl/inktrust_core.json");
} catch {
  anchorTypes = {};
  anchorIdl = {};
}

export class BlockchainClient {
  private connection: Connection;
  private provider: anchor.AnchorProvider;
  public program: anchor.Program;

  constructor(network: keyof typeof RPC_URLS = "devnet") {
    this.connection = new Connection(RPC_URLS[network], COMMITMENT);
    const wallet = new anchor.Wallet(Keypair.generate());
    this.provider = new anchor.AnchorProvider(this.connection, wallet, { commitment: COMMITMENT });
    this.program = new anchor.Program(anchorIdl as any, this.provider);
  }

  async getFaxRequestState(pda: PublicKey) {
    try {
      return await this.program.account.faxRequestState.fetch(pda);
    } catch {
      return { owner: PublicKey.default, caregiver: PublicKey.default, amount: 0, intent_hash: new Uint8Array(32), is_approved: false, is_executed: false, created_at: 0, bump: 0 };
    }
  }

  async getBalance(pubkey: PublicKey) {
    return await this.connection.getBalance(pubkey);
  }

  async getTransactionSignature(sig: string) {
    return await this.connection.getTransaction(sig, { maxSupportedTransactionVersion: 0 });
  }
}

export const blockchainClient = new BlockchainClient();
