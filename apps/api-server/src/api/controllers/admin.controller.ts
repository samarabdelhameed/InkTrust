import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { logger } from '../../lib/logger';
import axios from 'axios';
import { env } from '../../lib/env';

export class AdminController {
  static async getPendingJobs(req: Request, res: Response) {
    try {
      const jobs = await prisma.faxJob.findMany({
        where: { status: 'AWAITING_APPROVAL' },
        include: { user: true, approvalRequest: true },
        orderBy: { createdAt: 'desc' },
      });
      return res.json(jobs);
    } catch (error) {
      logger.error({ err: error }, 'Failed to fetch pending jobs');
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async approveJobManually(req: Request, res: Response) {
    const { jobId } = req.params;
    const { notes } = req.body;

    try {
      await prisma.faxJob.update({
        where: { id: jobId },
        data: { status: 'EXECUTING' },
      });

      await prisma.auditReview.create({
        data: {
          faxJobId: jobId,
          riskScore: 0.1,
          moderatorAction: 'MANUAL_APPROVE',
          moderatorNotes: notes,
        },
      });

      return res.json({ status: 'success' });
    } catch (error) {
      logger.error({ err: error }, 'Manual approval failed');
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async sendReceiptFax(req: Request, res: Response) {
    const { jobId } = req.body;

    try {
      const job = await prisma.faxJob.findUnique({
        where: { id: jobId },
        include: { user: true },
      });

      if (!job) return res.status(404).json({ error: 'Job not found' });

      // In production, we would generate a PDF and upload to S3 first
      const mediaUrl = job.mediaUrl; // Mocking receipt as same fax for now

      await axios.post(
        'https://api.telnyx.com/v2/faxes',
        {
          to: job.user.faxNumber,
          from: process.env.TELNYX_FROM_NUMBER,
          media_url: mediaUrl,
        },
        {
          headers: { Authorization: `Bearer ${env.TELNYX_API_KEY}` },
        }
      );

      logger.info({ jobId }, 'Outbound receipt fax sent via Telnyx');
      return res.json({ status: 'sent' });
    } catch (error) {
      logger.error({ err: error }, 'Failed to send receipt fax');
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}
