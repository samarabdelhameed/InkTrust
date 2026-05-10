import prisma from '../client';
import type { Prisma } from '@prisma/client';

export class AuditLogRepository {
  async findById(id: string) {
    return prisma.auditLog.findUnique({ where: { id } });
  }

  async findByActor(actorId: string) {
    return prisma.auditLog.findMany({
      where: { actorId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByFaxRequest(faxRequestId: string) {
    return prisma.auditLog.findMany({
      where: { faxRequestId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findByAction(action: string) {
    return prisma.auditLog.findMany({
      where: { action },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: Prisma.AuditLogCreateInput) {
    return prisma.auditLog.create({ data });
  }

  async findRecent(limit = 50) {
    return prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async countByDateRange(start: Date, end: Date) {
    return prisma.auditLog.count({
      where: { createdAt: { gte: start, lte: end } },
    });
  }
}
