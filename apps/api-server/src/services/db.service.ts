
import { FaxRequest, User } from "../stubs/db-schema";

// This is a mock database service for the hackathon demo.
// In production, this would connect to PostgreSQL/Supabase.

class DbService {
  private faxes: Map<string, FaxRequest> = new Map();
  private users: Map<string, User> = new Map();

  async getFax(id: string): Promise<FaxRequest | null> {
    return this.faxes.get(id) || null;
  }

  async saveFax(fax: FaxRequest): Promise<void> {
    this.faxes.set(fax.id, fax);
  }

  async updateFaxStatus(id: string, status: FaxRequest['status']): Promise<void> {
    const fax = this.faxes.get(id);
    if (fax) {
      fax.status = status;
      this.faxes.set(id, fax);
    }
  }

  async getAllFaxes(): Promise<FaxRequest[]> {
    return Array.from(this.faxes.values());
  }
}

export const dbService = new DbService();
