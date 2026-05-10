import prisma from '../client';
import type { Prisma } from '@prisma/client';

export class AiLogRepository {
  async findById(id: string) {
    return prisma.aiProcessingLog.findUnique({ where: { id } });
  }

  async findByFaxRequest(faxRequestId: string) {
    return prisma.aiProcessingLog.findMany({
      where: { faxRequestId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async create(data: Prisma.AiProcessingLogCreateInput) {
    return prisma.aiProcessingLog.create({ data });
  }

  async findRecent(limit = 20) {
    return prisma.aiProcessingLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async getAverageConfidence() {
    const result = await prisma.aiProcessingLog.aggregate({
      _avg: { confidence: true },
      where: { confidence: { not: null } },
    });
    return result._avg.confidence ?? 0;
  }

  async countByModel() {
    const logs = await prisma.aiProcessingLog.groupBy({
      by: ['model'],
      _count: { id: true },
    });
    return logs.map(l => ({ model: l.model, count: l._count.id }));
  }
}
