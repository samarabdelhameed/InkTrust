import { Router } from "express";
// We will import controllers here as we build them out
import { telnyxWebhookController } from "../controllers/webhook.controller";
import { aiAnalysisController } from "../controllers/ai.controller";
import { actionController } from "../controllers/action.controller";

const router = Router();

// Analog Webhooks (Fax)
router.post("/webhooks/telnyx", telnyxWebhookController);

// AI Agents
router.post("/ai/analyze", aiAnalysisController);

// Solana Blinks / Actions
router.get("/actions/approve/:id", actionController.getApprovalAction);
router.post("/actions/approve/:id", actionController.postApprovalAction);

export default router;
