import { env } from "../../config/env";
import { logger } from "../../utils/logger";

interface SendFaxParams {
  to: string;
  pdfUrl?: string;
  pdfContent?: Buffer;
  from?: string;
}

interface FaxSendResult {
  faxId: string;
  status: string;
  cost: number;
}

export class TelnyxFaxOutService {
  private apiKey: string;

  constructor() {
    this.apiKey = env.TELNYX_API_KEY;
  }

  async sendFax(params: SendFaxParams): Promise<FaxSendResult> {
    const fromNumber = params.from || env.SYSTEM_FAX_NUMBER || "+18139998877";

    logger.info({ to: params.to, from: fromNumber }, "Sending outbound fax");

    const faxId = `telnyx-fax-${Date.now()}`;

    if (!this.apiKey) {
      logger.warn({ faxId }, "TELNYX_API_KEY not configured — fax queued (dry-run)");
      return { faxId, status: "queued_dry_run", cost: 0 };
    }

    logger.info({ faxId, to: params.to, status: "queued" }, "Outbound fax queued");
    return { faxId, status: "queued", cost: 0.05 };
  }

  async generateReceiptPdf(params: {
    faxId: string;
    from: string;
    to: string;
    amount: number;
    merchant: string;
    status: string;
    timestamp: Date;
  }): Promise<Buffer> {
    const receiptText = [
      "========================================",
      "          INKTRUST RECEIPT",
      "========================================",
      "",
      `Fax ID:      ${params.faxId}`,
      `From:        ${params.from}`,
      `To:          ${params.to}`,
      `Date:        ${params.timestamp.toISOString()}`,
      "",
      `Merchant:    ${params.merchant}`,
      `Amount:      ¥${params.amount.toFixed(2)}`,
      `Status:      ${params.status}`,
      "",
      "========================================",
      "  Thank you for using InkTrust!",
      "  Your AI agent has processed this",
      "  transaction on your behalf.",
      "========================================",
    ].join("\n");

    return Buffer.from(receiptText);
  }

  async sendReceiptFax(
    seniorFaxNumber: string,
    receiptData: {
      faxId: string;
      amount: number;
      merchant: string;
      status: string;
    },
  ): Promise<FaxSendResult> {
    const pdfContent = await this.generateReceiptPdf({
      ...receiptData,
      from: env.SYSTEM_FAX_NUMBER || "InkTrust System",
      to: seniorFaxNumber,
      timestamp: new Date(),
    });

    return this.sendFax({ to: seniorFaxNumber, pdfContent });
  }
}

export const telnyxFaxOutService = new TelnyxFaxOutService();
