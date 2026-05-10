const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export interface DashboardMetrics {
  pendingApprovals: number;
  todayTransactions: number;
  dailySpendUsed: number;
  dailySpendLimit: number;
  activeFaxes: number;
}

export interface TransactionSummary {
  id: string;
  amount: number;
  currency: string;
  status: string;
  type: string;
  createdAt: string;
}

export interface ApprovalItem {
  id: string;
  requestId: string;
  amount: number;
  purpose: string;
  elderlyName: string;
  expiresAt: string;
}

export const api = {
  getDashboardMetrics: () => fetchApi<DashboardMetrics>('/dashboard/metrics'),
  getPendingApprovals: () => fetchApi<ApprovalItem[]>('/approvals/pending'),
  getRecentTransactions: () => fetchApi<TransactionSummary[]>('/transactions/recent'),
  getQueueHealth: () => fetchApi<Record<string, number>>('/queues/health'),
  getBlockchainStatus: () => fetchApi<{ slot: number; tps: number }>('/blockchain/status'),
};
