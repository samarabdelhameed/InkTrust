import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { InktrustCore } from "../target/types/inktrust_core";
import { expect } from "chai";
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

describe("inktrust_core", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.InktrustCore as Program<InktrustCore>;
  
  const owner = Keypair.generate();
  const caregiver = Keypair.generate();
  const recipient = Keypair.generate();
  const intentHash = Array.from(anchor.utils.bytes.utf8.encode("fax_intent_1")).concat(new Array(20).fill(0)).slice(0, 32);
  
  let faxRequestPda: PublicKey;
  let approvalPda: PublicKey;
  let mint: PublicKey;
  let ownerTokenAccount: PublicKey;
  let recipientTokenAccount: PublicKey;

  before(async () => {
    // Airdrop SOL
    const sig = await provider.connection.requestAirdrop(owner.publicKey, 2 * LAMPORTS_PER_SOL);
    await provider.connection.confirmTransaction(sig);
    await provider.connection.requestAirdrop(caregiver.publicKey, LAMPORTS_PER_SOL);

    // Create Mint
    mint = await createMint(provider.connection, owner, owner.publicKey, null, 6);

    // Create Token Accounts
    ownerTokenAccount = (await getOrCreateAssociatedTokenAccount(provider.connection, owner, mint, owner.publicKey)).address;
    recipientTokenAccount = (await getOrCreateAssociatedTokenAccount(provider.connection, owner, mint, recipient.publicKey)).address;

    // Mint tokens to owner
    await mintTo(provider.connection, owner, mint, ownerTokenAccount, owner, 1000_000);

    // Derive PDAs
    [faxRequestPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("fax_request"), owner.publicKey.toBuffer(), Buffer.from(intentHash)],
      program.programId
    );
    [approvalPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("approval"), faxRequestPda.toBuffer(), caregiver.publicKey.toBuffer()],
      program.programId
    );
  });

  it("Creates a Fax Request", async () => {
    const amount = new anchor.BN(500_000);
    const expiresAt = new anchor.BN(Math.floor(Date.now() / 1000) + 3600);

    await program.methods
      .createFaxRequest(amount, intentHash, expiresAt)
      .accounts({
        faxRequest: faxRequestPda,
        owner: owner.publicKey,
        caregiver: caregiver.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([owner])
      .rpc();

    const state = await program.account.faxRequestState.fetch(faxRequestPda);
    expect(state.owner.toBase58()).to.equal(owner.publicKey.toBase58());
    expect(state.isApproved).to.be.false;
  });

  it("Approves a Fax Request", async () => {
    await program.methods
      .approveFaxRequest()
      .accounts({
        faxRequest: faxRequestPda,
        approval: approvalPda,
        caregiver: caregiver.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([caregiver])
      .rpc();

    const state = await program.account.faxRequestState.fetch(faxRequestPda);
    expect(state.isApproved).to.be.true;
  });

  it("Executes a Transaction", async () => {
    await program.methods
      .executeTransaction()
      .accounts({
        faxRequest: faxRequestPda,
        owner: owner.publicKey,
        recipient: recipient.publicKey,
        ownerTokenAccount: ownerTokenAccount,
        recipientTokenAccount: recipientTokenAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([owner])
      .rpc();

    const state = await program.account.faxRequestState.fetch(faxRequestPda);
    expect(state.isExecuted).to.be.true;
  });
});
