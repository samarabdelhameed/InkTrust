"use client";

import { motion } from "framer-motion";
import { FileText, Brain, CheckCircle, Clock, XCircle } from "lucide-react";
import { RiskBadge } from "./RiskBadge";

interface FaxCardProps {
  id: string;
  merchant: string;
  amount: number;
  intent: string;
  urgency: "low" | "normal" | "high";
  status: "processing" | "approved" | "rejected" | "pending";
  timestamp: string;
  onApprove?: () => void;
  onReject?: () => void;
}

const statusIcons = {
  processing: { icon: Clock, color: "text-blue-600", bg: "bg-blue-50" },
  approved: { icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
  rejected: { icon: XCircle, color: "text-red-600", bg: "bg-red-50" },
  pending: { icon: FileText, color: "text-amber-600", bg: "bg-amber-50" },
};

const urgencyLevel = (u: string) => {
  if (u === "high") return "high";
  if (u === "normal") return "medium";
  return "low";
};

export function FaxCard({ merchant, amount, intent, urgency, status, timestamp, onApprove, onReject }: FaxCardProps) {
  const Icon = statusIcons[status].icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group bg-white rounded-xl border border-[rgb(25_35_75_/_0.06)] p-4 card-hover"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${statusIcons[status].bg} flex items-center justify-center`}>
            <Icon size={20} className={statusIcons[status].color} />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-[rgb(25_35_75)]">{merchant}</h3>
            <p className="text-xs text-[rgb(25_35_75_/_0.5)]">{timestamp}</p>
          </div>
        </div>
        <RiskBadge level={urgencyLevel(urgency)} />
      </div>

      <div className="mb-3">
        <p className="text-sm text-[rgb(25_35_75_/_0.7)] leading-relaxed">{intent}</p>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-lg font-bold text-[rgb(25_35_75)]">
          ¥{amount.toLocaleString()}
        </span>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {onReject && (
            <button onClick={onReject} className="btn-ghost text-sm !py-1.5 !px-3 text-red-600 hover:bg-red-50">
              Reject
            </button>
          )}
          {onApprove && (
            <button onClick={onApprove} className="btn-primary text-sm !py-1.5 !px-4">
              Approve
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
