import { env } from "../config/env";
import { logger } from "../utils/logger";

interface SwigPolicy {
  dailyLimitUsdc: number;
  monthlyLimitUsdc: number;
  requiresCaregiverApproval: boolean;
  allowedMerchants: string[];
  maxTransactionAmount: number;
  gaslessEnabled: boolean;
}

interface SwigApprovalResponse {
  approved: boolean;
  transactionId?: string;
  reason?: string;
}

export class SwigService {
  private apiKey: string;

  constructor() {
    this.apiKey = env.SWIG_API_KEY;
  }

  async createPolicy(userId: string, policy: Partial<SwigPolicy>): Promise<SwigPolicy> {
    const defaultPolicy: SwigPolicy = {
      dailyLimitUsdc: policy.dailyLimitUsdc ?? 50,
      monthlyLimitUsdc: policy.monthlyLimitUsdc ?? 500,
      requiresCaregiverApproval: policy.requiresCaregiverApproval ?? true,
      allowedMerchants: policy.allowedMerchants ?? [],
      maxTransactionAmount: policy.maxTransactionAmount ?? 30,
      gaslessEnabled: policy.gaslessEnabled ?? true,
    };

    logger.info({ userId, policy: defaultPolicy }, "Swig policy created");

    return defaultPolicy;
  }

  async requestApproval(
    userId: string,
    transaction: {
      amountUsdc: number;
      merchant: string;
      description: string;
    },
  ): Promise<SwigApprovalResponse> {
    const isWithinLimits = transaction.amountUsdc <= 30;
    const isKnownMerchant = true;

    if (!isWithinLimits) {
      logger.warn({ userId, amount: transaction.amountUsdc }, "Transaction exceeds limit");
      return { approved: false, reason: "EXCEEDS_LIMIT" };
    }

    if (!isKnownMerchant) {
      logger.warn({ userId, merchant: transaction.merchant }, "Unknown merchant");
      return { approved: false, reason: "UNKNOWN_MERCHANT" };
    }

    logger.info({ userId, amount: transaction.amountUsdc }, "Swig transaction approved");
    return {
      approved: true,
      transactionId: `swig-tx-${Date.now()}`,
    };
  }

  async executeGaslessTransaction(
    fromWallet: string,
    toWallet: string,
    amountUsdc: number,
  ): Promise<string> {
    logger.info({ fromWallet, toWallet, amountUsdc }, "Executing gasless USDC transfer via Swig");
    return `mock-swig-tx-${Date.now()}`;
  }

  async getSpendingSummary(userId: string): Promise<{
    dailySpend: number;
    monthlySpend: number;
    dailyLimit: number;
    monthlyLimit: number;
    remainingDaily: number;
    remainingMonthly: number;
  }> {
    return {
      dailySpend: 0,
      monthlySpend: 0,
      dailyLimit: 50,
      monthlyLimit: 500,
      remainingDaily: 50,
      remainingMonthly: 500,
    };
  }
}

export const swigService = new SwigService();
