import prisma from '../client';
import type { Prisma } from '@prisma/client';

export class UserRepository {
  async findById(id: string) {
    return prisma.user.findUnique({ where: { id }, include: { caregivers: true, roles: true } });
  }

  async findByFaxNumber(faxNumber: string) {
    return prisma.user.findUnique({ where: { faxNumber }, include: { caregivers: true } });
  }

  async findByEmbeddedWallet(wallet: string) {
    return prisma.user.findUnique({ where: { embeddedWallet: wallet } });
  }

  async findAll(includeInactive = false) {
    return prisma.user.findMany({
      where: includeInactive ? undefined : { isActive: true },
      include: { caregivers: true, roles: true },
    });
  }

  async create(data: Prisma.UserCreateInput) {
    return prisma.user.create({ data });
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    return prisma.user.update({ where: { id }, data });
  }

  async updateSpendLimit(id: string, limit: number) {
    return prisma.user.update({ where: { id }, data: { dailySpendLimit: limit } });
  }

  async deactivate(id: string) {
    return prisma.user.update({ where: { id }, data: { isActive: false } });
  }
}
