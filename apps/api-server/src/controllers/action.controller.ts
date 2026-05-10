import { Request, Response } from "express";
import { PublicKey } from "@solana/web3.js";
import { env } from "../config/env";
import { logger } from "../utils/logger";
import { faxIngestionQueue } from "../queues";
import { blinkService } from "../blockchain/blink-service";
import { swigService } from "../services/swig";
import { worldIdService } from "../services/world-id";

export const actionController = {
  getApprovalAction: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const actionUrl = `${env.NEXT_PUBLIC_APP_URL}/api/v1/actions/approve/${id}`;

      const blink = await blinkService.generateFaxApprovalBlink(id);

      res.json({
        ...blink,
        links: {
          actions: [
            {
              label: "Approve",
              href: actionUrl,
              type: "transaction",
            },
          ],
        },
      });
    } catch (error) {
      logger.error({ err: error, id: req.params.id }, "Failed to generate approval action");
      res.json({
        icon: "https://inktrust.app/icon.png",
        title: "InkTrust — Approve Transaction",
        description: "A family member has requested your approval via fax. Review and approve or reject.",
        label: "Approve",
        links: {
          actions: [
            {
              label: "Approve",
              href: `${env.NEXT_PUBLIC_APP_URL}/api/v1/actions/approve/${req.params.id}`,
              type: "transaction",
            },
          ],
        },
      });
    }
  },

  postApprovalAction: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { account } = req.body;

      if (!account) {
        return res.status(400).json({ error: "account (wallet address) is required" });
      }

      logger.info({ requestId: id, caregiver: account }, "Approval action submitted");

      const spendingSummary = await swigService.getSpendingSummary(account);

      if (spendingSummary.remainingDaily <= 0) {
        return res.status(400).json({
          error: "Daily spending limit exceeded. Please wait until tomorrow or contact support.",
        });
      }

      const blinkResponse = await blinkService.handleBlinkPost(
        { account },
        id,
      );

      const blinkData = blinkResponse as any;

      await faxIngestionQueue.add("approval-response", {
        requestId: id,
        caregiverAccount: account,
        decision: "approved",
        transaction: blinkData.transaction,
        timestamp: new Date().toISOString(),
        spendingAfter: spendingSummary,
      });

      res.json(blinkResponse);
    } catch (error) {
      logger.error({ err: error }, "Approval action failed");
      res.status(500).json({ error: "Failed to process approval" });
    }
  },
};
