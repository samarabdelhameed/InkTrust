import { prisma } from '../client';
import { User, MedicalRecord, Transaction, SponsorPayment, Approval, Role, TxStatus, ApprovalStatus } from '@prisma/client';

export class BaseRepository<T> {
  // Generic repository patterns can be added here
}

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async createUser(data: { email: string; role?: Role }): Promise<User> {
    return prisma.user.create({ data });
  }
}

export class MedicalRecordRepository {
  async create(data: { userId: string; encryptedData: string; documentType: string }): Promise<MedicalRecord> {
    return prisma.medicalRecord.create({ data });
  }

  async findByUserId(userId: string): Promise<MedicalRecord[]> {
    return prisma.medicalRecord.findMany({ where: { userId } });
  }
}

export class TransactionRepository {
  async create(data: { userId: string; signature: string; amount: number; status?: TxStatus }): Promise<Transaction> {
    return prisma.transaction.create({ data });
  }

  async updateStatus(id: string, status: TxStatus): Promise<Transaction> {
    return prisma.transaction.update({ where: { id }, data: { status } });
  }
}

export const userRepository = new UserRepository();
export const medicalRecordRepository = new MedicalRecordRepository();
export const transactionRepository = new TransactionRepository();
