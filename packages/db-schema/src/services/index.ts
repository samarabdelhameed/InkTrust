import { prisma } from '../client';
import { userRepository, transactionRepository, medicalRecordRepository, auditLogRepository, queueJobRepository } from '../repositories';

export class DatabaseService {
  readonly users = userRepository;
  readonly transactions = transactionRepository;
  readonly medicalRecords = medicalRecordRepository;
  readonly audits = auditLogRepository;
  readonly queues = queueJobRepository;

  async logAIInteraction(data: { prompt: string; response?: string; modelUsed: string; executionTimeMs?: number }) {
    return prisma.aILog.create({ data });
  }

  async createAuditLog(data: { action: string; entityType: string; entityId: string; actorId?: string; details?: any }) {
    return prisma.auditLog.create({ data: { action: data.action, resource: data.entityType, resourceId: data.entityId, actorId: data.actorId, details: data.details } });
  }

  async trackQueueJob(data: { queueName: string; jobType: string; payload?: any }) {
    return queueJobRepository.create(data);
  }

  async updateQueueJob(jobId: string, status: string, error?: string) {
    return prisma.queueJob.update({
      where: { id: jobId },
      data: { status: status as any, error },
    });
  }
}

export const dbService = new DatabaseService();
