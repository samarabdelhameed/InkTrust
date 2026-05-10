import { Router } from "express";
import { telnyxWebhookController, simulateFaxController } from "../controllers/webhook.controller";
import { aiAnalysisController } from "../controllers/ai.controller";
import { actionController } from "../controllers/action.controller";
import { authController } from "../controllers/auth.controller";

const router = Router();

// Analog Webhooks (Fax)
router.post("/webhooks/telnyx", telnyxWebhookController);
router.post("/webhooks/simulate", simulateFaxController); // Free dev testing without Telnyx

// AI Agents
router.post("/ai/analyze", aiAnalysisController);

// Solana Blinks / Actions
router.get("/actions/approve/:id", actionController.getApprovalAction);
router.post("/actions/approve/:id", actionController.postApprovalAction);

// Auth & Verification
router.post("/auth/verify-world-id", authController.verifyWorldId);
router.post("/auth/privy-webhook", authController.privyWebhook);

export default router;
