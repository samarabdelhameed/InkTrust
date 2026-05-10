import { AiLogRepository } from '../repositories/ai-log.repository';

const repo = new AiLogRepository();

export class AiProcessingService {
  async log(params: {
    faxRequestId: string;
    model?: string;
    promptTokens?: number;
    outputTokens?: number;
    confidence?: number;
    rawResponse?: Record<string, unknown>;
    intent?: Record<string, unknown>;
    error?: string;
    processingMs?: number;
  }) {
    return repo.create({
      faxRequest: { connect: { id: params.faxRequestId } },
      model: params.model ?? 'gemini-2.0-flash',
      promptTokens: params.promptTokens,
      outputTokens: params.outputTokens,
      confidence: params.confidence,
      rawResponse: params.rawResponse ?? undefined,
      intent: params.intent ?? undefined,
      error: params.error,
      processingMs: params.processingMs,
    });
  }

  async getFaxLogs(faxRequestId: string) {
    return repo.findByFaxRequest(faxRequestId);
  }

  async getAverageConfidence() {
    return repo.getAverageConfidence();
  }
}

export const aiProcessingService = new AiProcessingService();
