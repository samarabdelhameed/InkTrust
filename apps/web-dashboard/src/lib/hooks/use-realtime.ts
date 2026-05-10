'use client';

import { useState, useEffect, useCallback } from 'react';
import { api, type DashboardMetrics, type ApprovalItem, type TransactionSummary } from '../api';

export function useDashboardMetrics() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const data = await api.getDashboardMetrics();
      setMetrics(data);
    } catch { } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); const iv = setInterval(refresh, 15000); return () => clearInterval(iv); }, [refresh]);

  return { metrics, loading, refresh };
}

export function usePendingApprovals() {
  const [approvals, setApprovals] = useState<ApprovalItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const data = await api.getPendingApprovals();
      setApprovals(data);
    } catch { } finally { setLoading(false); }
  }, []);

  useEffect(() => { refresh(); const iv = setInterval(refresh, 10000); return () => clearInterval(iv); }, [refresh]);

  return { approvals, loading, refresh };
}

export function useRecentTransactions() {
  const [transactions, setTransactions] = useState<TransactionSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getRecentTransactions().then(setTransactions).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return { transactions, loading };
}

export function useQueueHealth() {
  const [queues, setQueues] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    api.getQueueHealth().then(setQueues).catch(() => {});
    const iv = setInterval(() => api.getQueueHealth().then(setQueues).catch(() => {}), 30000);
    return () => clearInterval(iv);
  }, []);

  return queues;
}
