import { ApprovalWorkflowRepository } from '../repositories/approval-workflow.repository';
import { FaxRequestRepository } from '../repositories/fax-request.repository';

const approvalRepo = new ApprovalWorkflowRepository();
const faxRepo = new FaxRequestRepository();

export class ApprovalService {
  async createApproval(params: {
    faxRequestId: string;
    approverId: string;
    expiresInHours?: number;
  }) {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + (params.expiresInHours ?? 24));

    return approvalRepo.create({
      faxRequest: { connect: { id: params.faxRequestId } },
      user: { connect: { id: params.approverId } },
      expiresAt,
    });
  }

  async approve(approvalId: string, signature: string) {
    const approval = await approvalRepo.approve(approvalId, signature);
    await faxRepo.updateStatus(approval.faxRequestId, 'APPROVED');
    return approval;
  }

  async reject(approvalId: string) {
    const approval = await approvalRepo.reject(approvalId);
    await faxRepo.updateStatus(approval.faxRequestId, 'FAILED');
    return approval;
  }

  async getPendingApprovals() {
    return approvalRepo.findPending();
  }

  async getExpiredApprovals() {
    const expired = await approvalRepo.findExpired();
    for (const e of expired) {
      await approvalRepo.escalate(e.id);
      await faxRepo.updateStatus(e.faxRequestId, 'FAILED');
    }
    return expired;
  }
}

export const approvalService = new ApprovalService();
