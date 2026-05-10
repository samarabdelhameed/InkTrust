import prisma from '../client';
import type { Prisma, SponsorPaymentStatus } from '@prisma/client';

export class SponsorPaymentRepository {
  async findById(id: string) {
    return prisma.sponsorPayment.findUnique({ where: { id } });
  }

  async findBySponsor(sponsorId: string) {
    return prisma.sponsorPayment.findMany({
      where: { sponsorId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByBeneficiary(beneficiaryId: string) {
    return prisma.sponsorPayment.findMany({
      where: { beneficiaryId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findActive() {
    return prisma.sponsorPayment.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { startDate: 'asc' },
    });
  }

  async create(data: Prisma.SponsorPaymentCreateInput) {
    return prisma.sponsorPayment.create({ data });
  }

  async updateStatus(id: string, status: SponsorPaymentStatus) {
    return prisma.sponsorPayment.update({ where: { id }, data: { status } });
  }

  async markProcessed(id: string) {
    return prisma.sponsorPayment.update({
      where: { id },
      data: { lastProcessedAt: new Date() },
    });
  }
}
