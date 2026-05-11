import axios from "axios";
import PDFDocument from "pdfkit";
import { env } from "../../config/env";
import { storageService } from "../s3";
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
  private readonly baseUrl = "https://api.telnyx.com/v2";
  private readonly isConfigured: boolean;

  constructor() {
    this.apiKey = env.TELNYX_API_KEY;
    this.isConfigured = !!this.apiKey && !!env.TELNYX_CONNECTION_ID;
  }

  async sendFax(params: SendFaxParams): Promise<FaxSendResult> {
    const fromNumber = params.from || env.SYSTEM_FAX_NUMBER || "+18139998877";

    if (!this.isConfigured) {
      const faxId = `telnyx-fax-${Date.now()}`;
      logger.warn({ faxId, to: params.to }, "TELNYX not configured — dry-run");
      return { faxId, status: "queued_dry_run", cost: 0 };
    }

    try {
      let mediaUrl = params.pdfUrl;
      if (params.pdfContent && !mediaUrl) {
        const key = storageService.getKeyForFax(`fax-${Date.now()}`, "receipt.pdf");
        await storageService.uploadFile(key, params.pdfContent, "application/pdf");
        mediaUrl = await storageService.getSignedUrlForDownload(key, 3600);
      }

      const { data } = await axios.post(
        `${this.baseUrl}/faxes`,
        {
          connection_id: env.TELNYX_CONNECTION_ID,
          from: fromNumber,
          to: params.to,
          media_url: mediaUrl,
          quality: "high",
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
        },
      );

      const faxId = data.data?.id || `telnyx-fax-${Date.now()}`;
      logger.info({ faxId, to: params.to }, "Outbound fax sent via Telnyx");
      return { faxId, status: "queued", cost: 0.05 };
    } catch (err: any) {
      const faxId = `telnyx-fax-${Date.now()}`;
      logger.error({ err: err.response?.data || err.message, to: params.to }, "Telnyx API call failed");
      return { faxId, status: "failed", cost: 0 };
    }
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
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument();
      const chunks: Buffer[] = [];

      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", (err) => reject(err));

      // PDF Content
      doc.fontSize(20).text("INKTRUST RECEIPT", { align: "center" });
      doc.moveDown();
      doc.fontSize(12).text("========================================", { align: "center" });
      doc.moveDown();

      doc.text(`Fax ID:      ${params.faxId}`);
      doc.text(`From:        ${params.from}`);
      doc.text(`To:          ${params.to}`);
      doc.text(`Date:        ${params.timestamp.toLocaleString()}`);
      doc.moveDown();

      doc.fontSize(14).text("Transaction Details:", { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(12).text(`Merchant:    ${params.merchant}`);
      doc.text(`Amount:      ¥${params.amount.toLocaleString()}`);
      doc.text(`Status:      ${params.status}`);
      doc.moveDown();

      doc.fontSize(12).text("========================================", { align: "center" });
      doc.moveDown();
      doc.fontSize(10).text("Thank you for using InkTrust.", { align: "center", oblique: true });

      doc.end();
    });
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
