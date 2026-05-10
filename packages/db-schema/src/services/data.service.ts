import { prisma } from '../client';
import { 
  User, 
  Job, 
  FinancialTransaction, 
  UserStatus, 
  JobStatus, 
  TxStatus, 
  ApprovalStatus 
} from '@prisma/client';

export class DataService {
  // ============================================================
  // USER OPERATIONS
  // ============================================================
  async createUser(data: {
    faxNumber: string;
    embeddedWalletAddress: string;
    proxyEmail?: string;
  }) {
    return prisma.user.create({ data });
  }

  async getUserByWallet(address: string) {
    return prisma.user.findUnique({ where: { embeddedWalletAddress: address } });
  }

  // ============================================================
  // AI JOB ORCHESTRATION
  // ============================================================
  async createAIJob(data: {
    userId: string;
    intentType: string;
    intentHash: string;
    priority?: number;
  }) {
    return prisma.job.create({
      data: {
        ...data,
        status: 'PENDING',
      }
    });
  }

  async updateJobStatus(jobId: string, status: JobStatus, aiSummary?: string, entities?: any) {
    return prisma.job.update({
      where: { id: jobId },
      data: { 
        status, 
        aiSummary, 
        extractedEntities: entities,
        completedAt: status === 'COMPLETED' ? new Date() : null
      }
    });
  }

  // ============================================================
  // HYBRID TRANSACTION TRACKING
  // ============================================================
  async recordTransaction(data: {
    userId: string;
    jobId?: string;
    amount: number;
    currency?: string;
    paymentProvider: string;
    txSignature?: string;
  }) {
    return prisma.financialTransaction.create({
      data: {
        userId: data.userId,
        jobId: data.jobId,
        amount: data.amount,
        currency: data.currency || 'SOL',
        paymentProvider: data.paymentProvider,
        txSignature: data.txSignature,
        status: data.txSignature ? 'CONFIRMED' : 'PENDING'
      }
    });
  }

  // ============================================================
  // AUDIT & LOGGING
  // ============================================================
  async logAuditEvent(data: {
    action: string;
    entityType: string;
    entityId: string;
    actorId?: string;
    details?: any;
  }) {
    return prisma.auditLog.create({ data });
  }

  // ============================================================
  // FILE ARTIFACT TRACKING
  // ============================================================
  async trackFileArtifact(data: {
    userId: string;
    jobId?: string;
    s3Key: string;
    artifactType: string;
    mimeType: string;
  }) {
    return prisma.fileArtifact.create({ data });
  }
}

export const dataService = new DataService();
