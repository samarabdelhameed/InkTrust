class DatabaseService {
  async logMCPExecution(_data: { faxJobId: string; toolName: string; input: any; output?: any; status: string; durationMs: number }) {
    return null;
  }
  async createAuditReview(_data: { faxJobId: string; riskScore: number; moderatorAction?: string; moderatorNotes?: string }) {
    return null;
  }
  async createVerification(_data: { userId: string; nullifierHash: string; merkleRoot: string; proof: string }) {
    return null;
  }
}

export const dbService = new DatabaseService();
export default dbService;
