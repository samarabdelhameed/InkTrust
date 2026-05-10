import express from "express";
import helmet from "helmet";
import { env } from "./config/env";
import { logger } from "./utils/logger";
import rateLimit from "express-rate-limit";
import { createCorsMiddleware } from "./middleware/cors";
import { setupWebSockets } from "./websocket";
import { setupQueues } from "./queues";
import apiRoutes from "./api";

const app = express();
const PORT = env.PORT;

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again after 15 minutes",
});
app.use("/api/", limiter);

app.use(createCorsMiddleware());
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
      logger.info(`[Server] 🖋️ InkTrust API running on port ${PORT} in ${env.NODE_ENV} mode`);
    });

    // Initialize WebSockets
    setupWebSockets(server);
  } catch (error) {
    logger.error({ err: error }, "[Server] ❌ Initialization failed");
    process.exit(1);
  }
}

startServer();

export default app;
