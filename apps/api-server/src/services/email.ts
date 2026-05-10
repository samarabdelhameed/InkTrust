import { SESClient, SendEmailCommand, GetSendQuotaCommand } from "@aws-sdk/client-ses";
import { logger } from "../utils/logger";
import { env } from "../config/env";
import { approvalQueue } from "../queues";

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export class EmailService {
  private client: SESClient;
  private fromEmail: string;
  private rateLimitPerSecond = 14;
  private lastSendTimestamps: number[] = [];

  constructor() {
    this.client = new SESClient({
      region: env.AWS_REGION,
      credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
      },
    });
    this.fromEmail = process.env.SES_FROM_EMAIL || "notifications@inktrust.io";
  }

  private async rateLimit() {
    const now = Date.now();
    this.lastSendTimestamps = this.lastSendTimestamps.filter(t => now - t < 1000);
    if (this.lastSendTimestamps.length >= this.rateLimitPerSecond) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    this.lastSendTimestamps.push(now);
  }

  async sendEmail(to: string, subject: string, body: string, isHtml = true): Promise<string | null> {
    await this.rateLimit();
    const command = new SendEmailCommand({
      Destination: { ToAddresses: [to] },
      Message: {
        Subject: { Data: subject },
        Body: {
          [isHtml ? "Html" : "Text"]: { Data: body },
        },
      },
      Source: this.fromEmail,
    });

    try {
      const result = await this.client.send(command);
      logger.info({ to, subject, messageId: result.MessageId }, "Email sent successfully via SES");
      return result.MessageId ?? null;
    } catch (error: any) {
      if (error.name === 'Bounce') {
        logger.error({ to, error }, "Email bounced — removing from active list");
        await this.handleBounce(to);
      }
      logger.error({ err: error, to, subject }, "Failed to send email via SES");
      return null;
    }
  }

  private async handleBounce(email: string) {
    logger.warn({ email }, "Handling email bounce — would remove from active list");
  }

  private renderTemplate(template: string, vars: Record<string, string>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? `{{${key}}}`);
  }

  private getApprovalTemplate(details: {
    caregiverName: string;
    amount: string;
    purpose: string;
    elderlyName: string;
    blinkUrl: string;
    expiresIn: string;
  }): EmailTemplate {
    return {
      subject: `Action Required: Approve ${details.amount} request from ${details.elderlyName}`,
      html: this.renderTemplate(`<!DOCTYPE html>
<html><body style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px; color: white; text-align: center;">
<h1>InkTrust</h1>
<p style="font-size: 18px;">Caregiver Approval Required</p>
</div>
<div style="padding: 30px; background: #f9fafb; border-radius: 0 0 12px 12px;">
<p>Hello {{caregiverName}},</p>
<p>{{elderlyName}} has initiated a request for <strong>{{purpose}}</strong> totaling <strong>{{amount}}</strong>.</p>
<a href="{{blinkUrl}}" style="display: inline-block; padding: 14px 28px; background: #667eea; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">Approve with Phantom</a>
<p style="color: #6b7280; font-size: 12px; margin-top: 20px;">This request expires in {{expiresIn}}. If you do not recognize this request, please contact support immediately.</p>
</div></body></html>`, details),
      text: `Hello ${details.caregiverName},\n\n${details.elderlyName} has initiated a request for ${details.purpose} totaling ${details.amount}.\n\nApprove here: ${details.blinkUrl}\n\nExpires in ${details.expiresIn}.`,
    };
  }

  private getReceiptTemplate(details: {
    name: string;
    amount: string;
    merchant: string;
    txSignature: string;
    date: string;
  }): EmailTemplate {
    return {
      subject: `Purchase Confirmed — ${details.amount} at ${details.merchant}`,
      html: this.renderTemplate(`<!DOCTYPE html>
<html><body style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
<div style="background: #10b981; padding: 30px; border-radius: 12px; color: white; text-align: center;">
<h1>✓ Purchase Complete</h1>
</div>
<div style="padding: 30px; background: #f9fafb;">
<p>Hello {{name}},</p>
<p>Your purchase of <strong>{{amount}}</strong> at <strong>{{merchant}}</strong> has been completed.</p>
<p>Transaction: <code style="background: #e5e7eb; padding: 4px 8px; border-radius: 4px;">{{txSignature}}</code></p>
<p>Date: {{date}}</p>
<a href="https://solscan.io/tx/{{txSignature}}" style="color: #667eea;">View on Solscan</a>
</div></body></html>`, details),
      text: `Purchase Complete!\n\nAmount: ${details.amount}\nMerchant: ${details.merchant}\nTransaction: ${details.txSignature}\nDate: ${details.date}`,
    };
  }

  async sendApprovalNotification(caregiverEmail: string, details: {
    caregiverName: string;
    amount: string;
    purpose: string;
    elderlyName: string;
    blinkUrl: string;
    expiresIn?: string;
  }) {
    const template = this.getApprovalTemplate({
      ...details,
      expiresIn: details.expiresIn ?? '24 hours',
    });
    return this.sendEmail(caregiverEmail, template.subject, template.html);
  }

  async sendTransactionReceipt(userEmail: string, details: {
    name: string;
    amount: string;
    merchant: string;
    txSignature: string;
  }) {
    const template = this.getReceiptTemplate({
      ...details,
      date: new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    });
    return this.sendEmail(userEmail, template.subject, template.html);
  }

  async queueEmail(to: string, subject: string, body: string, priority = 0) {
    await approvalQueue.add('send-email', { to, subject, body }, { priority });
  }

  async getSendQuota() {
    try {
      const command = new GetSendQuotaCommand({});
      const quota = await this.client.send(command);
      return {
        max24HourSend: quota.Max24HourSend,
        sentLast24Hours: quota.SentLast24Hours,
        maxSendRate: quota.MaxSendRate,
      };
    } catch {
      return null;
    }
  }
}

export const emailService = new EmailService();
