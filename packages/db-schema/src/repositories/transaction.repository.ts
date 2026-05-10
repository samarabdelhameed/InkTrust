import prisma from '../client';
import type { Prisma, TransactionStatus, TransactionType } from '@prisma/client';

export class TransactionRepository {
  async findById(id: string) {
    return prisma.transactionRecord.findUnique({ where: { id } });
  }

  async findByUser(userId: string) {
    return prisma.transactionRecord.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByFaxRequest(faxRequestId: string) {
    return prisma.transactionRecord.findMany({
      where: { faxRequestId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findByStatus(status: TransactionStatus) {
    return prisma.transactionRecord.findMany({
      where: { status },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: Prisma.TransactionRecordCreateInput) {
    return prisma.transactionRecord.create({ data });
  }

  async confirm(id: string, txSignature: string) {
    return prisma.transactionRecord.update({
      where: { id },
      data: { status: 'CONFIRMED', txSignature, confirmedAt: new Date() },
    });
  }

  async fail(id: string, error?: string) {
    return prisma.transactionRecord.update({
      where: { id },
      data: { status: 'FAILED', metadata: error ? { error } : undefined },
    });
  }

  async getDailyTotal(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const result = await prisma.transactionRecord.aggregate({
      _sum: { amount: true },
      where: {
        userId,
        createdAt: { gte: today },
        status: 'CONFIRMED',
      },
    });
    return result._sum.amount ?? 0;
  }
}
