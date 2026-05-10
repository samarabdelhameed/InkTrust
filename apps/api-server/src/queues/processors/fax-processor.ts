import { Job } from 'bullmq';
import { prisma } from '../../lib/prisma';
import { logger } from '../../lib/logger';
import { geminiService } from '../../services/ai/gemini.service';

export const faxProcessor = async (job: Job) => {
  const { jobId, mediaUrl } = job.data;

  logger.info({ jobId }, 'Processing fax job');

  try {
    const faxJob = await prisma.faxJob.findUnique({ where: { id: jobId } });
    if (!faxJob) throw new Error(`FaxJob ${jobId} not found`);

    await prisma.faxJob.update({
      where: { id: jobId },
      data: { status: 'PROCESSING' },
    });

    let aiResult: any = { intent: 'manual_review_required', urgency: 'HIGH' };
    if (mediaUrl) {
      const { default: axios } = await import('axios');
      const response = await axios.get(mediaUrl, { responseType: 'arraybuffer' });
      const buffer = Buffer.from(response.data, 'binary');
      aiResult = await geminiService.parseFaxIntent(buffer);
    }

    await prisma.faxJob.update({
      where: { id: jobId },
      data: {
        intent: aiResult.intent,
        amount: aiResult.amount,
        merchant: aiResult.merchant,
        medication: aiResult.medication,
        urgency: aiResult.urgency,
        aiRawResponse: aiResult,
        status: 'AWAITING_APPROVAL',
      },
    });

    return aiResult;
  } catch (error) {
    logger.error({ err: error, jobId }, 'Fax processing failed');
    await prisma.faxJob.update({
      where: { id: jobId },
      data: { status: 'FAILED' },
    }).catch(() => {});
    throw error;
  }
};
