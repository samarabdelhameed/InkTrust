"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWorldId } from "../hooks/useWorldId";
import { usePendingFaxes, useApproveFax, useSpendingSummary } from "../hooks/useFaxes";
import { useMemo } from "react";

function PipelineStatus() {
  const stages = [
    { name: "Fax Received", icon: "📠", active: true },
    { name: "AI Analysis", icon: "🧠", active: true },
    { name: "Approval", icon: "⏳", active: true },
    { name: "Blockchain", icon: "⛓️", active: false },
    { name: "Receipt Sent", icon: "📨", active: false },
  ];

  return (
    <div className="col-span-full bg-gray-900 rounded-xl border border-gray-800 p-6">
      <h2 className="text-lg font-semibold mb-4">📠 Live Fax Pipeline</h2>
      <div className="flex items-center gap-4 overflow-x-auto py-4">
        {stages.map((stage, i) => (
          <div key={stage.name} className="flex items-center gap-2">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              stage.active ? "bg-blue-900/50 border border-blue-700" : "bg-gray-800 border border-gray-700"
            }`}>
              <span>{stage.icon}</span>
              <span className="text-sm whitespace-nowrap">{stage.name}</span>
            </div>
            {i < stages.length - 1 && (
              <div className="w-8 h-0.5 bg-gray-700" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function PendingApprovals() {
  const { publicKey } = useWallet();
  const { data: faxes, isLoading } = usePendingFaxes();
  const approveMutation = useApproveFax();
  const { IDKitWidget } = useWorldId();

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
      <h2 className="text-lg font-semibold mb-4">⏳ Pending Approvals</h2>
      {isLoading ? (
        <p className="text-gray-400">Loading...</p>
      ) : faxes && faxes.length > 0 ? (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {faxes.map((fax) => (
            <div key={fax.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-medium">{fax.merchant || "Unknown"}</span>
                <span className={`text-xs px-2 py-0.5 rounded ${
                  fax.urgency === "HIGH" ? "bg-red-900 text-red-200" :
                  fax.urgency === "NORMAL" ? "bg-yellow-900 text-yellow-200" :
                  "bg-green-900 text-green-200"
                }`}>
                  {fax.urgency}
                </span>
              </div>
              <p className="text-gray-400 text-sm mb-1">{fax.intent}</p>
              <div className="flex justify-between items-center">
                <span className="text-blue-400 font-medium">¥{fax.amount?.toLocaleString() || "—"}</span>
                <IDKitWidget>
                  <button
                    disabled={!publicKey || approveMutation.isPending}
                    onClick={() => {
                      if (publicKey) {
                        approveMutation.mutate({ faxId: fax.id, walletAddress: publicKey.toString() });
                      }
                    }}
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors"
                  >
                    {approveMutation.isPending ? "Approving..." : "Approve"}
                  </button>
                </IDKitWidget>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No pending requests.</p>
      )}
    </div>
  );
}

function SpendingOverview() {
  const { data: spending } = useSpendingSummary();

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
      <h2 className="text-lg font-semibold mb-4">💰 Spending Overview</h2>
      {spending ? (
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">Daily</span>
              <span>¥{spending.dailySpend?.toLocaleString() || "0"} / ¥{spending.dailyLimit?.toLocaleString() || "3,000"}</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div className="bg-blue-500 rounded-full h-2 transition-all" style={{
                width: `${Math.min((spending.dailySpend || 0) / (spending.dailyLimit || 3000) * 100, 100)}%`
              }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">Monthly</span>
              <span>¥{spending.monthlySpend?.toLocaleString() || "0"} / ¥{spending.monthlyLimit?.toLocaleString() || "50,000"}</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div className="bg-green-500 rounded-full h-2 transition-all" style={{
                width: `${Math.min((spending.monthlySpend || 0) / (spending.monthlyLimit || 50000) * 100, 100)}%`
              }} />
            </div>
          </div>
        </div>
      ) : (
        <>
          <p className="text-gray-400">Daily limit: ¥3,000</p>
          <p className="text-gray-400">Spent today: ¥0</p>
        </>
      )}
    </div>
  );
}

function TrustSettings() {
  const { IDKitWidget } = useWorldId();

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
      <h2 className="text-lg font-semibold mb-4">🛡️ Trust Settings</h2>
      <div className="space-y-4">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <h3 className="text-sm font-medium mb-2">World ID Verification</h3>
          <p className="text-gray-400 text-xs mb-3">Verify your identity to approve transactions on behalf of your family member.</p>
          <IDKitWidget>
            <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors">
              Verify with World ID
            </button>
          </IDKitWidget>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <h3 className="text-sm font-medium mb-2">Spending Limits</h3>
          <p className="text-gray-400 text-xs">Configure daily and monthly spending caps for agent transactions.</p>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { publicKey } = useWallet();

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold">
            🖋️ <span className="text-blue-400">Ink</span>Trust
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">Caregiver Dashboard</span>
            <WalletMultiButton className="!bg-blue-600 !hover:bg-blue-700 !rounded-lg !text-sm" />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <PipelineStatus />

        <PendingApprovals />

        <SpendingOverview />

        <TrustSettings />

        {!publicKey && (
          <div className="col-span-full bg-yellow-900/30 border border-yellow-700 rounded-xl p-6 text-center">
            <p className="text-yellow-300 font-medium">
              Connect your wallet to approve fax requests and manage spending.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
