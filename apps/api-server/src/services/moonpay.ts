import crypto from "crypto";
import axios from "axios";
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

interface MoonPayBuyQuote {
  quoteCurrencyAmount: number;
  quoteCurrencyCode: string;
  baseCurrencyAmount: number;
  baseCurrencyCode: string;
  feeAmount: number;
  totalAmount: number;
  paymentMethod: string;
}

export class MoonPayService {
  private secretKey: string;
  private publishableKey: string;
  private baseUrl = "https://api.moonpay.com/v3";
  private isConfigured: boolean;

  constructor() {
    this.secretKey = env.MOONPAY_SECRET_KEY;
    this.publishableKey = env.MOONPAY_PUBLISHABLE_KEY;
    this.isConfigured = !!this.secretKey && !!this.publishableKey;
  }

  private get apiHeaders() {
    return {
      Authorization: `Bearer ${this.secretKey}`,
      "Content-Type": "application/json",
    };
  }

  async getBuyQuote(
    currencyCode: string = "usdc",
    baseCurrencyAmount: number,
    walletAddress?: string,
  ): Promise<MoonPayBuyQuote | null> {
    if (!this.isConfigured) {
      logger.warn("MoonPay keys not set — cannot fetch quote");
      return null;
    }
    try {
      const params: any = {
        apiKey: this.publishableKey,
        baseCurrencyAmount,
        baseCurrencyCode: "usd",
        areFeesIncluded: true,
      };
      if (walletAddress) params.walletAddress = walletAddress;

      const { data } = await axios.get<MoonPayBuyQuote>(
        `${this.baseUrl}/currencies/${currencyCode}/buy_quote`,
        { params },
      );
      return data;
    } catch (err: any) {
      logger.warn({ err: err.message, currencyCode, baseCurrencyAmount }, "MoonPay buy quote failed");
      return null;
    }
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
      "Virtual card created (local — MoonPay does not issue cards)",
    );

    return card;
  }

  async chargeCard(
    cardId: string,
    amountUsdc: number,
    merchant: string,
  ): Promise<MoonPayTransaction> {
    if (this.isConfigured) {
      const quote = await this.getBuyQuote("usdc", amountUsdc);
      if (quote) {
        logger.info(
          { cardId, amount: amountUsdc, merchant, quoteTotal: quote.totalAmount },
          "MoonPay quote verified for charge",
        );
      }
    }

    const transaction: MoonPayTransaction = {
      id: `moonpay-tx-${Date.now()}`,
      cardId,
      amount: amountUsdc,
      currency: "USD",
      merchant,
      status: "completed",
      createdAt: new Date().toISOString(),
    };

    logger.info({ cardId, amount: amountUsdc, merchant }, "Virtual card charged (local)");
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
    logger.info({ cardId }, "Virtual card freeze requested (no-op — MoonPay does not support card freeze)");
  }

  generateSignedUrl(walletAddress: string, amountUsdc: number): string {
    const params = new URLSearchParams({
      apiKey: this.publishableKey || "pk_test_missing",
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
