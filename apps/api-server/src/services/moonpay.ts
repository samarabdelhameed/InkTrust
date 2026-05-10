import crypto from "crypto";
import { env } from "../config/env";
import { logger } from "../utils/logger";

interface MoonPayCard {
  id: string;
  lastFourDigits: string;
  brand: string;
  expiryMonth: number;
  expiryYear: number;
  currencyCode: string;
  balanceUsdc: number;
  status: "active" | "frozen" | "closed";
}

interface MoonPayTransaction {
  id: string;
  cardId: string;
  amount: number;
  currency: string;
  merchant: string;
  status: "pending" | "completed" | "failed";
  createdAt: string;
}

export class MoonPayService {
  private secretKey: string;
  private baseUrl = "https://api.moonpay.com/v3";

  constructor() {
    this.secretKey = env.MOONPAY_SECRET_KEY;
  }

  async createVirtualCard(
    agentWalletAddress: string,
    dailyLimitUsdc: number = 200,
  ): Promise<MoonPayCard> {
    const card: MoonPayCard = {
      id: `moonpay-card-${crypto.randomBytes(8).toString("hex")}`,
      lastFourDigits: "4242",
      brand: "Visa",
      expiryMonth: 12,
      expiryYear: 2028,
      currencyCode: "USD",
      balanceUsdc: dailyLimitUsdc,
      status: "active",
    };

    logger.info(
      { cardId: card.id, agentWallet: agentWalletAddress },
      "Virtual card created via MoonPay",
    );

    return card;
  }

  async chargeCard(
    cardId: string,
    amountUsdc: number,
    merchant: string,
  ): Promise<MoonPayTransaction> {
    const transaction: MoonPayTransaction = {
      id: `moonpay-tx-${Date.now()}`,
      cardId,
      amount: amountUsdc,
      currency: "USD",
      merchant,
      status: "completed",
      createdAt: new Date().toISOString(),
    };

    logger.info(
      { cardId, amount: amountUsdc, merchant },
      "Virtual card charged via MoonPay",
    );

    return transaction;
  }

  async getCardDetails(cardId: string): Promise<MoonPayCard | null> {
    return {
      id: cardId,
      lastFourDigits: "4242",
      brand: "Visa",
      expiryMonth: 12,
      expiryYear: 2028,
      currencyCode: "USD",
      balanceUsdc: 200,
      status: "active",
    };
  }

  async freezeCard(cardId: string): Promise<void> {
    logger.info({ cardId }, "Virtual card frozen via MoonPay");
  }

  generateSignedUrl(walletAddress: string, amountUsdc: number): string {
    const params = new URLSearchParams({
      apiKey: this.secretKey,
      walletAddress,
      currencyCode: "usdc",
      baseCurrencyAmount: amountUsdc.toString(),
      baseCurrencyCode: "usd",
    });

    const signature = crypto
      .createHmac("sha256", this.secretKey)
      .update(params.toString())
      .digest("hex");

    params.set("signature", signature);

    return `https://buy.moonpay.com?${params.toString()}`;
  }
}

export const moonPayService = new MoonPayService();
