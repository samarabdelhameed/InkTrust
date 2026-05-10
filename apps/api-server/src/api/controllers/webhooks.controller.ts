import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { faxQueue } from '../../queues/bullmq/fax-queue';
import { logger } from '../../lib/logger';
import { z } from 'zod';

const FaxReceivedSchema = z.object({
  data: z.object({
    event_type: z.string(),
    id: z.string(),
    payload: z.object({
      fax_id: z.string(),
      direction: z.string(),
      from: z.string(),
      to: z.string(),
      media_url: z.string().optional(),
    }),
  }),
});

export class WebhooksController {
  static async handleTelnyxFax(req: Request, res: Response) {
    try {
      const result = FaxReceivedSchema.safeParse(req.body);
      if (!result.success) {
        logger.error({ errors: result.error }, 'Invalid Telnyx webhook payload');
        return res.status(400).json({ error: 'Invalid payload' });
      }

      const { payload } = result.data.data;

      // Find user by fax number
      const user = await prisma.user.findUnique({
        where: { faxNumber: payload.to },
      });

      if (!user) {
        logger.warn({ to: payload.to }, 'Fax received for unknown user');
        return res.status(200).send(); // Acknowledge to stop retries
      }

      // Persist Job
      const faxJob = await prisma.faxJob.create({
        data: {
          userId: user.id,
          externalFaxId: payload.fax_id,
          mediaUrl: payload.media_url,
          status: 'RECEIVED',
        },
      });

      // Push to BullMQ
      await faxQueue.add('process-fax', {
        jobId: faxJob.id,
        mediaUrl: payload.media_url,
        from: payload.from,
      });

      logger.info({ jobId: faxJob.id, faxId: payload.fax_id }, 'Fax job queued for processing');

      return res.status(200).json({ status: 'queued', jobId: faxJob.id });
    } catch (error) {
      logger.error({ err: error }, 'Failed to handle Telnyx webhook');
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}
