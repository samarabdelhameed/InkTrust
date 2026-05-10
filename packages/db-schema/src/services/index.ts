import { prisma } from '../client';
import { userRepository, transactionRepository, medicalRecordRepository } from '../repositories';
import { Role, TxStatus, ApprovalStatus } from '@prisma/client';

export class DatabaseService {
  readonly users = userRepository;
  readonly transactions = transactionRepository;
  readonly medicalRecords = medicalRecordRepository;

  async logAIInteraction(data: { prompt: string; response?: string; modelUsed: string; executionTimeMs?: number }) {
    return prisma.aILog.create({
      data
    });
  }

  async createAuditLog(data: { action: string; entityType: string; entityId: string; actorId?: string; details?: any }) {
    return prisma.auditLog.create({
      data
    });
  }

  async trackQueueJob(data: { queueName: string; jobId: string; status: string; data: any }) {
    return prisma.queueJob.create({
      data
    });
  }

  async updateQueueJob(jobId: string, status: string, error?: string) {
    return prisma.queueJob.update({
      where: { jobId },
      data: { status, error, updatedAt: new Date() }
    });
  }
}

export const dbService = new DatabaseService();
