"use client";

import { motion } from "framer-motion";
import { Activity, Cpu, Database, Zap, Clock, CheckCircle, AlertTriangle, Server, Webhook } from "lucide-react";
import { AgentLogTerminal } from "../../components/AgentLogTerminal";

const metrics = [
  { label: "Total Requests", value: "1,247", change: "+12%", icon: Activity, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "AI Success Rate", value: "98.3%", change: "+0.5%", icon: Cpu, color: "text-green-600", bg: "bg-green-50" },
  { label: "Avg Processing", value: "2.4s", change: "-0.3s", icon: Clock, color: "text-purple-600", bg: "bg-purple-50" },
  { label: "On-Chain Txs", value: "892", change: "+45", icon: Database, color: "text-amber-600", bg: "bg-amber-50" },
  { label: "Active Agents", value: "7", change: "All online", icon: Cpu, color: "text-cyan-600", bg: "bg-cyan-50" },
  { label: "Webhook Queue", value: "3", change: "Processing", icon: Webhook, color: "text-rose-600", bg: "bg-rose-50" },
];

const agents = [
  { name: "Fax Ingestor", status: "active", uptime: "99.9%", tasks: 342 },
  { name: "OCR Processor", status: "active", uptime: "99.7%", tasks: 338 },
  { name: "Gemini AI", status: "active", uptime: "98.5%", tasks: 335 },
  { name: "Risk Engine", status: "active", uptime: "99.9%", tasks: 330 },
  { name: "Blink Service", status: "active", uptime: "99.8%", tasks: 280 },
  { name: "Swig Orchestrator", status: "active", uptime: "99.6%", tasks: 265 },
  { name: "Fax Outbound", status: "idle", uptime: "99.9%", tasks: 245 },
];

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-3xl font-bold text-[rgb(25_35_75)]">AI Control Panel</h1>
          <p className="mt-2 text-[rgb(25_35_75_/_0.5)]">System health, agent logs, and transaction pipeline</p>
        </motion.div>

        {/* METRICS GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
          {metrics.map((metric, i) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-xl border border-[rgb(25_35_75_/_0.06)] p-4"
              >
                <div className={`w-8 h-8 rounded-lg ${metric.bg} flex items-center justify-center mb-3`}>
                  <Icon size={16} className={metric.color} />
                </div>
                <p className="text-2xl font-bold text-[rgb(25_35_75)]">{metric.value}</p>
                <p className="text-xs text-[rgb(25_35_75_/_0.5)] mt-1">{metric.label}</p>
                <span className="text-xs font-medium text-green-600">{metric.change}</span>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {/* AGENT STATUS */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-[rgb(25_35_75_/_0.06)] p-6"
            >
              <h2 className="text-sm font-semibold text-[rgb(25_35_75)] mb-4 flex items-center gap-2">
                <Server size={16} />
                Agent Status
              </h2>
              <div className="space-y-3">
                {agents.map((agent) => (
                  <div key={agent.name} className="flex items-center justify-between py-2 border-b border-[rgb(25_35_75_/_0.04)] last:border-0">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${agent.status === "active" ? "bg-green-500" : "bg-amber-400"}`} />
                      <span className="text-sm text-[rgb(25_35_75)]">{agent.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-[rgb(25_35_75_/_0.5)]">{agent.tasks} tasks</span>
                      <span className="text-xs text-green-600 ml-2">{agent.uptime}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* AGENT LOGS */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-sm font-semibold text-[rgb(25_35_75)] mb-3 flex items-center gap-2">
                <Zap size={16} />
                Agent Execution Logs
              </h2>
              <AgentLogTerminal />
            </motion.div>
          </div>
        </div>

        {/* TRANSACTION PIPELINE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl border border-[rgb(25_35_75_/_0.06)] p-6"
        >
          <h2 className="text-sm font-semibold text-[rgb(25_35_75)] mb-4 flex items-center gap-2">
            <Database size={16} />
            Transaction Pipeline
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[rgb(25_35_75_/_0.06)]">
                  <th className="text-left py-3 px-2 text-[rgb(25_35_75_/_0.5)] font-medium">TX ID</th>
                  <th className="text-left py-3 px-2 text-[rgb(25_35_75_/_0.5)] font-medium">Type</th>
                  <th className="text-left py-3 px-2 text-[rgb(25_35_75_/_0.5)] font-medium">Amount</th>
                  <th className="text-left py-3 px-2 text-[rgb(25_35_75_/_0.5)] font-medium">Status</th>
                  <th className="text-left py-3 px-2 text-[rgb(25_35_75_/_0.5)] font-medium">Agent</th>
                  <th className="text-left py-3 px-2 text-[rgb(25_35_75_/_0.5)] font-medium">Time</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: "0x7a3f...b9e2", type: "Payment", amount: "¥4,200", status: "confirmed", agent: "swig", time: "2 min ago" },
                  { id: "0x9c1d...f4a8", type: "Approval", amount: "—", status: "pending", agent: "blink", time: "5 min ago" },
                  { id: "0x3e7b...d2f1", type: "Payment", amount: "¥8,500", status: "confirmed", agent: "swig", time: "15 min ago" },
                  { id: "0x6f2a...c7e3", type: "Policy", amount: "—", status: "confirmed", agent: "orchestrator", time: "1 hour ago" },
                ].map((tx) => (
                  <tr key={tx.id} className="border-b border-[rgb(25_35_75_/_0.04)] hover:bg-[rgb(25_35_75_/_0.02)]">
                    <td className="py-3 px-2 font-mono text-xs text-[rgb(25_35_75)]">{tx.id}</td>
                    <td className="py-3 px-2 text-[rgb(25_35_75)]">{tx.type}</td>
                    <td className="py-3 px-2 font-medium text-[rgb(25_35_75)]">{tx.amount}</td>
                    <td className="py-3 px-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                        tx.status === "confirmed" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
                      }`}>
                        {tx.status === "confirmed" ? <CheckCircle size={12} /> : <Clock size={12} />}
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-[rgb(25_35_75_/_0.7)]">{tx.agent}</td>
                    <td className="py-3 px-2 text-[rgb(25_35_75_/_0.5)]">{tx.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* SYSTEM HEALTH */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 bg-white rounded-xl border border-[rgb(25_35_75_/_0.06)] p-6"
        >
          <h2 className="text-sm font-semibold text-[rgb(25_35_75)] mb-4 flex items-center gap-2">
            <Activity size={16} />
            System Health
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "API Server", status: "healthy", latency: "45ms" },
              { label: "Solana RPC", status: "healthy", latency: "230ms" },
              { label: "AI Service", status: "healthy", latency: "1.2s" },
              { label: "Database", status: "healthy", latency: "12ms" },
              { label: "Queue System", status: "healthy", latency: "8ms" },
              { label: "Webhook Relay", status: "degraded", latency: "3.5s" },
            ].map((service) => (
              <div key={service.label} className="flex items-center justify-between p-3 rounded-lg bg-[rgb(25_35_75_/_0.03)]">
                <div>
                  <p className="text-sm font-medium text-[rgb(25_35_75)]">{service.label}</p>
                  <span className={`text-xs font-medium ${service.status === "healthy" ? "text-green-600" : "text-amber-600"}`}>
                    {service.latency}
                  </span>
                </div>
                <span className={`w-2.5 h-2.5 rounded-full ${service.status === "healthy" ? "bg-green-500" : "bg-amber-400"}`} />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
