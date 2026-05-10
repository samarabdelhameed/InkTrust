import { TransactionRepository } from '../repositories/transaction.repository';
import { UserRepository } from '../repositories/user.repository';

const txRepo = new TransactionRepository();
const userRepo = new UserRepository();

export class DailySpendService {
  async getDailyTotal(userId: string) {
    return txRepo.getDailyTotal(userId);
  }

  async getRemainingLimit(userId: string) {
    const user = await userRepo.findById(userId);
    if (!user) throw new Error('User not found');
    const dailyTotal = await this.getDailyTotal(userId);
    return Math.max(0, user.dailySpendLimit - dailyTotal);
  }

  async checkLimit(userId: string, amount: number) {
    const remaining = await this.getRemainingLimit(userId);
    return { allowed: amount <= remaining, remaining, needed: amount };
  }
}

export const dailySpendService = new DailySpendService();
