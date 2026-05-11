"use client";

import { motion } from "framer-motion";
import { CheckCircle, Clock, Brain, FileText, Send, Shield } from "lucide-react";

const stages = [
  { id: "received", icon: FileText, label: "Fax Received", desc: "Document ingested from Telnyx" },
  { id: "ai", icon: Brain, label: "AI Analysis", desc: "Gemini extracts intent & detects circle" },
  { id: "risk", icon: Shield, label: "Risk Scoring", desc: "Automated risk assessment" },
  { id: "approval", icon: Clock, label: "Family Approval", desc: "Caregiver reviews & signs" },
  { id: "execution", icon: Send, label: "On-Chain Execution", desc: "Solana transaction confirmed" },
  { id: "complete", icon: CheckCircle, label: "Receipt Sent", desc: "Fax confirmation to senior" },
];

interface AIStatusTrackerProps {
  currentStage?: string;
}

export function AIStatusTracker({ currentStage = "received" }: AIStatusTrackerProps) {
  const activeIdx = stages.findIndex(s => s.id === currentStage);

  return (
    <div className="bg-white rounded-xl border border-[rgb(25_35_75_/_0.06)] p-6">
      <h3 className="text-sm font-semibold text-[rgb(25_35_75)] mb-6">Request Pipeline</h3>
      <div className="space-y-0">
        {stages.map((stage, i) => {
          const isActive = i <= activeIdx;
          const isCurrent = i === activeIdx;
          const Icon = stage.icon;

          return (
            <div key={stage.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <motion.div
                  animate={isCurrent ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 2, repeat: isCurrent ? Infinity : 0 }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isActive
                      ? "bg-[rgb(25_35_75)] text-white"
                      : "bg-[rgb(25_35_75_/_0.06)] text-[rgb(25_35_75_/_0.3)]"
                  }`}
                >
                  <Icon size={14} />
                </motion.div>
                {i < stages.length - 1 && (
                  <div className={`w-0.5 h-8 ${isActive ? "bg-[rgb(25_35_75)]" : "bg-[rgb(25_35_75_/_0.08)]"}`} />
                )}
              </div>
              <div className={`pb-6 ${i === stages.length - 1 ? "pb-0" : ""}`}>
                <p className={`text-sm font-medium ${isActive ? "text-[rgb(25_35_75)]" : "text-[rgb(25_35_75_/_0.3)]"}`}>
                  {stage.label}
                </p>
                <p className={`text-xs mt-0.5 ${isActive ? "text-[rgb(25_35_75_/_0.5)]" : "text-[rgb(25_35_75_/_0.2)]"}`}>
                  {stage.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
