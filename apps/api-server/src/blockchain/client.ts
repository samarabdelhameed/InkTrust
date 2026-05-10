import * as anchor from "@coral-xyz/anchor";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { RPC_URLS, COMMITMENT, PROGRAM_ID } from "./config";
import { InktrustCore } from "../../../anchor/target/types/inktrust_core";
import IDL from "../../../anchor/target/idl/inktrust_core.json";

export class BlockchainClient {
  private connection: Connection;
  private provider: anchor.AnchorProvider;
  public program: anchor.Program<InktrustCore>;

  constructor(network: keyof typeof RPC_URLS = "devnet") {
    this.connection = new Connection(RPC_URLS[network], COMMITMENT);
    // Mock wallet for server-side read-only operations
    const wallet = new anchor.Wallet(Keypair.generate());
    this.provider = new anchor.AnchorProvider(this.connection, wallet, { commitment: COMMITMENT });
    this.program = new anchor.Program(IDL as any, this.provider);
  }

  async getFaxRequestState(pda: PublicKey) {
    return await this.program.account.faxRequestState.fetch(pda);
  }

  async getBalance(pubkey: PublicKey) {
    return await this.connection.getBalance(pubkey);
  }

  async getTransactionSignature(sig: string) {
    return await this.connection.getTransaction(sig, { maxSupportedTransactionVersion: 0 });
  }
}

export const blockchainClient = new BlockchainClient();
