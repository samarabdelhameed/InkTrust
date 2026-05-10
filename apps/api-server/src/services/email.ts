import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { logger } from "../utils/logger";
import { env } from "../config/env";

export class EmailService {
  private client: SESClient;
  private fromEmail: string;

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

  async sendEmail(to: string, subject: string, body: string, isHtml = true): Promise<void> {
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
      await this.client.send(command);
      logger.info({ to, subject }, "Email sent successfully via SES");
    } catch (error) {
      logger.error({ err: error, to, subject }, "Failed to send email via SES");
      throw error;
    }
  }

  // Specialized notification methods
  async sendApprovalNotification(caregiverEmail: string, requestDetails: any) {
    const subject = "Caregiver Approval Required - InkTrust";
    const body = `<h1>Approval Required</h1><p>Elderly user is requesting ${requestDetails.amount} SOL for ${requestDetails.purpose}.</p>`;
    await this.sendEmail(caregiverEmail, subject, body);
  }

  async sendTransactionReceipt(userEmail: string, txSignature: string) {
    const subject = "Transaction Confirmation - InkTrust";
    const body = `<p>Your transaction has been executed successfully. Signature: ${txSignature}</p>`;
    await this.sendEmail(userEmail, subject, body);
  }
}

export const emailService = new EmailService();
