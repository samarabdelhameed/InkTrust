import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { telnyxWebhookRouter } from "./routes/webhooks/telnyx";
import { approveRequestRouter } from "./routes/actions/approve-request";
import { geminiParserRouter } from "./routes/ai/gemini-parser";
import { x402ServicesRouter } from "./routes/agent/x402-services";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ============================================================
// Middleware
// ============================================================
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.raw({ type: "application/pdf", limit: "10mb" }));

// ============================================================
// API Routes
// ============================================================

// Fax ingestion — Telnyx webhook
app.use("/api/webhooks", telnyxWebhookRouter);

// Solana Blinks — caregiver approval actions
app.use("/api/actions", approveRequestRouter);

// AI orchestration — Gemini Vision parser
app.use("/api/ai", geminiParserRouter);

// Agent payments — x402 stablecoin micropayments
app.use("/api/agent", x402ServicesRouter);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "inktrust-api-server",
    timestamp: new Date().toISOString(),
  });
});

// ============================================================
// Start Server
// ============================================================
app.listen(PORT, () => {
  console.log(`🖋️  InkTrust API Server running on port ${PORT}`);
  console.log(`📠 Fax webhook:   POST /api/webhooks/telnyx`);
  console.log(`🔗 Blinks:        GET  /api/actions/approve/:requestId`);
  console.log(`🧠 AI Parser:     POST /api/ai/parse-fax`);
  console.log(`💰 x402 Agent:    POST /api/agent/x402-pay`);
});

export default app;
