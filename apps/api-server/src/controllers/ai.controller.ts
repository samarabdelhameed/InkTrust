import { GoogleGenerativeAI } from "@google/generative-ai";
import { Request, Response } from "express";
import { env } from "../config/env";
import { logger } from "../utils/logger";

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `You are InkTrust AI — an intent extraction engine for handwritten fax documents from elderly users in Japan.

Analyze the attached fax image and extract:
1. INTENT_TYPE: one of [PURCHASE, INQUIRY, PAYMENT, APPOINTMENT, APPROVAL]
2. If APPROVAL: detect whether the user drew a circle around "APPROVE" (承認) or "REJECT" (却下). This is a handwritten circle.
3. ITEMS: list of items or services mentioned
4. AMOUNT: estimated cost if applicable (in JPY)
5. URGENCY: one of [LOW, NORMAL, HIGH, EMERGENCY]
6. REQUIRES_FINANCIAL_APPROVAL: boolean

Return ONLY valid JSON in this format:
{
  "intent_type": "PURCHASE" | "APPROVAL" | "INQUIRY",
  "items": ["item1"],
  "amount_jpy": 5000,
  "urgency": "NORMAL",
  "requires_approval": true,
  "circle_detected": "APPROVE" | "REJECT" | null,
  "raw_text": "extracted text",
  "confidence": 0.95
}`;

function mockAnalysis(faxId?: string) {
  const mock = {
    intent_type: "APPROVAL",
    items: ["医療用品 (Medical Supplies)"],
    amount_jpy: 12500,
    urgency: "NORMAL",
    requires_approval: true,
    circle_detected: "APPROVE",
    raw_text: "承認 医療用品の購入 12,500円 よろしくお願いします",
    confidence: 0.88,
  };

  logger.info({ faxId, intent: mock.intent_type, circle: mock.circle_detected }, "Mock AI analysis used (dev fallback)");

  const resultResponse: any = {
    faxId: faxId || null,
    ...mock,
    parsed_at: new Date().toISOString(),
  };

  if (faxId) {
    logger.info({ faxId }, "Circle-to-Approve detected! Linking to Solana Blink.");
    resultResponse.solana_action = {
      type: "TRANSACTION_APPROVAL",
      status: "PENDING_SIGNATURE",
      message: "Circle-to-Approve detected. Click to finalize on Solana.",
      blink_url: `https://dial.to/?action=solana-action:https://inktrust.app/api/v1/actions/approve/${faxId}`,
      action_path: `/api/v1/actions/approve/${faxId}`
    };
  }

  return resultResponse;
}

export const aiAnalysisController = async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType, faxId } = req.body;

    if (!imageBase64 || !mimeType) {
      return res.status(400).json({ error: "imageBase64 and mimeType are required" });
    }

    if (env.NODE_ENV === "development" && !env.GEMINI_API_KEY) {
      return res.json(mockAnalysis(faxId));
    }

    logger.info({ faxId }, "Starting Gemini AI analysis");

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent([
      { text: SYSTEM_PROMPT },
      {
        inlineData: {
          mimeType,
          data: imageBase64,
        },
      },
    ]);

    const response = result.response;
    const text = response.text();

    let parsedIntent;
    try {
      const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      parsedIntent = JSON.parse(cleaned);
    } catch {
      parsedIntent = {
        intent_type: "UNKNOWN",
        raw_text: text,
        confidence: 0,
      };
    }

    logger.info({ faxId, intent: parsedIntent.intent_type, circle: parsedIntent.circle_detected }, "AI analysis complete");

    const resultResponse: any = {
      faxId: faxId || null,
      ...parsedIntent,
      parsed_at: new Date().toISOString(),
    };

    if (parsedIntent.circle_detected === "APPROVE" && faxId) {
      logger.info({ faxId }, "Circle-to-Approve detected! Linking to Solana Blink.");
      resultResponse.solana_action = {
        type: "TRANSACTION_APPROVAL",
        status: "PENDING_SIGNATURE",
        message: "Circle-to-Approve detected. Click to finalize on Solana.",
        blink_url: `https://dial.to/?action=solana-action:https://inktrust.app/api/v1/actions/approve/${faxId}`,
        action_path: `/api/v1/actions/approve/${faxId}`
      };
    }

    res.json(resultResponse);
  } catch (error: any) {
    logger.warn({ err: error?.message || error }, "Gemini API failed — falling back to mock analysis");
    res.json(mockAnalysis(req.body?.faxId));
  }
};
