import prisma from '../client';
import type { Prisma } from '@prisma/client';

export class CaregiverRepository {
  async findById(id: string) {
    return prisma.caregiver.findUnique({ where: { id }, include: { user: true } });
  }

  async findByUser(userId: string) {
    return prisma.caregiver.findMany({ where: { userId }, include: { user: true } });
  }

  async findByWallet(walletAddress: string) {
    return prisma.caregiver.findFirst({ where: { walletAddress }, include: { user: true } });
  }

  async findPrimaryByUser(userId: string) {
    return prisma.caregiver.findFirst({
      where: { userId, role: 'PRIMARY' },
      include: { user: true },
    });
  }

  async create(data: Prisma.CaregiverCreateInput) {
    return prisma.caregiver.create({ data });
  }

  async update(id: string, data: Prisma.CaregiverUpdateInput) {
    return prisma.caregiver.update({ where: { id }, data });
  }

  async remove(id: string) {
    return prisma.caregiver.delete({ where: { id } });
  }
}
