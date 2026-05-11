"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FileText, Send, Clock, CheckCircle, Search } from "lucide-react"
import Link from "next/link"

const requests = [
  {
    id: 1,
    merchant: "Pharmacy",
    amount: "¥4,200",
    date: "May 8, 2026",
    status: "Completed" as const,
  },
  {
    id: 2,
    merchant: "Grocery Delivery",
    amount: "¥8,500",
    date: "May 7, 2026",
    status: "Family Review" as const,
  },
  {
    id: 3,
    merchant: "Utility Bill",
    amount: "¥12,000",
    date: "May 5, 2026",
    status: "Processing" as const,
  },
]

const statusConfig = {
  Completed: { icon: CheckCircle, color: "text-green-500", bg: "bg-green-50", label: "Completed" },
  "Family Review": { icon: Clock, color: "text-amber-500", bg: "bg-amber-50", label: "Family Review" },
  Processing: { icon: Search, color: "text-blue-500", bg: "bg-blue-50", label: "Processing" },
}

function StatusBadge({ status }: { status: keyof typeof statusConfig }) {
  const config = statusConfig[status]
  const Icon = config.icon
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.color}`}>
      <Icon size={16} />
      {config.label}
    </span>
  )
}

export default function SeniorPage() {
  const [text, setText] = useState("")

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#faf8f5" }}>
      <div className="max-w-2xl mx-auto px-6 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mb-10"
        >
          <Link href="/" className="inline-flex items-center gap-2 text-sm" style={{ color: "rgb(25 35 75 / 0.5)" }}>
            <FileText size={20} />
            Faxi
          </Link>
          <h1 className="text-3xl font-bold mt-3" style={{ color: "rgb(25 35 75)" }}>
            Senior Service
          </h1>
          <p className="text-base mt-1" style={{ color: "rgb(25 35 75 / 0.5)" }}>
            Send us a request and we&apos;ll take care of it
          </p>
        </motion.div>

        {/* Section 1 – Send a Request */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
          className="mb-12"
        >
          <h2 className="text-xl font-semibold mb-4" style={{ color: "rgb(25 35 75)" }}>
            Send a Request
          </h2>

          <div
            className="rounded-2xl p-2"
            style={{ backgroundColor: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)" }}
          >
            <div
              className="rounded-xl p-5"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(59, 130, 246, 0.08) 1px, transparent 1px)
                `,
                backgroundSize: "100% 32px",
                backgroundColor: "#fffeff",
                minHeight: 192,
              }}
            >
              <label className="block text-sm font-medium mb-3" style={{ color: "rgb(25 35 75 / 0.6)" }}>
                Write your request below
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="e.g. Please pay the pharmacy bill..."
                rows={5}
                className="w-full resize-none bg-transparent text-lg leading-8 outline-none"
                style={{ color: "rgb(25 35 75)", lineHeight: "32px" }}
              />
            </div>

            <div className="flex justify-end px-5 pb-4 pt-2">
              <button
                onClick={() => {
                  if (!text.trim()) return;
                  alert("Your request has been sent successfully! 📠");
                  setText("");
                }}
                disabled={!text.trim()}
                className={`inline-flex items-center gap-3 px-8 py-3 rounded-full text-white text-lg font-medium transition-all ${
                  text.trim()
                    ? "opacity-100 hover:opacity-90"
                    : "opacity-50 cursor-not-allowed"
                }`}
                style={{ backgroundColor: "rgb(25 35 75)" }}
              >
                <Send size={20} />
                Send via Fax
              </button>
            </div>
          </div>
        </motion.section>

        {/* Section 2 – Your Requests */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold mb-4" style={{ color: "rgb(25 35 75)" }}>
            Your Requests
          </h2>

          <div className="space-y-3">
            {requests.map((req, i) => {
              const StatusIcon = statusConfig[req.status].icon
              return (
                <motion.div
                  key={req.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: "easeOut", delay: 0.25 + i * 0.08 }}
                  className="rounded-2xl p-5"
                  style={{ backgroundColor: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)" }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`rounded-xl p-3 ${statusConfig[req.status].bg}`}>
                        <StatusIcon size={24} className={statusConfig[req.status].color} />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium" style={{ color: "rgb(25 35 75)" }}>
                          {req.merchant}
                        </h3>
                        <p className="text-sm mt-0.5" style={{ color: "rgb(25 35 75 / 0.5)" }}>
                          {req.amount} &middot; {req.date}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={req.status} />
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.section>
      </div>
    </div>
  )
}
