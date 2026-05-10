import crypto from "crypto";
import axios from "axios";
import { Request, Response } from "express";
import { env } from "../config/env";
import { logger } from "../utils/logger";
import { storageService } from "../services";
import { faxIngestionQueue } from "../queues";

function verifyTelnyxSignature(payload: string, signature: string, publicKey: string): boolean {
  try {
    const verifier = crypto.createVerify("RSA-SHA256");
    verifier.update(payload);
    return verifier.verify(publicKey, signature, "base64");
  } catch {
    return false;
  }
}

export const telnyxWebhookController = async (req: Request, res: Response) => {
  try {
    const signature = req.headers["telnyx-signature-ed25519"] as string;
    const timestamp = req.headers["telnyx-timestamp"] as string;

    if (signature && timestamp) {
      const payload = `${timestamp}.${JSON.stringify(req.body)}`;
      const isValid = verifyTelnyxSignature(payload, signature, env.TELNYX_PUBLIC_KEY);
      if (!isValid) {
        logger.warn("[Webhook] Invalid Telnyx signature");
        return res.status(401).json({ error: "Invalid signature" });
      }
    }

    const { data } = req.body;
    const faxEvent = {
      eventType: data?.event_type,
      faxId: data?.payload?.fax_id || `fax-${Date.now()}`,
      from: data?.payload?.from || "+81312345678",
      to: data?.payload?.to || "+815050508899",
      mediaUrl: data?.payload?.media_url,
      status: data?.payload?.status || "received",
      receivedAt: new Date().toISOString(),
    };

    logger.info({ faxId: faxEvent.faxId, from: faxEvent.from }, "Inbound fax received");

    let storageKey: string | undefined;

    if (faxEvent.mediaUrl) {
      try {
        const response = await axios.get(faxEvent.mediaUrl, {
          responseType: "arraybuffer",
          timeout: 30000,
        });

        const fileName = `fax-${faxEvent.faxId || Date.now()}.pdf`;
        storageKey = await storageService.uploadFile(
          storageService.getKeyForFax(faxEvent.faxId || "unknown", fileName),
          Buffer.from(response.data),
          (typeof response.headers["content-type"] === "string" ? response.headers["content-type"] : "application/pdf"),
        );

        logger.info({ storageKey }, "Fax image stored in S3");
      } catch (err) {
        logger.error({ err, mediaUrl: faxEvent.mediaUrl }, "Failed to download fax image");
      }
    }

    await faxIngestionQueue.add("process-fax", {
      ...faxEvent,
      storageKey,
    });

    logger.info({ faxId: faxEvent.faxId, queueJob: "process-fax" }, "Fax enqueued for processing");

    res.status(200).json({
      status: "received",
      faxId: faxEvent.faxId,
      message: "Fax enqueued for AI processing",
    });
  } catch (error) {
    logger.error({ err: error }, "Webhook processing failed");
    res.status(500).json({ error: "Webhook processing failed" });
  }
};

export const simulateFaxController = async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType, from, to } = req.body;

    if (!imageBase64 || !mimeType) {
      return res.status(400).json({ error: "imageBase64 and mimeType are required" });
    }

    const faxId = `simulated-fax-${Date.now()}`;
    const fileName = `fax-${faxId}.pdf`;

    const imageBuffer = Buffer.from(imageBase64, "base64");

    let storageKey: string | undefined;
    try {
      storageKey = await storageService.uploadFile(
        storageService.getKeyForFax(faxId, fileName),
        imageBuffer,
        mimeType,
      );
    } catch (err) {
      logger.warn({ err }, "S3 not available — continuing without storage");
    }

    await faxIngestionQueue.add("process-fax", {
      faxId,
      from: from || "+81312345678",
      to: to || "+815050508899",
      mediaUrl: storageKey ? `s3://inktrust-assets/${storageKey}` : undefined,
      storageKey,
      status: "received",
      receivedAt: new Date().toISOString(),
    });

    logger.info({ faxId }, "Simulated fax enqueued");

    res.status(200).json({
      status: "received",
      faxId,
      message: "Simulated fax enqueued for AI processing",
      note: "This is a simulated fax for development. Replace with real Telnyx webhook in production.",
    });
  } catch (error) {
    logger.error({ err: error }, "Simulated fax failed");
    res.status(500).json({ error: "Simulated fax failed" });
  }
};
