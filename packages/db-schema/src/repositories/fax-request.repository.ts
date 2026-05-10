import prisma from '../client';
import type { Prisma, RequestStatus } from '@prisma/client';

export class FaxRequestRepository {
  async findById(id: string) {
    return prisma.faxRequest.findUnique({ where: { id }, include: { user: true, aiLogs: true, approvals: true } });
  }

  async findByUser(userId: string) {
    return prisma.faxRequest.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { approvals: true },
    });
  }

  async findByStatus(status: RequestStatus) {
    return prisma.faxRequest.findMany({
      where: { status },
      orderBy: { createdAt: 'asc' },
      include: { user: true },
    });
  }

  async findPendingApprovals() {
    return prisma.faxRequest.findMany({
      where: { status: 'WAITING_APPROVAL' },
      orderBy: { createdAt: 'asc' },
      include: { user: true, approvals: true },
    });
  }

  async create(data: Prisma.FaxRequestCreateInput) {
    return prisma.faxRequest.create({ data });
  }

  async updateStatus(id: string, status: RequestStatus) {
    return prisma.faxRequest.update({ where: { id }, data: { status } });
  }

  async update(id: string, data: Prisma.FaxRequestUpdateInput) {
    return prisma.faxRequest.update({ where: { id }, data });
  }

  async countByUserToday(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return prisma.faxRequest.count({
      where: { userId, createdAt: { gte: today } },
    });
  }
}
