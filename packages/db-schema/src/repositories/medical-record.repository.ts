import prisma from '../client';
import type { Prisma } from '@prisma/client';

export class MedicalRecordRepository {
  async findById(id: string) {
    return prisma.medicalRecord.findUnique({ where: { id } });
  }

  async findByUser(userId: string) {
    return prisma.medicalRecord.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByType(userId: string, recordType: string) {
    return prisma.medicalRecord.findMany({
      where: { userId, recordType },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: Prisma.MedicalRecordCreateInput) {
    return prisma.medicalRecord.create({ data });
  }

  async update(id: string, data: Prisma.MedicalRecordUpdateInput) {
    return prisma.medicalRecord.update({ where: { id }, data });
  }

  async deleteExpired() {
    return prisma.medicalRecord.deleteMany({
      where: { expiresAt: { lte: new Date() } },
    });
  }
}
