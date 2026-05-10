
import * as anchor from "@coral-xyz/anchor";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as fs from "fs";
import * as path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.join(__dirname, "../../../.env") });

// Setup Provider
const connection = new Connection("https://api.devnet.solana.com", "confirmed");
const walletPath = path.join(process.env.HOME || "", ".config/solana/id.json");
const walletKeypair = Keypair.fromSecretKey(
  Uint8Array.from(JSON.parse(fs.readFileSync(walletPath, "utf-8")))
);
const wallet = new anchor.Wallet(walletKeypair);
const provider = new anchor.AnchorProvider(connection, wallet, { commitment: "confirmed" });

// Load IDL
const idlPath = path.join(__dirname, "../../../anchor/target/idl/inktrust_core.json");
const idl = JSON.parse(fs.readFileSync(idlPath, "utf-8"));
const program = new anchor.Program(idl, provider);

// AI Config
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const SYSTEM_PROMPT = `Analyze the fax and detect if there's a circle around "APPROVE" (承認). Return JSON: { "circle_detected": "APPROVE" | "REJECT" | null, "intent": "APPROVAL" }`;

async function runDemo() {
  console.log("🚀 Starting Full InkTrust Circle-to-Approve Demo...");
  console.log("Owner Wallet:", wallet.publicKey.toBase58());

  // 1. Create a Fax Request on-chain
  const amount = new anchor.BN(5680); // Matching the generated image
  const intentHash = Array.from(crypto.getRandomValues(new Uint8Array(32)));
  const expiresAt = new anchor.BN(Math.floor(Date.now() / 1000) + 86400);
  const caregiver = Keypair.generate().publicKey;

  const [faxRequestPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("fax_request"), wallet.publicKey.toBuffer(), Buffer.from(intentHash)],
    program.programId
  );

  console.log("Creating Fax Request PDA:", faxRequestPda.toBase58());

  try {
    const tx = await program.methods
      .createFaxRequest(amount, intentHash as any, expiresAt)
      .accounts({
        faxRequest: faxRequestPda,
        owner: wallet.publicKey,
        caregiver: caregiver,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();
    console.log("✅ On-chain Fax Request Created! TX:", tx);
  } catch (e) {
    console.error("Failed to create fax request", e);
    return;
  }

  // 2. AI Analysis of the Fax Image
  const imageDir = "/Users/s/.gemini/antigravity/brain/df569bed-3b2d-4026-aace-1e20368c95f7";
  const files = fs.readdirSync(imageDir);
  const imageFile = files.find(f => f.startsWith("fax_approval_circle_test") && f.endsWith(".png"));

  if (!imageFile) {
    console.error("Test image not found!");
    return;
  }

  const imagePath = path.join(imageDir, imageFile);
  console.log("Analyzing Fax Image with AI:", imagePath);

  const imageData = fs.readFileSync(imagePath).toString("base64");
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const result = await model.generateContent([
    { text: SYSTEM_PROMPT },
    { inlineData: { mimeType: "image/png", data: imageData } },
  ]);

  const aiText = result.response.text();
  console.log("🤖 AI Detection Result:", aiText);

  const parsed = JSON.parse(aiText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim());

  if (parsed.circle_detected === "APPROVE") {
    console.log("🎯 CIRCLE DETECTED! Preparing Solana Approval...");
    console.log(`🔗 Blink URL generated for PDA ${faxRequestPda.toBase58()}:`);
    console.log(`https://dial.to/?action=solana-action:https://inktrust.app/api/v1/actions/approve/${faxRequestPda.toBase58()}`);
    
    // 3. (Optional) Simulate the Approval itself
    console.log("Simulating Caregiver Approval on-chain...");
    const approveTx = await program.methods
      .approveFaxRequest()
      .accounts({
        faxRequest: faxRequestPda,
        caregiver: wallet.publicKey, // Using same wallet for demo
      })
      .rpc();
    console.log("✅ Success! Transaction Approved on Solana:", approveTx);
  } else {
    console.log("❌ No circle detected by AI.");
  }
}

runDemo();
