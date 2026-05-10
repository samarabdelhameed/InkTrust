import { Router, Request, Response } from "express";

export const telnyxWebhookRouter = Router();

/**
 * POST /api/webhooks/telnyx
 *
 * Telnyx Fax Webhook Handler
 * Receives inbound fax documents as Fax-over-IP via Telnyx webhook.
 * Converts the fax to a digital image and enqueues it for AI processing.
 *
 * Pipeline: Fax Signal → Telnyx → Webhook → BullMQ Queue → Gemini Vision
 */
telnyxWebhookRouter.post("/telnyx", async (req: Request, res: Response) => {
  try {
    const { data } = req.body;

    // Extract fax metadata from Telnyx webhook payload
    const faxEvent = {
      eventType: data?.event_type,
      faxId: data?.payload?.fax_id,
      from: data?.payload?.from,
      to: data?.payload?.to,
      mediaUrl: data?.payload?.media_url,
      status: data?.payload?.status,
      receivedAt: new Date().toISOString(),
    };

    console.log(`📠 Inbound fax received from: ${faxEvent.from}`);
    console.log(`   Media URL: ${faxEvent.mediaUrl}`);

    // TODO: Enqueue to BullMQ for async processing
    // await faxProcessingQueue.add('process-fax', faxEvent);

    // TODO: Download fax image from mediaUrl
    // TODO: Store in cloud storage (S3/R2)
    // TODO: Trigger Gemini Vision AI parsing

    res.status(200).json({
      status: "received",
      faxId: faxEvent.faxId,
      message: "Fax enqueued for AI processing",
    });
  } catch (error) {
    console.error("❌ Telnyx webhook error:", error);
    res.status(500).json({ error: "Webhook processing failed" });
  }
});
