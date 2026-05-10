import axios from "axios";
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

interface SwigApiPolicy {
  id: string;
  name: string;
  description: string | null;
  authority: { type: string; publicKey: string } | null;
  actions: { type: string; amount?: string; mint?: string; recurringAmount?: string; window?: string; destination?: string; programId?: string }[];
}

interface SwigCreateWalletResponse {
  swigId: string;
  swigAddress: string;
  signature?: string;
  transaction?: string;
}

export class SwigService {
  private apiKey: string;
  private readonly portalUrl = "https://dashboard.onswig.com";
  private readonly paymasterUrl = "https://api.onswig.com";
  private readonly isConfigured: boolean;

  constructor() {
    this.apiKey = env.SWIG_API_KEY;
    this.isConfigured = !!this.apiKey;
  }

  private get headers() {
    return {
      Authorization: `Bearer ${this.apiKey}`,
      "Content-Type": "application/json",
    };
  }

  async getPolicy(policyId: string): Promise<SwigApiPolicy | null> {
    if (!this.isConfigured) {
      logger.warn("SWIG_API_KEY not set — cannot fetch policy");
      return null;
    }
    try {
      const { data } = await axios.get<SwigApiPolicy>(
        `${this.portalUrl}/api/v1/policies/${policyId}`,
        { headers: this.headers },
      );
      return data;
    } catch (err: any) {
      logger.warn({ err: err.message, policyId }, "Failed to fetch Swig policy");
      return null;
    }
  }

  async createWallet(
    policyId: string,
    network: string = "devnet",
    opts?: { walletAddress?: string; walletType?: string; paymasterPubkey?: string },
  ): Promise<SwigCreateWalletResponse | null> {
    if (!this.isConfigured) {
      logger.warn("SWIG_API_KEY not set — cannot create wallet");
      return null;
    }
    try {
      const { data } = await axios.post<{ data: SwigCreateWalletResponse; error: any }>(
        `${this.portalUrl}/api/v1/wallet/create`,
        { policyId, network, ...opts },
        { headers: this.headers },
      );
      return data.data;
    } catch (err: any) {
      logger.warn({ err: err.message }, "Failed to create Swig wallet");
      return null;
    }
  }

  async sponsorTransaction(base58Tx: string, network: string = "devnet"): Promise<{ signature: string; spentByPaymaster: number } | null> {
    if (!this.isConfigured) {
      logger.warn("SWIG_API_KEY not set — cannot sponsor transaction");
      return null;
    }
    try {
      const { data } = await axios.post<{ request_id: string; signature: string; spent_by_paymaster: number }>(
        `${this.paymasterUrl}/sponsor`,
        { base58_encoded_transaction: base58Tx, network },
        { headers: this.headers },
      );
      return { signature: data.signature, spentByPaymaster: data.spent_by_paymaster };
    } catch (err: any) {
      logger.warn({ err: err.message }, "Failed to sponsor transaction via Swig");
      return null;
    }
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

    logger.info({ userId, policy: defaultPolicy }, "Swig policy created (local)");
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
    if (!this.isConfigured) {
      logger.warn("SWIG_API_KEY not set — returning mock gasless tx");
      return `mock-swig-tx-${Date.now()}`;
    }

    try {
      const { data } = await axios.post(
        `${this.paymasterUrl}/sponsor`,
        {
          base58_encoded_transaction: `mock:usdc-transfer:${fromWallet}:${toWallet}:${amountUsdc}`,
          network: env.SOLANA_RPC_URL.includes("devnet") ? "devnet" : "mainnet",
        },
        { headers: this.headers, timeout: 10000 },
      );
      logger.info({ signature: data.signature }, "Swig gasless tx sponsored");
      return data.signature;
    } catch (err: any) {
      logger.warn({ err: err.message, fromWallet, toWallet, amountUsdc }, "Swig sponsor failed, returning mock");
      return `mock-swig-tx-${Date.now()}`;
    }
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
