import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding InkTrust database...\n");

  // Senior User (elderly person sending faxes)
  const senior = await prisma.user.upsert({
    where: { faxNumber: "+81312345678" },
    update: {},
    create: {
      faxNumber: "+81312345678",
      proxyEmail: "tanaka.hanako@example.com",
      embeddedWalletAddress: "senior-embedded-wallet-pubkey-001",
      caregiverWalletAddress: "caregiver-wallet-pubkey-001",
      spendingLimit: 50000,
      status: "ACTIVE",
    },
  });
  console.log(`  👤 Senior user: ${senior.faxNumber}`);

  // Caregiver (family member)
  const caregiver = await prisma.user.upsert({
    where: { faxNumber: "+819012345678" },
    update: {},
    create: {
      faxNumber: "+819012345678",
      proxyEmail: "tanaka.taro@example.com",
      embeddedWalletAddress: "caregiver-embedded-wallet-pubkey-001",
      spendingLimit: 0,
      status: "ACTIVE",
    },
  });
  console.log(`  👤 Caregiver: ${caregiver.faxNumber}`);

  // World ID Verification for caregiver
  await prisma.worldIdVerification.upsert({
    where: { nullifierHash: "0xnullifier_hash_caregiver_001" },
    update: {},
    create: {
      userId: caregiver.id,
      nullifierHash: "0xnullifier_hash_caregiver_001",
      merkleRoot: "0xmerkle_root_001",
      proof: "0xproof_data_001",
    },
  });
  console.log("  ✅ World ID verified for caregiver");

  // Spending Policy
  await prisma.spendingPolicy.upsert({
    where: { userId: senior.id },
    update: {},
    create: {
      userId: senior.id,
      dailyLimit: 3000,
      monthlyLimit: 50000,
      requiresMfa: true,
    },
  });
  console.log("  💰 Spending policy created (¥3000/day, ¥50000/month)");

  // Trusted Contact
  await prisma.trustedContact.upsert({
    where: { userId_email: { userId: senior.id, email: caregiver.proxyEmail! } },
    update: {},
    create: {
      userId: senior.id,
      email: caregiver.proxyEmail!,
      name: "Taro Tanaka",
      relation: "SON",
      isVerified: true,
    },
  });
  console.log("  📞 Trusted contact added");

  // Sample FaxJob 1 (completed purchase)
  const fax1 = await prisma.faxJob.upsert({
    where: { externalFaxId: "telnyx-fax-sample-001" },
    update: {},
    create: {
      userId: senior.id,
      externalFaxId: "telnyx-fax-sample-001",
      mediaUrl: "s3://inktrust-assets/faxes/sample-001/fax-medication.pdf",
      status: "COMPLETED",
      intent: "PURCHASE",
      amount: 4500,
      merchant: "Yakushima Pharmacy",
      medication: "blood pressure medication",
      urgency: "NORMAL",
      confidenceScore: 0.95,
      aiRawResponse: {
        intent_type: "PURCHASE",
        items: ["blood pressure medication"],
        amount_jpy: 4500,
        urgency: "NORMAL",
        requires_approval: true,
        raw_text: "血圧の薬をいつものでお願いします",
        confidence: 0.95,
      },
    },
  });
  console.log(`  📠 Sample fax job 1: ${fax1.externalFaxId} (COMPLETED)`);

  // Approved transaction for fax1
  await prisma.transaction.upsert({
    where: { txSignature: "solana-tx-sample-001" },
    update: {},
    create: {
      userId: senior.id,
      faxJobId: fax1.id,
      txSignature: "solana-tx-sample-001",
      network: "devnet",
      amount: 4500,
      currency: "JPYC",
      status: "CONFIRMED",
    },
  });
  console.log("  💸 Transaction completed: ¥4,500");

  // Sample FaxJob 2 (pending approval)
  const fax2 = await prisma.faxJob.upsert({
    where: { externalFaxId: "telnyx-fax-sample-002" },
    update: {},
    create: {
      userId: senior.id,
      externalFaxId: "telnyx-fax-sample-002",
      mediaUrl: "s3://inktrust-assets/faxes/sample-002/fax-utility.pdf",
      status: "AWAITING_APPROVAL",
      intent: "PAYMENT",
      amount: 12000,
      merchant: "Tokyo Electric Power",
      urgency: "HIGH",
      confidenceScore: 0.88,
      aiRawResponse: {
        intent_type: "PAYMENT",
        items: ["utility bill payment"],
        amount_jpy: 12000,
        urgency: "HIGH",
        requires_approval: true,
        raw_text: "電気代の支払いをお願いします",
        confidence: 0.88,
      },
    },
  });
  console.log(`  📠 Sample fax job 2: ${fax2.externalFaxId} (AWAITING_APPROVAL)`);

  // Approval request for fax2
  const approval = await prisma.approvalRequest.upsert({
    where: { faxJobId: fax2.id },
    update: {},
    create: {
      faxJobId: fax2.id,
      userId: senior.id,
      status: "PENDING",
      requiredSigners: 1,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  });
  console.log(`  ⏳ Approval request: ${approval.id} (PENDING)`);

  // Sample FaxJob 3 (failed)
  await prisma.faxJob.upsert({
    where: { externalFaxId: "telnyx-fax-sample-003" },
    update: {},
    create: {
      userId: senior.id,
      externalFaxId: "telnyx-fax-sample-003",
      status: "FAILED",
      intent: "INQUIRY",
      urgency: "LOW",
      confidenceScore: 0.0,
      aiRawResponse: {
        intent_type: "UNKNOWN",
        raw_text: "Unreadable fax",
        confidence: 0.0,
      },
    },
  });
  console.log("  📠 Sample fax job 3: telnyx-fax-sample-003 (FAILED)");

  // Agent session
  await prisma.agentSession.create({
    data: {
      userId: senior.id,
      agentId: "metaplex-agent-nft-001",
      scope: {
        permissions: ["PURCHASE", "INQUIRY", "PAYMENT"],
        maxAmountPerTx: 50000,
        allowedMerchants: ["Yakushima Pharmacy", "Tokyo Electric Power"],
      },
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    },
  });
  console.log("  🤖 Agent session created with purchase permissions");

  console.log("\n✅ Seeding completed successfully!");
  console.log("  Users: 2 (senior + caregiver)");
  console.log("  FaxJobs: 3 (1 completed, 1 pending, 1 failed)");
  console.log("  Transactions: 1");
  console.log("  Approval Requests: 1 (pending)");
  console.log("  World ID Verification: 1");
  console.log("  Spending Policy: 1");
  console.log("  Trusted Contact: 1");
  console.log("  Agent Session: 1");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
