import { Request, Response } from "express";
import { logger } from "../utils/logger";

export const adminController = {
  createSwigWallet: async (_req: Request, res: Response) => {
    try {
      res.json({
        success: true,
        wallet: {
          address: "8xY7z2m9VywSfAMG48dgiroienfrX419wjESVxPyv4sR",
          network: "solana-devnet",
        },
        message: "Swig wallet created successfully",
      });
    } catch (error) {
      logger.error({ err: error }, "Failed to create Swig wallet");
      res.status(500).json({ error: "Failed to create Swig wallet" });
    }
  },

  getMoonPayQuote: async (_req: Request, res: Response) => {
    try {
      res.json({
        currencyCode: "usd",
        baseCurrencyAmount: 50,
        quoteCurrencyAmount: 49.35,
        feeAmount: 0.65,
        totalAmount: 50,
        quoteId: `quote-${Date.now()}`,
        validUntil: new Date(Date.now() + 1000 * 60 * 5).toISOString(),
      });
    } catch (error) {
      logger.error({ err: error }, "Failed to get MoonPay quote");
      res.status(500).json({ error: "Failed to get MoonPay quote" });
    }
  },
  getPendingJobs: async (_req: Request, res: Response) => {
    try {
      const jobs = [
        {
          id: "fax-20240511-001",
          userId: "senior-001",
          status: "pending",
          intent: "Prescription refill - blood pressure medication",
          amount: 4200,
          merchant: "Al-Ahli Pharmacy",
          urgency: "NORMAL",
          createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        },
        {
          id: "fax-20240511-002",
          userId: "senior-002",
          status: "pending",
          intent: "Weekly grocery delivery order",
          amount: 8500,
          merchant: "Carrefour Grocery",
          urgency: "HIGH",
          createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        },
        {
          id: "fax-20240511-003",
          userId: "senior-003",
          status: "ai_processing",
          intent: "Monthly utility bill payment",
          amount: 12000,
          merchant: "SEPA Electricity",
          urgency: "LOW",
          createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        },
      ];
      res.json(jobs);
    } catch (error) {
      logger.error({ err: error }, "Failed to fetch pending jobs");
      res.status(500).json({ error: "Failed to fetch pending jobs" });
    }
  },

  getSpending: async (_req: Request, res: Response) => {
    try {
      res.json({
        dailySpend: 4200,
        dailyLimit: 10000,
        monthlySpend: 24700,
        monthlyLimit: 50000,
        dailySpendPercentage: 42,
        monthlySpendPercentage: 49.4,
      });
    } catch (error) {
      logger.error({ err: error }, "Failed to fetch spending");
      res.status(500).json({ error: "Failed to fetch spending" });
    }
  },

  getDashboardMetrics: async (_req: Request, res: Response) => {
    try {
      res.json({
        totalRequests: 1247,
        pendingApprovals: 2,
        approvedToday: 5,
        totalSpent: 24700,
        aiSuccessRate: 98.3,
        avgProcessingTime: 2.4,
      });
    } catch (error) {
      logger.error({ err: error }, "Failed to fetch metrics");
      res.status(500).json({ error: "Failed to fetch metrics" });
    }
  },

  getPendingApprovals: async (_req: Request, res: Response) => {
    try {
      res.json([
        {
          id: "1",
          seniorName: "Ahmed",
          merchant: "Al-Ahli Pharmacy",
          amount: 4200,
          intent: "Prescription refill - blood pressure medication",
          riskScore: 25,
          timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
          status: "pending",
        },
        {
          id: "2",
          seniorName: "Fatima",
          merchant: "Carrefour Grocery",
          amount: 8500,
          intent: "Weekly grocery delivery order",
          riskScore: 55,
          timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
          status: "pending",
        },
        {
          id: "3",
          seniorName: "Mohammed",
          merchant: "SEPA Electricity",
          amount: 12000,
          intent: "Monthly utility bill payment",
          riskScore: 12,
          timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
          status: "pending",
        },
      ]);
    } catch (error) {
      logger.error({ err: error }, "Failed to fetch approvals");
      res.status(500).json({ error: "Failed to fetch approvals" });
    }
  },

  getRecentTransactions: async (_req: Request, res: Response) => {
    try {
      res.json([
        {
          id: "0x7a3f...b9e2",
          type: "PAYMENT",
          amount: 4200,
          currency: "JPY",
          merchant: "Al-Ahli Pharmacy",
          status: "confirmed",
          agent: "swig",
          timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
          slot: 284719234,
        },
        {
          id: "0x3e7b...d2f1",
          type: "PAYMENT",
          amount: 8500,
          currency: "JPY",
          merchant: "Carrefour Grocery",
          status: "confirmed",
          agent: "swig",
          timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
          slot: 284719100,
        },
        {
          id: "0x6f2a...c7e3",
          type: "POLICY_UPDATE",
          amount: 0,
          currency: "JPY",
          merchant: "System",
          status: "confirmed",
          agent: "orchestrator",
          timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
          slot: 284718500,
        },
      ]);
    } catch (error) {
      logger.error({ err: error }, "Failed to fetch transactions");
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  },

  getSystemHealth: async (_req: Request, res: Response) => {
    try {
      res.json({
        apiServer: { status: "healthy", latency: "45ms" },
        solanaRpc: { status: "healthy", latency: "230ms" },
        aiService: { status: "healthy", latency: "1.2s" },
        queueSystem: { status: "healthy", latency: "8ms" },
        agents: [
          { name: "Fax Ingestor", status: "active", uptime: "99.9%", tasks: 342 },
          { name: "OCR Processor", status: "active", uptime: "99.7%", tasks: 338 },
          { name: "Gemini AI", status: "active", uptime: "98.5%", tasks: 335 },
          { name: "Risk Engine", status: "active", uptime: "99.9%", tasks: 330 },
          { name: "Blink Service", status: "active", uptime: "99.8%", tasks: 280 },
          { name: "Swig Orchestrator", status: "active", uptime: "99.6%", tasks: 265 },
          { name: "Fax Outbound", status: "idle", uptime: "99.9%", tasks: 245 },
        ],
      });
    } catch (error) {
      logger.error({ err: error }, "Failed to fetch health");
      res.status(500).json({ error: "Failed to fetch health" });
    }
  },

  rejectAction: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      logger.info({ requestId: id }, "Fax request rejected");
      res.json({
        success: true,
        requestId: id,
        decision: "rejected",
        message: "Fax request has been rejected",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error({ err: error }, "Failed to reject action");
      res.status(500).json({ error: "Failed to reject action" });
    }
  },
};
