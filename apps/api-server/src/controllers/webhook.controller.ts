import { Request, Response } from "express";

export const telnyxWebhookController = async (req: Request, res: Response) => {
  try {
    const { data } = req.body;
    console.log(`[Webhook] 📠 Inbound fax from: ${data?.payload?.from}`);
    
    // Add to BullMQ processing queue
    // await faxQueue.add("process-fax", { ... });

    res.status(200).json({ received: true });
  } catch (error) {
    res.status(500).json({ error: "Webhook processing failed" });
  }
};
