import { prisma } from '../client';

export class UserRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { proxyEmail: email } });
  }

  async findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  }

  async createUser(data: { faxNumber: string; embeddedWalletAddress: string; proxyEmail?: string }) {
    return prisma.user.create({ data });
  }
}

export class FaxJobRepository {
  async create(data: { userId: string; externalFaxId: string; mediaUrl?: string }) {
    return prisma.faxJob.create({ data });
  }

  async findPending() {
    return prisma.faxJob.findMany({ where: { status: 'RECEIVED' } });
  }

  async updateStatus(id: string, status: string) {
    return prisma.faxJob.update({ where: { id }, data: { status: status as any } });
  }
}

export class TransactionRepository {
  async create(data: { userId: string; faxJobId?: string; txSignature: string; amount: number }) {
    return prisma.transaction.create({ data });
  }

  async updateStatus(id: string, status: string) {
    return prisma.transaction.update({ where: { id }, data: { status: status as any } });
  }
}

export class ApprovalRepository {
  async create(data: { faxJobId: string; userId: string; expiresAt: Date }) {
    return prisma.approvalRequest.create({ data });
  }

  async findByStatus(status: string) {
    return prisma.approvalRequest.findMany({ where: { status: status as any } });
  }
}

export const userRepository = new UserRepository();
export const faxJobRepository = new FaxJobRepository();
export const transactionRepository = new TransactionRepository();
export const approvalRepository = new ApprovalRepository();
