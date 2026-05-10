import { Job } from 'bullmq';
import { prisma } from '../../lib/prisma';
import { logger } from '../../lib/logger';
import { geminiService } from '../../services/ai/gemini.service';
import axios from 'axios';

export const faxProcessor = async (job: Job) => {
  const { jobId, mediaUrl } = job.data;
  
  logger.info({ jobId }, 'Processing fax job');

  try {
    await prisma.faxJob.update({
      where: { id: jobId },
      data: { status: 'PROCESSING' },
    });

    let aiResult;
    if (mediaUrl) {
      // Download media
      const response = await axios.get(mediaUrl, { responseType: 'arraybuffer' });
      const buffer = Buffer.from(response.data, 'binary');
      
      // AI Parse
      aiResult = await geminiService.parseFaxIntent(buffer);
    } else {
      aiResult = { intent: 'manual_review_required', urgency: 'HIGH' };
    }

    // Store Result
    const updatedJob = await prisma.faxJob.update({
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
      include: { user: true },
    });

    // Check if approval is needed (e.g., amount > spending limit)
    if (updatedJob.amount && updatedJob.user.spendingLimit) {
      if (Number(updatedJob.amount) > Number(updatedJob.user.spendingLimit)) {
        logger.info({ jobId }, 'Approval required: spending limit exceeded');
        // Create Approval Request
        await prisma.approvalRequest.create({
          data: {
            faxJobId: jobId,
            userId: updatedJob.userId,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
          },
        });
      }
    }

    return aiResult;
  } catch (error) {
    logger.error({ err: error, jobId }, 'Fax processing failed');
    await prisma.faxJob.update({
      where: { id: jobId },
      data: { status: 'FAILED' },
    });
    throw error;
  }
};
