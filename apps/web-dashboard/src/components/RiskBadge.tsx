"use client";

import { motion } from "framer-motion";

type RiskLevel = "low" | "medium" | "high";

interface RiskBadgeProps {
  level: RiskLevel;
  score?: number;
}

const config = {
  low: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500", label: "Low Risk" },
  medium: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500", label: "Medium Risk" },
  high: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500", label: "High Risk" },
};

export function RiskBadge({ level, score }: RiskBadgeProps) {
  const c = config[level];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
      {score !== undefined && <span className="opacity-60">· {score}%</span>}
    </span>
  );
}

export function RiskScoreBar({ score }: { score: number }) {
  const color = score < 30 ? "bg-green-500" : score < 60 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-[rgb(25_35_75_/_0.5)]">
        <span>Risk Score</span>
        <span>{score}%</span>
      </div>
      <div className="h-1.5 bg-[rgb(25_35_75_/_0.08)] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
    </div>
  );
}
