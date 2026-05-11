import { describe, it, expect } from "vitest";
import { swigService } from "../src/services/swig";
import { moonPayService } from "../src/services/moonpay";
import { privyService } from "../src/services/sponsors/privy.service";
import { telnyxFaxOutService } from "../src/services/telnyx/fax-out";
import { x402Service } from "../src/services/x402";
import { encryptionService } from "../src/services/arcium";
import { blockchainClient } from "../src/blockchain/client";
import { blinkService } from "../src/blockchain/blink-service";
import { heliusService } from "../src/services/helius";
import { worldIdService } from "../src/services/world-id";

describe("SwigService", () => {
  it("creates a policy with defaults", async () => {
    const policy = await swigService.createPolicy("test-user", {});
    expect(policy.dailyLimitUsdc).toBe(50);
    expect(policy.monthlyLimitUsdc).toBe(500);
    expect(policy.requiresCaregiverApproval).toBe(true);
  });

  it("approves transactions under limit", async () => {
    const result = await swigService.requestApproval("test-user", {
      amountUsdc: 10,
      merchant: "test-merchant",
      description: "test",
    });
    expect(result.approved).toBe(true);
    expect(result.transactionId).toMatch(/^swig-tx-/);
  });

  it("rejects transactions over limit", async () => {
    const result = await swigService.requestApproval("test-user", {
      amountUsdc: 100,
      merchant: "test-merchant",
      description: "test",
    });
    expect(result.approved).toBe(false);
    expect(result.reason).toBe("EXCEEDS_LIMIT");
  });

  it("returns spending summary", async () => {
    const summary = await swigService.getSpendingSummary("test-user");
    expect(summary.dailyLimit).toBe(50);
    expect(summary.remainingDaily).toBe(50);
  });

  it("fetches policy from API or returns null gracefully", async () => {
    const policy = await swigService.getPolicy("nonexistent-policy-id");
    expect(policy).toBeNull();
  });
});

describe("MoonPayService", () => {
  it("creates a virtual card", async () => {
    const card = await moonPayService.createVirtualCard("test-wallet-address");
    expect(card.id).toMatch(/^moonpay-card-/);
    expect(card.balanceUsdc).toBe(200);
    expect(card.status).toBe("active");
  });

  it("charges a card", async () => {
    const tx = await moonPayService.chargeCard("test-card-id", 50, "test-merchant");
    expect(tx.status).toBe("completed");
    expect(tx.amount).toBe(50);
  });

  it("generates a signed buy URL", () => {
    const url = moonPayService.generateSignedUrl("test-wallet", 100);
    expect(url).toContain("buy.moonpay.com");
    expect(url).toContain("signature=");
    expect(url).toContain("apiKey=");
  });

  it("freezes a card gracefully", async () => {
    await expect(moonPayService.freezeCard("test-card-id")).resolves.toBeUndefined();
  });

  it("returns quote (or null if API fails)", async () => {
    const quote = await moonPayService.getBuyQuote("usdc", 100);
    // May return real quote if API key is valid, or null if not
    if (quote !== null) {
      expect(quote).toHaveProperty("quoteCurrencyAmount");
    }
  });
});

describe("PrivyService", () => {
  it("provisions a wallet", async () => {
    const result = await privyService.provisionInvisibleWallet("test-user");
    expect(result.address).toBeTruthy();
  });

  it("rejects invalid auth tokens", async () => {
    await expect(privyService.verifyUserIdentity("invalid-token")).rejects.toThrow();
  });
});

describe("TelnyxFaxOutService", () => {
  it("generates a minimal valid PDF receipt", async () => {
    const pdf = await telnyxFaxOutService.generateReceiptPdf({
      faxId: "test-fax-123",
      from: "+18135551234",
      to: "+18135555678",
      amount: 5000,
      merchant: "Test Store",
      status: "completed",
      timestamp: new Date(),
    });
    expect(pdf).toBeInstanceOf(Buffer);
    expect(pdf.slice(0, 5).toString()).toBe("%PDF-");
  });

  it("sends fax in dry-run mode when Telnyx not configured", async () => {
    const result = await telnyxFaxOutService.sendFax({
      to: "+18135555678",
      pdfUrl: "https://example.com/test.pdf",
    });
    expect(result.status).toBe("queued_dry_run");
  });

  it("sends receipt fax in dry-run mode", async () => {
    const result = await telnyxFaxOutService.sendReceiptFax("+18135555678", {
      faxId: "test-fax-123",
      amount: 5000,
      merchant: "Test Store",
      status: "completed",
    });
    expect(result.status).toBe("queued_dry_run");
  });
});

describe("X402Service", () => {
  it("creates a payment authorization with signature", async () => {
    const result = await x402Service.createPaymentAuthorization({
      serviceUrl: "https://api.example.com/service",
      amountUsdc: 10,
      senderWallet: "test-sender",
      recipientWallet: "test-recipient",
      purpose: "test",
    });
    expect(result.success).toBe(true);
    expect(result.paymentHeader).toContain("x402 usdc=10");
    expect(result.paymentHeader).toContain("sig=");
  });

  it("fails to pay for API service with invalid URL", async () => {
    await expect(
      x402Service.payForApiService("https://nonexistent.example.com/api", 10, "test-wallet")
    ).rejects.toThrow();
  });
});

describe("EncryptionService", () => {
  it("encrypts and decrypts data", async () => {
    const original = JSON.stringify({ hello: "world", amount: 5000 });
    const encrypted = await encryptionService.encrypt(original);
    expect(encrypted.ciphertext).toBeTruthy();
    expect(encrypted.iv).toBeTruthy();
    expect(encrypted.tag).toBeTruthy();

    const decrypted = await encryptionService.decrypt(encrypted.ciphertext, encrypted.iv, encrypted.tag);
    expect(decrypted).toBe(original);
  });

  it("encrypts and decrypts fax data", async () => {
    const original = Buffer.from("test fax content for encryption");
    const encrypted = await encryptionService.encryptFaxData(original);
    expect(typeof encrypted).toBe("string");

    const decrypted = await encryptionService.decryptFaxData(encrypted);
    expect(decrypted.toString()).toBe(original.toString());
  });
});

describe("BlockchainClient", () => {
  it("initializes with connection and agent keypair", () => {
    expect(blockchainClient.connection).toBeTruthy();
    expect(blockchainClient.agentPublicKey).toBeTruthy();
  });

  it("returns agent public key as base58", () => {
    const pk = blockchainClient.agentPublicKey;
    expect(pk.toBase58()).toBeTruthy();
    expect(pk.toBase58().length).toBeGreaterThan(30);
  });

  it("handles getBalance gracefully", async () => {
    const balance = await blockchainClient.getBalance(blockchainClient.agentPublicKey);
    expect(typeof balance).toBe("number");
  });

  it("getFaxRequestState returns default when program not ready", async () => {
    if (!blockchainClient.isReady) {
      const state = await blockchainClient.getFaxRequestState(blockchainClient.agentPublicKey);
      expect(state.amount).toBe(0);
      // Anchor may return snake_case or camelCase depending on version
      expect(state.is_approved === false || state.isApproved === false).toBe(true);
    }
  });
});

describe("BlinkService", () => {
  it("generates blink for any PDA", async () => {
    const blink = await blinkService.generateFaxApprovalBlink("D8w7y2m9VywSfAMG48dgiroienfrX419wjESVxPyv4sR");
    expect(blink.title).toBeTruthy();
    expect(blink.label).toBeTruthy();
  });

  it("handleBlinkPost returns a transaction for any account", async () => {
    const response = await blinkService.handleBlinkPost(
      { account: "D8w7y2m9VywSfAMG48dgiroienfrX419wjESVxPyv4sR" },
      "D8w7y2m9VywSfAMG48dgiroienfrX419wjESVxPyv4sR",
    );
    expect(response).toHaveProperty("transaction");
    expect(response).toHaveProperty("type", "transaction");
  });
});

describe("Helius RPC", () => {
  it("provides a working RPC connection", async () => {
    const conn = heliusService.getConnection();
    const version = await conn.getVersion();
    expect(version).toHaveProperty("solana-core");
  });
});

describe("World ID Service", () => {
  it("initializes with app ID", () => {
    expect(worldIdService).toBeTruthy();
  });
});
