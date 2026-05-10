import crypto from "crypto";
import { Keypair } from "@solana/web3.js";
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
  private agentKeypair: Keypair | null = null;

  constructor() {
    const keyHex = env.AGENT_PRIVATE_KEY;
    if (keyHex) {
      try {
        const bytes = Buffer.from(keyHex, "hex");
        this.agentKeypair = Keypair.fromSecretKey(new Uint8Array(bytes));
      } catch {
        logger.warn("Failed to parse AGENT_PRIVATE_KEY for x402 signing");
      }
    }
  }

  async createPaymentAuthorization(request: X402PaymentRequest): Promise<X402PaymentResult> {
    try {
      const nonce = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
      const payload = `x402:usdc=${request.amountUsdc}:sender=${request.senderWallet}:recipient=${request.recipientWallet}:nonce=${nonce}`;

      let signatureBase64 = "unsigned";
      const publicKey = this.agentKeypair?.publicKey.toBase58() || "unknown";

      if (this.agentKeypair) {
        const rawSeed = this.agentKeypair.secretKey.slice(0, 32);
        const rawPubkey = this.agentKeypair.secretKey.slice(32, 64);
        const key = crypto.createPrivateKey({
          key: {
            kty: "OKP",
            crv: "Ed25519",
            d: Buffer.from(rawSeed).toString("base64url"),
            x: Buffer.from(rawPubkey).toString("base64url"),
          },
          format: "jwk",
        });
        const sigBytes = crypto.sign(null, Buffer.from(payload, "utf-8"), key);
        signatureBase64 = Buffer.from(sigBytes).toString("base64");
      } else {
        logger.warn("No agent keypair — x402 signature will be unsigned");
      }

      const paymentHeader = [
        `x402 usdc=${request.amountUsdc}`,
        `sender=${request.senderWallet}`,
        `nonce=${nonce}`,
        `pubkey=${publicKey}`,
        `sig=${signatureBase64}`,
      ].join(";");

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
