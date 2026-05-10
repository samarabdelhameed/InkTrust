import prisma from '../client';
import type { Prisma, JobStatus } from '@prisma/client';

export class QueueJobRepository {
  async findById(id: string) {
    return prisma.queueJob.findUnique({ where: { id } });
  }

  async findByQueue(queueName: string, status?: JobStatus) {
    return prisma.queueJob.findMany({
      where: { queueName, ...(status ? { status } : {}) },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findPending(limit = 10) {
    return prisma.queueJob.findMany({
      where: { status: 'PENDING', scheduledAt: { lte: new Date() } },
      orderBy: [{ priority: 'desc' }, { createdAt: 'asc' }],
      take: limit,
    });
  }

  async create(data: Prisma.QueueJobCreateInput) {
    return prisma.queueJob.create({ data });
  }

  async updateStatus(id: string, status: JobStatus, error?: string) {
    const data: Prisma.QueueJobUpdateInput = { status };
    if (status === 'ACTIVE') data.startedAt = new Date();
    if (status === 'COMPLETED') data.completedAt = new Date();
    if (error) data.error = error;
    return prisma.queueJob.update({ where: { id }, data });
  }

  async incrementRetry(id: string) {
    return prisma.queueJob.update({
      where: { id },
      data: { retryCount: { increment: 1 } },
    });
  }
}
