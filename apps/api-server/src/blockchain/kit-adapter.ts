import {
  createSolanaRpc,
  createSolanaRpcSubscriptions,
  address,
  getSignatureFromTransaction,
  pipe,
  appendTransactionMessageInstruction,
  setTransactionMessageFeePayerSigner,
  createTransactionMessage,
  signTransactionMessageWithSigners,
  compileTransactionMessage,
  getBase64EncodedWireTransaction,
  type TransactionWithSigners,
  type Rpc,
  type RpcSubscriptions,
  type Address,
  airdropFactory,
  getSetComputeUnitLimitInstruction,
  getSetComputeUnitPriceInstruction,
} from "@solana/kit";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { env } from "../config/env";
import { logger } from "../utils/logger";

interface KitSigner {
  address: Address;
  signTransaction: (tx: TransactionWithSigners) => Promise<TransactionWithSigners>;
}

export class SolanaKitService {
  rpc: Rpc;
  subscriptions: RpcSubscriptions;
  private signers: KitSigner[] = [];

  constructor() {
    this.rpc = createSolanaRpc(env.SOLANA_RPC_URL);
    this.subscriptions = createSolanaRpcSubscriptions(
      env.SOLANA_RPC_URL.replace("https://", "wss://").replace("http://", "ws://")
    );
  }

  registerSigner(signer: KitSigner) {
    this.signers.push(signer);
  }

  async getBalance(pubkey: string): Promise<bigint> {
    const { value } = await this.rpc.getBalance(address(pubkey)).send();
    return value;
  }

  async getSlot(): Promise<bigint> {
    return this.rpc.getSlot().send();
  }

  async buildAndSendTransaction(instructions: any[], feePayer: string, priorityFee?: bigint) {
    let tx = createTransactionMessage({ version: 0 });
    tx = setTransactionMessageFeePayerSigner(address(feePayer), tx);
    const feePayerSigner = this.signers.find(s => s.address === address(feePayer));
    if (!feePayerSigner) throw new Error(`No signer registered for ${feePayer}`);

    const allInstructions = [...instructions];
    if (priorityFee) {
      allInstructions.unshift(getSetComputeUnitPriceInstruction({ microLamports: priorityFee }));
    }
    allInstructions.unshift(getSetComputeUnitLimitInstruction({ units: 200_000 }));

    for (const ix of allInstructions) {
      tx = appendTransactionMessageInstruction(ix, tx);
    }

    const { value: blockhash } = await this.rpc.getLatestBlockhash().send();
    tx = { ...tx, blockhash };

    const signedTx = await feePayerSigner.signTransaction(tx);
    const compiled = compileTransactionMessage(signedTx);
    const wireTx = getBase64EncodedWireTransaction(compiled);
    const sig = await this.rpc.sendTransaction(wireTx).send();
    return sig;
  }

  async monitorSignature(signature: string, timeoutMs = 30000) {
    const sig = await this.rpc.getSignatureStatuses([signature]).send();
    return sig.value[0];
  }

  async requestAirdrop(pubkey: string, lamports: bigint) {
    const airdrop = airdropFactory({ rpc: this.rpc });
    return airdrop({ recipientAddress: address(pubkey), lamports, commitment: "confirmed" });
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
