import { Router } from 'express';
import { WebhooksController } from '../controllers/webhooks.controller';
import { ActionsController } from '../controllers/actions.controller';
import { AdminController } from '../controllers/admin.controller';
import { AuthController } from '../controllers/auth.controller';
import { AgentController } from '../controllers/agent.controller';
import { telnyxSignatureValidator } from '../middlewares/telnyx';

const router = Router();

// Webhooks
router.post('/webhooks/telnyx/fax_received', telnyxSignatureValidator, WebhooksController.handleTelnyxFax);

// Solana Actions / Blinks
router.get('/actions/approve/:jobId', ActionsController.getActionMetadata);
router.post('/actions/approve/:jobId', ActionsController.buildApproveTransaction);

// Admin
router.get('/admin/jobs/pending', AdminController.getPendingJobs);
router.post('/admin/jobs/:jobId/approve', AdminController.approveJobManually);
router.post('/fax/send_receipt', AdminController.sendReceiptFax);

// Auth & Agent
router.post('/auth/verify-world-id', AuthController.verifyWorldId);
router.get('/agent/services/premium_search', AgentController.handlePremiumSearch);

export default router;
