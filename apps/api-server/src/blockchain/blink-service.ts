import { ActionGetResponse, ActionPostRequest, ActionPostResponse, createPostResponse } from "@solana/actions";
import { PublicKey, Transaction, VersionedTransaction } from "@solana/web3.js";
import { blockchainClient } from "./client";

export class BlinkService {
  async generateFaxApprovalBlink(faxRequestPda: string): Promise<ActionGetResponse> {
    const pda = new PublicKey(faxRequestPda);
    const state = await blockchainClient.getFaxRequestState(pda);

    return {
      icon: "https://inktrust.io/fax-icon.png",
      title: "Approve Fax Request",
      description: `Approve payment of ${state.amount.toString()} tokens for Fax Request ${faxRequestPda.slice(0, 8)}...`,
      label: "Approve Now",
      type: "action" as const,
      links: {
        actions: [
          {
            type: "post",
            label: "Approve",
            href: `/api/v1/blinks/approve?pda=${faxRequestPda}`,
          }
        ]
      }
    };
  }

  async handleBlinkPost(req: ActionPostRequest, pdaStr: string): Promise<ActionPostResponse> {
    const caregiver = new PublicKey(req.account);
    const pda = new PublicKey(pdaStr);

    const ix = await blockchainClient.program.methods
      .approveFaxRequest()
      .accounts({
        faxRequest: pda,
        caregiver: caregiver,
      })
      .instruction();

    const tx = new Transaction().add(ix);
    tx.recentBlockhash = (await blockchainClient.program.provider.connection.getLatestBlockhash()).blockhash;
    tx.feePayer = caregiver;

    return createPostResponse({
      fields: {
        transaction: tx as Transaction | VersionedTransaction,
        type: "transaction" as const,
      } as any,
    });
  }
}

export const blinkService = new BlinkService();
