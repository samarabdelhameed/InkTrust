// ============================================================
// InkTrust — Shared TypeScript Types
// ============================================================
// These types are shared between the API server and web dashboard
// to ensure type safety across the monorepo.
// ============================================================

/**
 * Fax intent types that Gemini Vision AI can classify.
 */
export type IntentType =
  | "PURCHASE"
  | "INQUIRY"
  | "PAYMENT"
  | "APPOINTMENT"
  | "APPROVAL";

/**
 * Urgency levels for fax requests.
 */
export type UrgencyLevel = "LOW" | "NORMAL" | "HIGH" | "EMERGENCY";

/**
 * Status of a fax request through the pipeline.
 */
export type RequestStatus =
  | "RECEIVED"
  | "AI_PROCESSING"
  | "INTENT_EXTRACTED"
  | "WAITING_APPROVAL"
  | "APPROVED"
  | "EXECUTING"
  | "EXECUTED"
  | "FAILED"
  | "CLOSED";

/**
 * Structured intent extracted by Gemini Vision AI from a fax image.
 */
export interface ParsedIntent {
  intent_type: IntentType;
  items: string[];
  amount_jpy: number | null;
  urgency: UrgencyLevel;
  requires_approval: boolean;
  circle_detected: "APPROVE" | "REJECT" | null;
  raw_text: string;
  confidence: number;
}

/**
 * A fax request in the InkTrust pipeline.
 */
export interface FaxRequest {
  id: string;
  userId: string;
  faxNumber: string;
  status: RequestStatus;
  mediaUrl: string;
  parsedIntent: ParsedIntent | null;
  onchainPda: string | null;
  caregiverWallet: string | null;
  blinkUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * A registered senior user in the InkTrust system.
 */
export interface User {
  id: string;
  faxNumber: string;
  proxyEmail: string;
  embeddedWallet: string;
  dailySpendingLimit: number;
  caregivers: Caregiver[];
}

/**
 * A caregiver (family member) authorized to approve transactions.
 */
export interface Caregiver {
  id: string;
  userId: string;
  walletAddress: string;
  name: string;
  phone: string;
  role: "PRIMARY" | "SECONDARY";
}

/**
 * Trusted contact whitelisted to communicate with the senior.
 */
export interface TrustedContact {
  id: string;
  userId: string;
  email: string;
  name: string;
  relationship: string;
}

/**
 * x402 micropayment request from an AI agent.
 */
export interface X402PaymentRequest {
  serviceUrl: string;
  amountUsdc: number;
  agentWallet: string;
  purpose: string;
}

/**
 * Solana Blink action metadata (Solana Actions specification).
 */
export interface BlinkActionMetadata {
  icon: string;
  title: string;
  description: string;
  label: string;
  links: {
    actions: {
      label: string;
      href: string;
      type: "transaction";
    }[];
  };
}
