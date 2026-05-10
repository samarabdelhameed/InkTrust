import { prisma } from '../client';

export class UserRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { proxyEmail: email } });
  }

  async createUser(data: { faxNumber: string; embeddedWalletAddress: string; proxyEmail?: string }) {
    return prisma.user.create({ data });
  }
}

export class MedicalRecordRepository {
  async create(data: { userId: string; encryptedData: string; recordType: string }) {
    return prisma.medicalRecord.create({ data: { ...data, hash: '', encryptionIv: '' } });
  }

  async findByUserId(userId: string) {
    return prisma.medicalRecord.findMany({ where: { userId } });
  }
}

export class TransactionRepository {
  async create(data: { userId: string; amount: number; type: string; currency?: string }) {
    return prisma.transactionRecord.create({ data: { ...data, type: data.type as any, currency: data.currency ?? 'JPY' } });
  }

  async updateStatus(id: string, status: string) {
    return prisma.transactionRecord.update({ where: { id }, data: { status: status as any } });
  }
}

export class AuditLogRepository {
  async create(data: { action: string; resource: string; details?: any; actorId?: string }) {
    return prisma.auditLog.create({ data });
  }
}

export class QueueJobRepository {
  async create(data: { queueName: string; jobType: string; payload?: any }) {
    return prisma.queueJob.create({ data });
  }
}

export const userRepository = new UserRepository();
export const medicalRecordRepository = new MedicalRecordRepository();
export const transactionRepository = new TransactionRepository();
export const auditLogRepository = new AuditLogRepository();
export const queueJobRepository = new QueueJobRepository();
