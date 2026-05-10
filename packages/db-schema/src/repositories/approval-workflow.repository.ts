import prisma from '../client';
import type { Prisma, ApprovalStatus } from '@prisma/client';

export class ApprovalWorkflowRepository {
  async findById(id: string) {
    return prisma.approvalWorkflow.findUnique({ where: { id }, include: { user: true, faxRequest: true } });
  }

  async findByFaxRequest(faxRequestId: string) {
    return prisma.approvalWorkflow.findMany({
      where: { faxRequestId },
      include: { user: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findByApprover(approverId: string) {
    return prisma.approvalWorkflow.findMany({
      where: { approverId },
      include: { faxRequest: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findPending() {
    return prisma.approvalWorkflow.findMany({
      where: { status: 'PENDING', expiresAt: { gt: new Date() } },
      include: { user: true, faxRequest: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findExpired() {
    return prisma.approvalWorkflow.findMany({
      where: { status: 'PENDING', expiresAt: { lte: new Date() } },
      include: { faxRequest: true },
    });
  }

  async create(data: Prisma.ApprovalWorkflowCreateInput) {
    return prisma.approvalWorkflow.create({ data });
  }

  async approve(id: string, signature: string) {
    return prisma.approvalWorkflow.update({
      where: { id },
      data: { status: 'APPROVED', signature, signedAt: new Date() },
    });
  }

  async reject(id: string) {
    return prisma.approvalWorkflow.update({
      where: { id },
      data: { status: 'REJECTED', signedAt: new Date() },
    });
  }

  async escalate(id: string) {
    return prisma.approvalWorkflow.update({
      where: { id },
      data: { status: 'ESCALATED' },
    });
  }

  async markReminderSent(id: string) {
    return prisma.approvalWorkflow.update({
      where: { id },
      data: { reminderSent: true },
    });
  }
}
