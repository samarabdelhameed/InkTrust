import { prisma } from '../client';
import { userRepository, faxJobRepository, transactionRepository, approvalRepository } from '../repositories';

export class DatabaseService {
  readonly users = userRepository;
  readonly faxJobs = faxJobRepository;
  readonly transactions = transactionRepository;
  readonly approvals = approvalRepository;

  async logMCPExecution(data: { faxJobId: string; toolName: string; input: any; output?: any; status: string; durationMs: number }) {
    return prisma.mCPExecutionLog.create({ data });
  }

  async createAuditReview(data: { faxJobId: string; riskScore: number; moderatorAction?: string; moderatorNotes?: string }) {
    return prisma.auditReview.create({ data });
  }

  async createVerification(data: { userId: string; nullifierHash: string; merkleRoot: string; proof: string }) {
    return prisma.worldIdVerification.create({ data });
  }
}

export const dbService = new DatabaseService();
