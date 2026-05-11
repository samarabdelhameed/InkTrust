"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Brain,
  Users,
  Link2,
  CheckCircle,
  Play,
  RotateCcw,
  Terminal,
  ChevronRight,
  FileJson,
  Sparkles,
  Clock,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { AgentLogTerminal } from "../../components/AgentLogTerminal";

const STAGES = [
  { id: "fax-received", icon: FileText, label: "Fax Received", emoji: "📠" },
  { id: "ai-analysis", icon: Brain, label: "AI Analysis", emoji: "🧠" },
  { id: "family-approval", icon: Users, label: "Family Approval", emoji: "👨‍👩‍👧" },
  { id: "onchain-execution", icon: Link2, label: "On-Chain Execution", emoji: "⛓️" },
  { id: "receipt-sent", icon: CheckCircle, label: "Receipt Sent", emoji: "✅" },
];

const FAX_PREVIEWS = [
  {
    text: "Please pay pharmacy bill of ¥4,200 for my monthly medication. Thank you, Yuki.",
    merchant: "Pharmacy",
    amount: "¥4,200",
    amountNum: 4200,
  },
  {
    text: "Send ¥12,000 for electricity bill to Tokyo Power Co. due May 15th.",
    merchant: "Tokyo Power Co.",
    amount: "¥12,000",
    amountNum: 12000,
  },
  {
    text: "Please transfer ¥8,500 to grocery delivery service for this week's order.",
    merchant: "Grocery Express",
    amount: "¥8,500",
    amountNum: 8500,
  },
];

const PARSED_INTENTS = [
  {
    merchant: "Pharmacy",
    amount: 4200,
    currency: "JPY",
    urgency: "normal",
    category: "healthcare",
    riskScore: 15,
    confidence: 94.2,
  },
  {
    merchant: "Tokyo Power Co.",
    amount: 12000,
    currency: "JPY",
    urgency: "high",
    category: "utilities",
    riskScore: 8,
    confidence: 96.8,
  },
  {
    merchant: "Grocery Express",
    amount: 8500,
    currency: "JPY",
    urgency: "normal",
    category: "groceries",
    riskScore: 22,
    confidence: 91.5,
  },
];

const TRANSACTION_SUMMARIES = [
  {
    signature: "5KtN3a7bQp...9xY2m",
    slot: 284_561_223,
    fee: "0.000005 SOL",
    blockTime: "2026-05-11 10:32:45 UTC",
  },
  {
    signature: "3JhR8c2dLp...7wX4n",
    slot: 284_561_891,
    fee: "0.000005 SOL",
    blockTime: "2026-05-11 10:32:48 UTC",
  },
  {
    signature: "8MnB2v5kQr...3tY9p",
    slot: 284_562_134,
    fee: "0.000005 SOL",
    blockTime: "2026-05-11 10:32:51 UTC",
  },
];

function FloatingParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            background: `rgb(25 35 75 / ${0.03 + Math.random() * 0.04})`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function StageConnector({ active }: { active: boolean }) {
  return (
    <div className="flex-1 h-0.5 mx-1 relative">
      <div className="absolute inset-0 rounded-full bg-[rgb(25_35_75_/_0.08)]" />
      <motion.div
        className="absolute inset-0 rounded-full bg-[rgb(25_35_75)]"
        animate={active ? { scaleX: 1 } : { scaleX: 0 }}
        initial={{ scaleX: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{ transformOrigin: "left" }}
      />
    </div>
  );
}

function WorkflowStages({ currentStage }: { currentStage: number }) {
  return (
    <div className="flex items-center justify-between w-full">
      {STAGES.map((stage, i) => {
        const isActive = i <= currentStage;
        const isCurrent = i === currentStage;
        const Icon = stage.icon;
        return (
          <div key={stage.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-2">
              <motion.div
                animate={
                  isCurrent
                    ? {
                        scale: [1, 1.15, 1],
                        boxShadow: [
                          "0 0 0 0 rgba(25,35,75,0.2)",
                          "0 0 0 12px rgba(25,35,75,0)",
                          "0 0 0 0 rgba(25,35,75,0)",
                        ],
                      }
                    : {}
                }
                transition={{ duration: 2, repeat: isCurrent ? Infinity : 0, ease: "easeInOut" }}
                className={`relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 ${
                  isActive
                    ? "bg-[rgb(25_35_75)] text-white shadow-lg shadow-[rgb(25_35_75_/_0.25)]"
                    : "bg-white text-[rgb(25_35_75_/_0.25)] border border-[rgb(25_35_75_/_0.08)]"
                }`}
              >
                <Icon size={18} />
              </motion.div>
              <span
                className={`text-[10px] font-medium text-center leading-tight max-w-[72px] transition-all duration-500 ${
                  isActive ? "text-[rgb(25_35_75)]" : "text-[rgb(25_35_75_/_0.3)]"
                }`}
              >
                {stage.label}
              </span>
            </div>
            {i < STAGES.length - 1 && <StageConnector active={i < currentStage} />}
          </div>
        );
      })}
    </div>
  );
}

function FaxPreviewCard({ text, merchant, amount, visible }: { text: string; merchant: string; amount: string; visible: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, scaleY: 0 }}
      animate={visible ? { opacity: 1, scaleY: 1 } : {}}
      transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
      style={{ transformOrigin: "top" }}
      className="bg-white rounded-xl border border-[rgb(25_35_75_/_0.06)] overflow-hidden"
    >
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[rgb(25_35_75_/_0.04)] bg-[rgb(25_35_75_/_0.02)]">
        <FileText size={14} className="text-[rgb(25_35_75_/_0.4)]" />
        <span className="text-xs font-medium text-[rgb(25_35_75_/_0.5)]">Incoming Fax</span>
        <span className="ml-auto text-[10px] text-[rgb(25_35_75_/_0.3)]">#fax-20240511-003</span>
      </div>
      <div
        className="p-5 font-mono text-sm leading-relaxed"
        style={{
          backgroundImage: "linear-gradient(rgba(25,35,75,0.04) 1px, transparent 1px)",
          backgroundSize: "100% 28px",
          backgroundColor: "#fffeff",
          color: "rgb(25 35 75)",
        }}
      >
        <div className="flex items-center gap-1.5 mb-3 text-[10px] text-[rgb(25_35_75_/_0.3)]">
          <Clock size={10} />
          <span>Received: 10:32 AM</span>
        </div>
        <p className="text-[13px] leading-7">{text}</p>
      </div>
      <div className="flex items-center justify-between px-4 py-2.5 border-t border-[rgb(25_35_75_/_0.04)]">
        <span className="text-xs text-[rgb(25_35_75_/_0.5)]">{merchant}</span>
        <span className="text-sm font-bold text-[rgb(25_35_75)]">{amount}</span>
      </div>
    </motion.div>
  );
}

function JsonDataCard({ data, visible }: { data: Record<string, unknown>; visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <div className="bg-white rounded-xl border border-[rgb(25_35_75_/_0.06)] overflow-hidden mt-3">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-[rgb(25_35_75_/_0.04)] bg-[rgb(25_35_75_/_0.02)]">
              <FileJson size={14} className="text-[rgb(25_35_75_/_0.4)]" />
              <span className="text-xs font-medium text-[rgb(25_35_75_/_0.5)]">Parsed Intent</span>
              <span className="ml-auto text-[10px] text-green-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                parsed
              </span>
            </div>
            <pre className="p-4 text-[11px] font-mono leading-relaxed text-[rgb(25_35_75_/_0.8)] overflow-x-auto">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function TransactionSummaryCard({ data, visible }: { data: (typeof TRANSACTION_SUMMARIES)[0] | null; visible: boolean }) {
  if (!data) return null;
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-white rounded-xl border border-[rgb(25_35_75_/_0.06)] overflow-hidden"
        >
          <div className="flex items-center gap-2 px-4 py-3 border-b border-[rgb(25_35_75_/_0.04)] bg-green-50">
            <CheckCircle size={14} className="text-green-600" />
            <span className="text-xs font-medium text-green-700">Transaction Confirmed</span>
          </div>
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] font-medium text-[rgb(25_35_75_/_0.4)] uppercase tracking-wider">Signature</p>
                <p className="text-xs font-mono text-[rgb(25_35_75)] mt-0.5 truncate">{data.signature}</p>
              </div>
              <div>
                <p className="text-[10px] font-medium text-[rgb(25_35_75_/_0.4)] uppercase tracking-wider">Slot</p>
                <p className="text-xs font-mono text-[rgb(25_35_75)] mt-0.5">{data.slot.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[10px] font-medium text-[rgb(25_35_75_/_0.4)] uppercase tracking-wider">Fee</p>
                <p className="text-xs font-mono text-[rgb(25_35_75)] mt-0.5">{data.fee}</p>
              </div>
              <div>
                <p className="text-[10px] font-medium text-[rgb(25_35_75_/_0.4)] uppercase tracking-wider">Block Time</p>
                <p className="text-xs font-mono text-[rgb(25_35_75)] mt-0.5">{data.blockTime}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function DemoPage() {
  const [currentStage, setCurrentStage] = useState(-1);
  const [faxIndex, setFaxIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startDemo = useCallback(() => {
    setCurrentStage(-1);
    setIsRunning(true);
    setIsComplete(false);
    setShowTerminal(false);
    setFaxIndex((prev) => (prev + 1) % FAX_PREVIEWS.length);

    let step = 0;
    const interval = setInterval(() => {
      if (step < STAGES.length) {
        setCurrentStage(step);
        if (step >= 1) setShowTerminal(true);
        step++;
      } else {
        clearInterval(interval);
        setIsRunning(false);
        setIsComplete(true);
      }
    }, 2200);

    intervalRef.current = interval;
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => startDemo(), 600);
    return () => {
      clearTimeout(timer);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startDemo]);

  const fax = FAX_PREVIEWS[faxIndex];
  const intent = PARSED_INTENTS[faxIndex];
  const tx = TRANSACTION_SUMMARIES[faxIndex];
  const showFax = currentStage >= 0;
  const showJson = currentStage >= 1;
  const showTx = currentStage >= 4;

  const riskLevel = intent.riskScore < 20 ? "low" : intent.riskScore < 50 ? "medium" : "high";
  const riskConfig = {
    low: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500", label: "Low Risk" },
    medium: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500", label: "Medium Risk" },
    high: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500", label: "High Risk" },
  };
  const rc = riskConfig[riskLevel];

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: "#faf8f5" }}>
      <FloatingParticles />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Back link + title */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[rgb(25_35_75_/_0.4)] hover:text-[rgb(25_35_75)] transition-colors mb-4"
          >
            <ArrowLeft size={14} />
            Back to Home
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[rgb(25_35_75)] flex items-center gap-3">
                Live Demo
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-[10px] font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  {isRunning ? "Processing" : isComplete ? "Completed" : "Ready"}
                </span>
              </h1>
              <p className="text-sm text-[rgb(25_35_75_/_0.5)] mt-1">
                Watch Faxi process a handwritten fax through the entire pipeline — from document to on-chain receipt.
              </p>
            </div>
            <button
              onClick={startDemo}
              disabled={isRunning}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isRunning
                  ? "bg-[rgb(25_35_75_/_0.06)] text-[rgb(25_35_75_/_0.3)] cursor-not-allowed"
                  : "bg-[rgb(25_35_75)] text-white hover:shadow-lg hover:shadow-[rgb(25_35_75_/_0.25)] active:scale-[0.97]"
              }`}
            >
              {isComplete ? (
                <>
                  <RotateCcw size={15} />
                  Re-run Demo
                </>
              ) : (
                <>
                  <Play size={15} />
                  Simulate New Fax
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Workflow Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl border border-[rgb(25_35_75_/_0.06)] p-6 mb-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <Sparkles size={14} className="text-[rgb(25_35_75_/_0.4)]" />
            <span className="text-xs font-medium text-[rgb(25_35_75_/_0.5)] uppercase tracking-wider">Workflow Pipeline</span>
          </div>
          <WorkflowStages currentStage={currentStage} />
        </motion.div>

        {/* Middle: Two columns */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
          {/* Left: 3 cols - Controls, Fax Preview, JSON */}
          <div className="lg:col-span-3 space-y-4">
            {/* Step Indicator */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white rounded-xl border border-[rgb(25_35_75_/_0.06)] p-4"
            >
              <div className="flex items-center gap-2 text-xs text-[rgb(25_35_75_/_0.4)] mb-2">
                <Terminal size={12} />
                <span>Current Step</span>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStage >= 0 ? currentStage : "waiting"}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-3"
                >
                  {currentStage >= 0 && currentStage < STAGES.length ? (
                    <>
                      <span className="text-2xl">{STAGES[currentStage].emoji}</span>
                      <div>
                        <p className="text-sm font-semibold text-[rgb(25_35_75)]">{STAGES[currentStage].label}</p>
                        <p className="text-xs text-[rgb(25_35_75_/_0.5)]">Step {currentStage + 1} of {STAGES.length}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="text-2xl">⏳</span>
                      <div>
                        <p className="text-sm font-semibold text-[rgb(25_35_75)]">Waiting for fax...</p>
                        <p className="text-xs text-[rgb(25_35_75_/_0.5)]">Demo will auto-start</p>
                      </div>
                    </>
                  )}
                  <div className="ml-auto flex items-center gap-1">
                    {STAGES.map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full transition-all duration-500 ${
                          i <= currentStage ? "bg-[rgb(25_35_75)]" : "bg-[rgb(25_35_75_/_0.1)]"
                        }`}
                      />
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Fax Preview */}
            <FaxPreviewCard text={fax.text} merchant={fax.merchant} amount={fax.amount} visible={showFax} />

            {/* Parsed Intent JSON */}
            <JsonDataCard data={intent as unknown as Record<string, unknown>} visible={showJson} />
          </div>

          {/* Right: 2 cols - Agent Log Terminal */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="h-full"
            >
              <AnimatePresence>
                {showTerminal && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="h-full"
                  >
                    <AgentLogTerminal live />
                  </motion.div>
                )}
              </AnimatePresence>
              {!showTerminal && (
                <div className="bg-[rgb(15_22_50)] rounded-xl border border-[rgb(255_255_255_/_0.06)] p-8 flex flex-col items-center justify-center text-center h-full min-h-[300px]">
                  <div className="w-10 h-10 rounded-full border-2 border-white/10 flex items-center justify-center mb-3">
                    <Terminal size={18} className="text-white/20" />
                  </div>
                  <p className="text-sm text-white/30 font-medium">Agent terminal will appear</p>
                  <p className="text-xs text-white/20 mt-1">once AI analysis begins</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Bottom: Transaction Summary + Risk */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TransactionSummaryCard data={tx} visible={showTx} />
          </div>

          {/* Risk Score + Quick Stats */}
          <AnimatePresence>
            {showJson && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="bg-white rounded-xl border border-[rgb(25_35_75_/_0.06)] p-5"
              >
                <h3 className="text-xs font-medium text-[rgb(25_35_75_/_0.5)] uppercase tracking-wider mb-4">Risk Assessment</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[rgb(25_35_75_/_0.6)]">Score</span>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${rc.bg} ${rc.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${rc.dot}`} />
                      {rc.label} · {intent.riskScore}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-[rgb(25_35_75_/_0.08)] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${intent.riskScore}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-full rounded-full ${
                        riskLevel === "low" ? "bg-green-500" : riskLevel === "medium" ? "bg-amber-500" : "bg-red-500"
                      }`}
                    />
                  </div>
                  <div className="pt-3 border-t border-[rgb(25_35_75_/_0.04)] space-y-2.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-[rgb(25_35_75_/_0.5)]">Confidence</span>
                      <span className="font-mono text-[rgb(25_35_75)]">{intent.confidence}%</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-[rgb(25_35_75_/_0.5)]">Category</span>
                      <span className="font-medium text-[rgb(25_35_75)] capitalize">{intent.category}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-[rgb(25_35_75_/_0.5)]">Urgency</span>
                      <span className="font-medium text-[rgb(25_35_75)] capitalize">{intent.urgency}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-[rgb(25_35_75_/_0.5)]">Amount</span>
                      <span className="font-bold text-[rgb(25_35_75)]">¥{intent.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-[rgb(25_35_75_/_0.5)]">Merchant</span>
                      <span className="font-medium text-[rgb(25_35_75)]">{intent.merchant}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Completion footer */}
        <AnimatePresence>
          {isComplete && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 text-center"
            >
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-white border border-green-200 shadow-sm">
                <CheckCircle size={20} className="text-green-500" />
                <span className="text-sm font-medium text-[rgb(25_35_75)]">
                  Demo complete — full pipeline executed successfully
                </span>
                <button
                  onClick={startDemo}
                  className="ml-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[rgb(25_35_75)] text-white text-xs font-medium hover:bg-[rgb(25_35_75_/_0.9)] transition-all"
                >
                  <RotateCcw size={12} />
                  Run Again
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
