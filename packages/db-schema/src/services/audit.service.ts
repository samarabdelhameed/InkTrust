import { AuditLogRepository } from '../repositories/audit-log.repository';

const repo = new AuditLogRepository();

export class AuditService {
  async log(params: {
    actorId?: string;
    faxRequestId?: string;
    email?: string;
    action: string;
    resource: string;
    resourceId?: string;
    details?: Record<string, unknown>;
    ipAddress?: string;
    userAgent?: string;
  }) {
    return repo.create({
      actorId: params.actorId,
      faxRequestId: params.faxRequestId,
      email: params.email,
      action: params.action,
      resource: params.resource,
      resourceId: params.resourceId,
      details: params.details ?? undefined,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
    });
  }

  async getHistory(faxRequestId: string) {
    return repo.findByFaxRequest(faxRequestId);
  }

  async getRecent(limit = 50) {
    return repo.findRecent(limit);
  }
}

export const auditService = new AuditService();
