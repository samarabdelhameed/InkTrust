"use client";

import { motion } from "framer-motion";
import { Shield, AlertTriangle, CheckCircle, XCircle, User, Wallet } from "lucide-react";
import { RiskBadge } from "./RiskBadge";

interface ApprovalCardProps {
  id: string;
  seniorName: string;
  merchant: string;
  amount: number;
  intent: string;
  riskScore: number;
  timestamp: string;
  onApprove: () => void;
  onReject: () => void;
}

export function ApprovalCard({
  seniorName,
  merchant,
  amount,
  intent,
  riskScore,
  timestamp,
  onApprove,
  onReject,
}: ApprovalCardProps) {
  const riskLevel = riskScore < 30 ? "low" : riskScore < 60 ? "medium" : "high";

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-xl border border-[rgb(25_35_75_/_0.06)] p-5 card-hover"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-[rgb(25_35_75)] flex items-center justify-center text-white font-bold shrink-0">
          {seniorName.charAt(0)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-sm text-[rgb(25_35_75)]">{seniorName}</h3>
            <RiskBadge level={riskLevel} score={riskScore} />
          </div>

          <p className="text-xs text-[rgb(25_35_75_/_0.5)] mb-3">{timestamp}</p>

          <div className="bg-[rgb(25_35_75_/_0.03)] rounded-lg p-3 mb-3">
            <p className="text-sm text-[rgb(25_35_75_/_0.7)] leading-relaxed">
              {intent}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs font-medium text-[rgb(25_35_75_/_0.5)]">{merchant}</span>
              <span className="text-[rgb(25_35_75_/_0.2)]">·</span>
              <span className="text-sm font-bold text-[rgb(25_35_75)]">¥{amount.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onReject}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 text-red-600 font-medium text-sm hover:bg-red-50 transition-all"
            >
              <XCircle size={16} />
              Reject
            </button>
            <button
              onClick={onApprove}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-green-600 to-green-500 text-white font-medium text-sm hover:shadow-lg hover:shadow-green-500/25 transition-all"
            >
              <CheckCircle size={16} />
              Approve
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
