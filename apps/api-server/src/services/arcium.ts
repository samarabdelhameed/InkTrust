import crypto from "crypto";
import { env } from "../config/env";
import { logger } from "../utils/logger";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const TAG_LENGTH = 16;

function deriveKey(secret: string): Buffer {
  return crypto.scryptSync(secret, "inktrust-arcium-salt", 32);
}

export class ArciumService {
  private key: Buffer;

  constructor() {
    this.key = deriveKey(env.ENCRYPTION_KEY || env.GEMINI_API_KEY || "inktrust-fallback-key-32bytes!");
  }

  async encrypt(data: string): Promise<{ ciphertext: string; iv: string; tag: string }> {
    try {
      const iv = crypto.randomBytes(IV_LENGTH);
      const cipher = crypto.createCipheriv(ALGORITHM, this.key, iv);

      let encrypted = cipher.update(data, "utf8", "hex");
      encrypted += cipher.final("hex");
      const tag = cipher.getAuthTag().toString("hex");

      logger.info("Data encrypted via Arcium-compatible AES-256-GCM");
      return { ciphertext: encrypted, iv: iv.toString("hex"), tag };
    } catch (error) {
      logger.error({ err: error }, "Arcium encryption failed");
      throw error;
    }
  }

  async decrypt(ciphertext: string, iv: string, tag: string): Promise<string> {
    try {
      const decipher = crypto.createDecipheriv(
        ALGORITHM,
        this.key,
        Buffer.from(iv, "hex"),
      );
      decipher.setAuthTag(Buffer.from(tag, "hex"));

      let decrypted = decipher.update(ciphertext, "hex", "utf8");
      decrypted += decipher.final("utf8");

      return decrypted;
    } catch (error) {
      logger.error({ err: error }, "Arcium decryption failed");
      throw error;
    }
  }

  async encryptFaxData(faxContent: Buffer): Promise<string> {
    const base64 = faxContent.toString("base64");
    const encrypted = await this.encrypt(base64);
    return JSON.stringify(encrypted);
  }

  async decryptFaxData(encryptedPayload: string): Promise<Buffer> {
    const parsed = JSON.parse(encryptedPayload) as { ciphertext: string; iv: string; tag: string };
    const decrypted = await this.decrypt(parsed.ciphertext, parsed.iv, parsed.tag);
    return Buffer.from(decrypted, "base64");
  }
}

export const arciumService = new ArciumService();
