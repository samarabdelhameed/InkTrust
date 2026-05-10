import { prisma } from '../client';

export class DataService {
  async createUser(data: { faxNumber: string; embeddedWalletAddress: string; proxyEmail?: string }) {
    return prisma.user.create({ data });
  }

  async getUserByWallet(address: string) {
    return prisma.user.findUnique({ where: { embeddedWalletAddress: address } });
  }

  async createAIJob(data: { userId: string; externalFaxId?: string; mediaUrl?: string }) {
    return prisma.faxJob.create({
      data: { ...data, status: 'RECEIVED' },
    });
  }

  async updateJobStatus(jobId: string, status: string, aiSummary?: string, entities?: any) {
    return prisma.faxJob.update({
      where: { id: jobId },
      data: { status: status as any, intent: aiSummary, aiRawResponse: entities, completedAt: status === 'COMPLETED' ? new Date() : undefined },
    });
  }

  async recordTransaction(data: {
    userId: string;
    faxJobId?: string;
    txSignature: string;
    amount: number;
    currency?: string;
  }) {
    return prisma.transaction.create({
      data: {
        userId: data.userId,
        faxJobId: data.faxJobId,
        txSignature: data.txSignature,
        amount: data.amount,
        currency: data.currency || 'SOL',
        status: 'CONFIRMED',
      },
    });
  }

  async logAuditEvent(data: {
    action: string;
    entityType: string;
    entityId: string;
    actorId?: string;
    details?: any;
  }) {
    return prisma.auditReview.create({
      data: {
        faxJobId: data.entityId,
        riskScore: 0,
        moderatorAction: data.action,
        moderatorNotes: data.details ? JSON.stringify(data.details) : undefined,
      },
    });
  }
}

export const dataService = new DataService();
