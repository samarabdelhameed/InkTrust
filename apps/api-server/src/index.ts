import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { setupWebSockets } from "./websocket";
import { setupQueues } from "./queues";
import apiRoutes from "./api";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ============================================================
// Enterprise Middleware
// ============================================================
app.use(helmet());
app.use(cors({ origin: process.env.NEXT_PUBLIC_APP_URL }));
app.use(express.json({ limit: "10mb" }));
app.use(express.raw({ type: "application/pdf", limit: "50mb" }));

// ============================================================
// API Routing
// ============================================================
app.use("/api/v1", apiRoutes);

// Health check
app.get("/health", (_req, res) => {
  res.json({
    status: "healthy",
    service: "inktrust-api-server",
    timestamp: new Date().toISOString(),
  });
});

// ============================================================
// Initialization & Server Start
// ============================================================
async function startServer() {
  try {
    // Initialize BullMQ Workers
    await setupQueues();

    const server = app.listen(PORT, () => {
      console.log(`[Server] 🖋️ InkTrust API running on port ${PORT}`);
    });

    // Initialize WebSockets
    setupWebSockets(server);
  } catch (error) {
    console.error("[Server] ❌ Initialization failed:", error);
    process.exit(1);
  }
}

startServer();

export default app;
