"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface FaxJob {
  id: string;
  userId: string;
  status: string;
  intent: string;
  amount: number;
  merchant: string;
  urgency: string;
  createdAt: string;
}

export function usePendingFaxes() {
  return useQuery<FaxJob[]>({
    queryKey: ["faxes", "pending"],
    queryFn: async () => {
      const res = await fetch("/api/v1/admin/jobs/pending");
      if (!res.ok) throw new Error("Failed to fetch pending faxes");
      return res.json();
    },
    refetchInterval: 10000,
  });
}

export function useApproveFax() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ faxId, walletAddress }: { faxId: string; walletAddress: string }) => {
      const res = await fetch(`/api/v1/actions/approve/${faxId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ account: walletAddress }),
      });
      if (!res.ok) throw new Error("Approval failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faxes"] });
    },
  });
}

export function useSpendingSummary() {
  return useQuery({
    queryKey: ["spending"],
    queryFn: async () => {
      const res = await fetch("/api/v1/admin/spending");
      if (!res.ok) throw new Error("Failed to fetch spending");
      return res.json();
    },
    refetchInterval: 30000,
  });
}
