import axios from "axios";
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

function escapePdfString(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function textToMinimalPdf(text: string): Buffer {
  const lines = text.split("\n");
  const textObjects: string[] = [];
  let y = 760;
  for (const line of lines) {
    textObjects.push(`1 0 0 1 50 ${y} Tm (${escapePdfString(line)}) Tj`);
    y -= 14;
  }
  const content = textObjects.join("\n") + "\n";
  const streamLen = content.length;

  const pdf = `%PDF-1.4
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj
3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>endobj
4 0 obj<</Length ${streamLen}>>stream
BT
/F1 10 Tf
${content}ET
endstream
endobj
5 0 obj<</Type/Font/Subtype/Type1/BaseFont/Courier>>endobj
xref
0 6
0000000000 65535 f\x20
0000000009 00000 n\x20
0000000058 00000 n\x20
0000000115 00000 n\x20
0000000266 00000 n\x20
0000000374 00000 n\x20
trailer
<</Size 6/Root 1 0 R>>
startxref
380
%%EOF`;

  return Buffer.from(pdf);
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
        const pdfBuf = textToMinimalPdf(params.pdfContent.toString("utf-8"));
        await storageService.uploadFile(key, pdfBuf, "application/pdf");
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
      logger.warn({ err: err.message, to: params.to }, "Telnyx API call failed, dry-run fallback");
      return { faxId, status: "queued_dry_run", cost: 0 };
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
      "",
    ].join("\n");

    return textToMinimalPdf(receiptText);
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
