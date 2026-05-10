import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../../config/env';
import { logger } from '../../utils/logger';

export class GeminiService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    this.genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
  }

  async parseFaxIntent(mediaBuffer: Buffer) {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      
      const prompt = `
        Analyze this fax image and extract:
        1. intent (e.g., purchase, medication refill, utility bill)
        2. amount (numeric value if present)
        3. merchant (name of company)
        4. medication (names if any)
        5. urgency (LOW, NORMAL, HIGH)
        
        Return JSON only.
      `;

      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: mediaBuffer.toString('base64'),
            mimeType: 'image/jpeg',
          },
        },
      ]);

      const response = await result.response;
      const text = response.text();
      
      return JSON.parse(text.replace(/```json|```/g, ''));
    } catch (error) {
      logger.error({ err: error }, 'Gemini AI processing failed');
      throw error;
    }
  }
}

export const geminiService = new GeminiService();
