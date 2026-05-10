
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as fs from "fs";
import * as path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.join(__dirname, "../../../.env") });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

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

async function runTest() {
  const imageDir = "/Users/s/.gemini/antigravity/brain/df569bed-3b2d-4026-aace-1e20368c95f7";
  const files = fs.readdirSync(imageDir);
  const imageFile = files.find(f => f.startsWith("fax_approval_circle_test") && f.endsWith(".png"));

  if (!imageFile) {
    console.error("No test image found!");
    return;
  }

  const imagePath = path.join(imageDir, imageFile);
  console.log(`Testing image: ${imagePath}`);

  const imageData = fs.readFileSync(imagePath).toString("base64");
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const result = await model.generateContent([
    { text: SYSTEM_PROMPT },
    {
      inlineData: {
        mimeType: "image/png",
        data: imageData,
      },
    },
  ]);

  const response = result.response;
  const text = response.text();
  console.log("AI Response Raw:", text);

  try {
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const parsed = JSON.parse(cleaned);
    console.log("Parsed Intent:", JSON.stringify(parsed, null, 2));

    if (parsed.circle_detected === "APPROVE") {
      console.log("✅ SUCCESS: Circle around APPROVE detected!");
      console.log("🔗 Solana Link Ready: https://inktrust.app/api/v1/actions/approve/TEST_PDA");
    } else {
      console.warn("❌ FAILED: Circle not detected correctly.");
    }
  } catch (e) {
    console.error("Failed to parse JSON", e);
  }
}

runTest();
