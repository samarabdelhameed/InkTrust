import { Router, Request, Response } from "express";

export const approveRequestRouter = Router();

/**
 * GET /api/actions/approve/:requestId
 *
 * Solana Actions & Blinks — Caregiver Approval Metadata
 * Returns the metadata needed for the caregiver's Blink approval page.
 * Follows the Solana Actions specification for universal link rendering.
 */
approveRequestRouter.get("/approve/:requestId", async (req: Request, res: Response) => {
  const { requestId } = req.params;

  // TODO: Fetch request details from database
  // const request = await db.faxRequest.findUnique({ where: { id: requestId } });

  const actionMetadata = {
    icon: "https://inktrust.app/icon.png",
    title: "InkTrust — Approve Purchase",
    description: "Your family member has requested a medication purchase via fax. Review and approve the transaction.",
    label: "Approve Transaction",
    links: {
      actions: [
        {
          label: "✅ Approve (¥4,500)",
          href: `/api/actions/approve/${requestId}`,
          type: "transaction",
        },
      ],
    },
  };

  res.json(actionMetadata);
});

/**
 * POST /api/actions/approve/:requestId
 *
 * Solana Actions & Blinks — Generate Approval Transaction
 * Creates an unsigned Solana transaction that calls the approve_request
 * instruction on the InkTrust smart contract. The caregiver signs it
 * via their Phantom wallet through the Blink interface.
 */
approveRequestRouter.post("/approve/:requestId", async (req: Request, res: Response) => {
  try {
    const { requestId } = req.params;
    const { account } = req.body; // Caregiver's wallet address

    console.log(`🔗 Blink approval request from caregiver: ${account}`);
    console.log(`   Request ID: ${requestId}`);

    // TODO: Build approve_request transaction using Anchor
    // const tx = await buildApproveTransaction(requestId, account);

    // TODO: Serialize and return unsigned transaction
    // res.json({ transaction: tx.serialize().toString('base64') });

    res.json({
      status: "pending",
      message: "Approval transaction generation — implementation pending",
    });
  } catch (error) {
    console.error("❌ Blink approval error:", error);
    res.status(500).json({ error: "Failed to generate approval transaction" });
  }
});
