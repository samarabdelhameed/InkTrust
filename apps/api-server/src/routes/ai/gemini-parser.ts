import { Router, Request, Response } from "express";

export const geminiParserRouter = Router();

/**
 * POST /api/ai/parse-fax
 *
 * Gemini 2.0 Flash — Multimodal Fax Parser
 * Receives a fax image URL and uses Gemini Vision AI to:
 * 1. Perform Japanese handwriting OCR
 * 2. Extract structured intent (PURCHASE, INQUIRY, PAYMENT, APPOINTMENT)
 * 3. Detect Circle-to-Approve marks (approve/reject)
 * 4. Return a structured JSON intent object
 */
geminiParserRouter.post("/parse-fax", async (req: Request, res: Response) => {
  try {
    const { imageUrl, faxId } = req.body;

    console.log(`🧠 Parsing fax image: ${faxId}`);

    // TODO: Download image from URL
    // TODO: Initialize Gemini 2.0 Flash client
    // const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Structured prompt for intent extraction
    const systemPrompt = `You are InkTrust AI — an intent extraction engine for handwritten fax documents from elderly users in Japan.

Analyze the attached fax image and extract:
1. INTENT_TYPE: one of [PURCHASE, INQUIRY, PAYMENT, APPOINTMENT, APPROVAL]
2. If APPROVAL: detect whether the user drew a circle around "APPROVE" or "REJECT"
3. ITEMS: list of items or services mentioned
4. AMOUNT: estimated cost if applicable (in JPY)
5. URGENCY: one of [LOW, NORMAL, HIGH, EMERGENCY]
6. REQUIRES_FINANCIAL_APPROVAL: boolean

Return ONLY valid JSON in this format:
{
  "intent_type": "PURCHASE",
  "items": ["blood pressure medication"],
  "amount_jpy": 4500,
  "urgency": "NORMAL",
  "requires_approval": true,
  "circle_detected": null,
  "raw_text": "extracted handwritten text",
  "confidence": 0.95
}`;

    // TODO: Call Gemini Vision API
    // const result = await model.generateContent([systemPrompt, imagePart]);

    // Placeholder response
    const parsedIntent = {
      faxId,
      intent_type: "PURCHASE",
      items: ["blood pressure medication"],
      amount_jpy: 4500,
      urgency: "NORMAL",
      requires_approval: true,
      circle_detected: null,
      raw_text: "血圧の薬をいつものでお願いします",
      confidence: 0.95,
      parsed_at: new Date().toISOString(),
    };

    console.log(`   Intent: ${parsedIntent.intent_type} — ${parsedIntent.items.join(", ")}`);
    console.log(`   Amount: ¥${parsedIntent.amount_jpy}`);
    console.log(`   Requires approval: ${parsedIntent.requires_approval}`);

    res.json(parsedIntent);
  } catch (error) {
    console.error("❌ Gemini parsing error:", error);
    res.status(500).json({ error: "AI parsing failed" });
  }
});
