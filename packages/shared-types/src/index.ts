export enum UserRole {
  ADMIN = 'ADMIN',
  CAREGIVER = 'CAREGIVER',
  VIEWER = 'VIEWER',
}

export interface FaxPayload {
  fromNumber: string;
  pdfUrl: string;
  receivedAt: Date;
}

export interface AiIntentResult {
  confidence: number;
  extractedDetails: {
    medicationName?: string;
    storeName?: string;
    amount?: number;
  };
  intentHash: string;
}

export interface WebhookResponse {
  success: boolean;
  message?: string;
}
