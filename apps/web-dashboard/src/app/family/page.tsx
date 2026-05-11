"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Settings,
  Bell,
  BellOff,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  Wallet,
  Shield,
  Sliders,
} from "lucide-react";
import { ApprovalCard } from "../../components/ApprovalCard";
import { RiskBadge, RiskScoreBar } from "../../components/RiskBadge";

type Approval = {
  id: string;
  seniorName: string;
  merchant: string;
  amount: number;
  intent: string;
  riskScore: number;
  timestamp: string;
};

type Action = "approved" | "rejected";

const initialApprovals: Approval[] = [
  {
    id: "1",
    seniorName: "Ahmed",
    merchant: "Al-Ahli Pharmacy",
    amount: 4200,
    intent: "Prescription refill - blood pressure medication",
    riskScore: 25,
    timestamp: "Today, 10:32 AM",
  },
  {
    id: "2",
    seniorName: "Fatima",
    merchant: "Carrefour Grocery",
    amount: 8500,
    intent: "Weekly grocery delivery order",
    riskScore: 55,
    timestamp: "Today, 9:15 AM",
  },
  {
    id: "3",
    seniorName: "Mohammed",
    merchant: "SEPA Electricity",
    amount: 12000,
    intent: "Monthly utility bill payment",
    riskScore: 12,
    timestamp: "Yesterday, 4:45 PM",
  },
  {
    id: "4",
    seniorName: "Aisha",
    merchant: "Al-Noor Medical Center",
    amount: 15000,
    intent: "Scheduled doctor consultation & lab tests",
    riskScore: 78,
    timestamp: "Yesterday, 2:20 PM",
  },
  {
    id: "5",
    seniorName: "Yusuf",
    merchant: "FreshMart Delivery",
    amount: 3200,
    intent: "Fresh fruits and vegetables order",
    riskScore: 8,
    timestamp: "Yesterday, 11:00 AM",
  },
];

export default function FamilyDashboardPage() {
  const [approvals, setApprovals] = useState<Approval[]>(initialApprovals);
  const [notifications, setNotifications] = useState(true);
  const [dailyLimit, setDailyLimit] = useState(10000);
  const [monthlyLimit, setMonthlyLimit] = useState(50000);

  const dailySpend = 4200;
  const monthlySpend = 24700;

  const [approvedToday, setApprovedToday] = useState(2);
  const [rejectedToday, setRejectedToday] = useState(1);

  const handleAction = (id: string, action: Action) => {
    setApprovals((prev) => prev.filter((a) => a.id !== id));
    if (action === "approved") setApprovedToday((p) => p + 1);
    if (action === "rejected") setRejectedToday((p) => p + 1);
  };

  const pendingCount = approvals.length;
  const avgRiskScore =
    approvals.length > 0
      ? Math.round(
          approvals.reduce((sum, a) => sum + a.riskScore, 0) / approvals.length
        )
      : 0;

  const highRiskCount = approvals.filter((a) => a.riskScore >= 60).length;

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="w-10 h-10 rounded-xl bg-white border border-[rgb(25_35_75_/_0.06)] flex items-center justify-center text-[rgb(25_35_75)] hover:border-[rgb(25_35_75_/_0.15)] transition-all"
            >
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-[rgb(25_35_75)]">
                Family Dashboard
              </h1>
              <p className="text-sm text-[rgb(25_35_75_/_0.5)]">
                Review and manage approval requests from your family
              </p>
            </div>
          </div>
        </motion.div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Pending Approvals */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[rgb(25_35_75)] flex items-center justify-center">
                  <Clock size={18} className="text-white" />
                </div>
                <div>
                  <h2 className="font-semibold text-[rgb(25_35_75)]">
                    Pending Approvals
                  </h2>
                  <p className="text-xs text-[rgb(25_35_75_/_0.5)]">
                    {pendingCount} request{pendingCount !== 1 ? "s" : ""} awaiting review
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <RiskBadge
                  level={
                    avgRiskScore < 30
                      ? "low"
                      : avgRiskScore < 60
                      ? "medium"
                      : "high"
                  }
                  score={avgRiskScore}
                />
              </div>
            </motion.div>

            <AnimatePresence mode="popLayout">
              {approvals.length > 0 ? (
                <div className="space-y-4">
                  {approvals.map((approval, i) => (
                    <motion.div
                      key={approval.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20, scale: 0.95 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <ApprovalCard
                        id={approval.id}
                        seniorName={approval.seniorName}
                        merchant={approval.merchant}
                        amount={approval.amount}
                        intent={approval.intent}
                        riskScore={approval.riskScore}
                        timestamp={approval.timestamp}
                        onApprove={() => handleAction(approval.id, "approved")}
                        onReject={() => handleAction(approval.id, "rejected")}
                      />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-xl border border-[rgb(25_35_75_/_0.06)] p-12 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={32} className="text-green-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-[rgb(25_35_75)] mb-1">
                    All Caught Up!
                  </h3>
                  <p className="text-sm text-[rgb(25_35_75_/_0.5)] max-w-xs mx-auto">
                    All pending requests have been reviewed. New requests will
                    appear here automatically.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Spending Overview */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl border border-[rgb(25_35_75_/_0.06)] p-5"
            >
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                  <Wallet size={16} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-[rgb(25_35_75)]">
                    Spending Overview
                  </h3>
                  <p className="text-xs text-[rgb(25_35_75_/_0.4)]">Today's activity</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Daily Spend */}
                <div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-[rgb(25_35_75_/_0.6)]">Daily Spend</span>
                    <span className="font-semibold text-[rgb(25_35_75)]">
                      ¥{dailySpend.toLocaleString()} / ¥{dailyLimit.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 bg-[rgb(25_35_75_/_0.06)] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${Math.min((dailySpend / dailyLimit) * 100, 100)}%`,
                      }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-full rounded-full ${
                        dailySpend / dailyLimit > 0.8
                          ? "bg-red-500"
                          : dailySpend / dailyLimit > 0.5
                          ? "bg-amber-500"
                          : "bg-green-500"
                      }`}
                    />
                  </div>
                </div>

                {/* Monthly Spend */}
                <div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-[rgb(25_35_75_/_0.6)]">Monthly Spend</span>
                    <span className="font-semibold text-[rgb(25_35_75)]">
                      ¥{monthlySpend.toLocaleString()} / ¥{monthlyLimit.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 bg-[rgb(25_35_75_/_0.06)] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${Math.min(
                          (monthlySpend / monthlyLimit) * 100,
                          100
                        )}%`,
                      }}
                      transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                      className={`h-full rounded-full ${
                        monthlySpend / monthlyLimit > 0.8
                          ? "bg-red-500"
                          : monthlySpend / monthlyLimit > 0.5
                          ? "bg-amber-500"
                          : "bg-blue-500"
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="mt-5 pt-4 border-t border-[rgb(25_35_75_/_0.06)]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-[rgb(25_35_75_/_0.5)]">
                    Daily Limit
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setDailyLimit((p) => Math.max(1000, p - 1000))
                      }
                      className="w-7 h-7 rounded-lg bg-[rgb(25_35_75_/_0.05)] flex items-center justify-center text-xs font-bold text-[rgb(25_35_75_/_0.5)] hover:bg-[rgb(25_35_75_/_0.1)] transition-all"
                    >
                      -
                    </button>
                    <span className="text-sm font-semibold text-[rgb(25_35_75)] w-16 text-center">
                      ¥{dailyLimit.toLocaleString()}
                    </span>
                    <button
                      onClick={() => setDailyLimit((p) => Math.min(50000, p + 1000))}
                      className="w-7 h-7 rounded-lg bg-[rgb(25_35_75_/_0.05)] flex items-center justify-center text-xs font-bold text-[rgb(25_35_75_/_0.5)] hover:bg-[rgb(25_35_75_/_0.1)] transition-all"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[rgb(25_35_75_/_0.5)]">
                    Monthly Limit
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setMonthlyLimit((p) => Math.max(10000, p - 5000))
                      }
                      className="w-7 h-7 rounded-lg bg-[rgb(25_35_75_/_0.05)] flex items-center justify-center text-xs font-bold text-[rgb(25_35_75_/_0.5)] hover:bg-[rgb(25_35_75_/_0.1)] transition-all"
                    >
                      -
                    </button>
                    <span className="text-sm font-semibold text-[rgb(25_35_75)] w-20 text-center">
                      ¥{monthlyLimit.toLocaleString()}
                    </span>
                    <button
                      onClick={() =>
                        setMonthlyLimit((p) => Math.min(200000, p + 5000))
                      }
                      className="w-7 h-7 rounded-lg bg-[rgb(25_35_75_/_0.05)] flex items-center justify-center text-xs font-bold text-[rgb(25_35_75_/_0.5)] hover:bg-[rgb(25_35_75_/_0.1)] transition-all"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Risk Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl border border-[rgb(25_35_75_/_0.06)] p-5"
            >
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                  <Shield size={16} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-[rgb(25_35_75)]">
                    Risk Summary
                  </h3>
                  <p className="text-xs text-[rgb(25_35_75_/_0.4)]">Pending requests</p>
                </div>
              </div>

              <RiskScoreBar score={avgRiskScore} />

              <div className="grid grid-cols-3 gap-2 mt-4">
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <span className="text-lg font-bold text-green-700">
                    {approvals.filter((a) => a.riskScore < 30).length}
                  </span>
                  <p className="text-xs text-green-600 mt-0.5">Low</p>
                </div>
                <div className="bg-amber-50 rounded-lg p-3 text-center">
                  <span className="text-lg font-bold text-amber-700">
                    {approvals.filter(
                      (a) => a.riskScore >= 30 && a.riskScore < 60
                    ).length}
                  </span>
                  <p className="text-xs text-amber-600 mt-0.5">Medium</p>
                </div>
                <div className="bg-red-50 rounded-lg p-3 text-center">
                  <span className="text-lg font-bold text-red-700">
                    {highRiskCount}
                  </span>
                  <p className="text-xs text-red-600 mt-0.5">High</p>
                </div>
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl border border-[rgb(25_35_75_/_0.06)] p-5"
            >
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <TrendingUp size={16} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-[rgb(25_35_75)]">
                    Quick Stats
                  </h3>
                  <p className="text-xs text-[rgb(25_35_75_/_0.4)]">Today's activity</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 px-3 bg-[rgb(25_35_75_/_0.03)] rounded-lg">
                  <div className="flex items-center gap-2.5">
                    <Clock size={14} className="text-[rgb(25_35_75_/_0.4)]" />
                    <span className="text-sm text-[rgb(25_35_75_/_0.6)]">
                      Pending
                    </span>
                  </div>
                  <span className="font-bold text-[rgb(25_35_75)]">
                    {pendingCount}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 px-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={14} className="text-green-500" />
                    <span className="text-sm text-green-700">Approved</span>
                  </div>
                  <span className="font-bold text-green-700">
                    {approvedToday}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 px-3 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-2.5">
                    <XCircle size={14} className="text-red-500" />
                    <span className="text-sm text-red-700">Rejected</span>
                  </div>
                  <span className="font-bold text-red-700">
                    {rejectedToday}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 px-3 bg-[rgb(25_35_75_/_0.03)] rounded-lg">
                  <div className="flex items-center gap-2.5">
                    <Wallet size={14} className="text-[rgb(25_35_75_/_0.4)]" />
                    <span className="text-sm text-[rgb(25_35_75_/_0.6)]">
                      Total Spent
                    </span>
                  </div>
                  <span className="font-bold text-[rgb(25_35_75)]">
                    ¥{(dailySpend + monthlySpend).toLocaleString()}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Notification Settings */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl border border-[rgb(25_35_75_/_0.06)] p-5"
            >
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center">
                  <Bell size={16} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-[rgb(25_35_75)]">
                    Notifications
                  </h3>
                  <p className="text-xs text-[rgb(25_35_75_/_0.4)]">
                    Manage your alerts
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Bell
                      size={16}
                      className={
                        notifications
                          ? "text-teal-500"
                          : "text-[rgb(25_35_75_/_0.3)]"
                      }
                    />
                    <span className="text-sm text-[rgb(25_35_75)]">
                      Push Notifications
                    </span>
                  </div>
                  <button
                    onClick={() => setNotifications(!notifications)}
                    className={`relative w-11 h-6 rounded-full transition-all ${
                      notifications ? "bg-teal-500" : "bg-[rgb(25_35_75_/_0.15)]"
                    }`}
                  >
                    <motion.div
                      animate={{ x: notifications ? 20 : 2 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between opacity-50">
                  <div className="flex items-center gap-2.5">
                    <Sliders
                      size={16}
                      className="text-[rgb(25_35_75_/_0.3)]"
                    />
                    <span className="text-sm text-[rgb(25_35_75)]">
                      SMS Alerts
                    </span>
                  </div>
                  <span className="text-xs text-[rgb(25_35_75_/_0.3)]">Soon</span>
                </div>

                <div className="flex items-center justify-between opacity-50">
                  <div className="flex items-center gap-2.5">
                    <BellOff
                      size={16}
                      className="text-[rgb(25_35_75_/_0.3)]"
                    />
                    <span className="text-sm text-[rgb(25_35_75)]">
                      Quiet Hours
                    </span>
                  </div>
                  <span className="text-xs text-[rgb(25_35_75_/_0.3)]">Soon</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
