"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API_BASE = "/api/v1";

async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`API error ${res.status}: ${err}`);
  }
  return res.json();
}

// ─── Types ───────────────────────────────────────────

export interface FaxJob {
  id: string;
  userId: string;
  status: string;
  intent: string;
  amount: number;
  merchant: string;
  urgency: string;
  createdAt: string;
}

export interface ApprovalRequest {
  id: string;
  seniorName: string;
  merchant: string;
  amount: number;
  intent: string;
  riskScore: number;
  timestamp: string;
  status: "pending" | "approved" | "rejected";
}

export interface SpendingSummary {
  dailySpend: number;
  dailyLimit: number;
  monthlySpend: number;
  monthlyLimit: number;
}

export interface DashboardMetrics {
  totalRequests: number;
  pendingApprovals: number;
  approvedToday: number;
  totalSpent: number;
  aiSuccessRate: number;
  avgProcessingTime: number;
}

export interface SystemHealth {
  apiServer: { status: string; latency: string };
  solanaRpc: { status: string; latency: string };
  aiService: { status: string; latency: string };
  queueSystem: { status: string; latency: string };
  agents: { name: string; status: string; uptime: string; tasks: number }[];
}

// ─── Hooks ───────────────────────────────────────────

export function usePendingFaxes() {
  return useQuery<FaxJob[]>({
    queryKey: ["faxes", "pending"],
    queryFn: () => fetchApi<FaxJob[]>("/admin/jobs/pending"),
    refetchInterval: 10000,
  });
}

export function useApproveFax() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ faxId, walletAddress }: { faxId: string; walletAddress: string }) => {
      return fetchApi(`/actions/approve/${faxId}`, {
        method: "POST",
        body: JSON.stringify({ account: walletAddress }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faxes"] });
      queryClient.invalidateQueries({ queryKey: ["spending"] });
    },
  });
}

export function useRejectFax() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (faxId: string) => {
      return fetchApi(`/actions/reject/${faxId}`, { method: "POST" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faxes"] });
    },
  });
}

export function useSpendingSummary() {
  return useQuery<SpendingSummary>({
    queryKey: ["spending"],
    queryFn: () => fetchApi<SpendingSummary>("/admin/spending"),
    refetchInterval: 30000,
  });
}

export function useDashboardMetrics() {
  return useQuery<DashboardMetrics>({
    queryKey: ["dashboard", "metrics"],
    queryFn: () => fetchApi<DashboardMetrics>("/dashboard/metrics"),
    refetchInterval: 15000,
  });
}

export function usePendingApprovals() {
  return useQuery<ApprovalRequest[]>({
    queryKey: ["approvals", "pending"],
    queryFn: () => fetchApi<ApprovalRequest[]>("/approvals/pending"),
    refetchInterval: 10000,
  });
}

export function useRecentTransactions() {
  return useQuery({
    queryKey: ["transactions", "recent"],
    queryFn: () => fetchApi("/transactions/recent"),
    refetchInterval: 15000,
  });
}

export function useSystemHealth() {
  return useQuery<SystemHealth>({
    queryKey: ["system", "health"],
    queryFn: () => fetchApi<SystemHealth>("/system/health"),
    refetchInterval: 30000,
  });
}

export function useAnalyzeFax() {
  return useMutation({
    mutationFn: async (faxData: { imageBase64: string }) => {
      return fetchApi("/ai/analyze", {
        method: "POST",
        body: JSON.stringify(faxData),
      });
    },
  });
}

export function useVerifyWorldId() {
  return useMutation({
    mutationFn: async (proof: unknown) => {
      return fetchApi("/auth/verify-world-id", {
        method: "POST",
        body: JSON.stringify(proof),
      });
    },
  });
}

export function useCreateSwigWallet() {
  return useMutation({
    mutationFn: async (params: { policyId: string }) => {
      return fetchApi("/sponsors/swig/wallet", {
        method: "POST",
        body: JSON.stringify(params),
      });
    },
  });
}

export function useGetMoonPayQuote() {
  return useMutation({
    mutationFn: async (params: { currencyCode: string; baseCurrencyAmount: string }) => {
      return fetchApi("/sponsors/moonpay/quote", {
        method: "POST",
        body: JSON.stringify(params),
      });
    },
  });
}
