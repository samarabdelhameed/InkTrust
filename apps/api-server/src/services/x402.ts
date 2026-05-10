import { env } from "../config/env";
import { logger } from "../utils/logger";

interface X402PaymentRequest {
  serviceUrl: string;
  amountUsdc: number;
  senderWallet: string;
  recipientWallet: string;
  purpose: string;
}

interface X402PaymentResult {
  success: boolean;
  transactionId?: string;
  paymentHeader?: string;
}

export class X402Service {
  private apiKeyName: string;
  private apiKeyPrivate: string;

  constructor() {
    this.apiKeyName = env.COINBASE_CDP_API_KEY_NAME;
    this.apiKeyPrivate = env.COINBASE_CDP_API_KEY_PRIVATE_KEY;
  }

  async createPaymentAuthorization(request: X402PaymentRequest): Promise<X402PaymentResult> {
    try {
      logger.info(
        {
          serviceUrl: request.serviceUrl,
          amountUsdc: request.amountUsdc,
          purpose: request.purpose,
        },
        "Creating x402 payment authorization",
      );

      const paymentHeader = `x402 usdc=${request.amountUsdc};sender=${request.senderWallet};nonce=${Date.now()}`;

      const transactionId = `x402-tx-${Date.now()}`;

      logger.info({ transactionId, paymentHeader }, "x402 payment authorization created");

      return {
        success: true,
        transactionId,
        paymentHeader,
      };
    } catch (error) {
      logger.error({ err: error, serviceUrl: request.serviceUrl }, "x402 payment failed");
      return { success: false };
    }
  }

  async payForApiService(
    serviceUrl: string,
    amountUsdc: number,
    agentWallet: string,
  ): Promise<{ data: any; paymentHeader: string }> {
    const auth = await this.createPaymentAuthorization({
      serviceUrl,
      amountUsdc,
      senderWallet: agentWallet,
      recipientWallet: "service-provider-wallet",
      purpose: "agent-api-call",
    });

    if (!auth.success || !auth.paymentHeader) {
      throw new Error(`x402 payment to ${serviceUrl} failed`);
    }

    const response = await fetch(serviceUrl, {
      headers: {
        "X-402-Payment": auth.paymentHeader,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return { data, paymentHeader: auth.paymentHeader };
  }
}

export const x402Service = new X402Service();
