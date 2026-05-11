"use client";

import { motion } from "framer-motion";
import { Activity, Cpu, Database, Zap, Clock, CheckCircle, Server, Webhook, Terminal as TerminalIcon, Globe, Shield } from "lucide-react";
import { AgentLogTerminal } from "../../components/AgentLogTerminal";

const metrics = [
  { label: "Total Requests", value: "1,247", change: "+12%", icon: Activity, color: "text-primary-neon", bg: "bg-primary-neon/10" },
  { label: "AI Success Rate", value: "98.3%", change: "+0.5%", icon: Cpu, color: "text-accent-green", bg: "bg-accent-green/10" },
  { label: "Avg Processing", value: "2.4s", change: "-0.3s", icon: Clock, color: "text-accent-pink", bg: "bg-accent-pink/10" },
  { label: "On-Chain Txs", value: "892", change: "+45", icon: Database, color: "text-primary-neon", bg: "bg-primary-neon/10" },
  { label: "Active Agents", value: "7", change: "Online", icon: Shield, color: "text-accent-green", bg: "bg-accent-green/10" },
  { label: "Webhook Queue", value: "3", change: "Normal", icon: Webhook, color: "text-accent-orange", bg: "bg-accent-orange/10" },
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
    <div className="min-h-screen pt-32 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 flex justify-between items-end"
        >
          <div>
            <h1 className="text-4xl font-black mb-2">Agentic Mission Control</h1>
            <p className="text-white/40">Real-time surveillance of the analog-to-digital bridge</p>
          </div>
          <div className="flex gap-3">
             <div className="px-4 py-2 rounded-full glass border-accent-green/20 text-accent-green text-[10px] font-black uppercase flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent-green animate-ping" /> System Optimal
             </div>
          </div>
        </motion.div>

        {/* METRICS GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
          {metrics.map((metric, i) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card p-4 hover:border-white/20"
              >
                <div className={`w-10 h-10 rounded-xl ${metric.bg} flex items-center justify-center mb-4`}>
                  <Icon size={20} className={metric.color} />
                </div>
                <div className="text-2xl font-black">{metric.value}</div>
                <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-1">{metric.label}</div>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* AGENT STATUS */}
          <div className="lg:col-span-1">
            <div className="glass-card h-full">
              <h2 className="text-sm font-black uppercase tracking-widest text-white/30 mb-8 flex items-center gap-2">
                <Server size={16} /> Operational Agents
              </h2>
              <div className="space-y-6">
                {agents.map((agent) => (
                  <div key={agent.name} className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className={`w-2 h-2 rounded-full ${agent.status === "active" ? "bg-accent-green shadow-[0_0_8px_#00FF94]" : "bg-accent-orange"}`} />
                      <span className="text-sm font-bold group-hover:text-primary-neon transition-colors">{agent.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-black text-white/20">{agent.uptime} UPTIME</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AGENT LOGS */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              <h2 className="text-sm font-black uppercase tracking-widest text-white/30 flex items-center gap-2 px-2">
                <TerminalIcon size={16} /> Live Execution Stream
              </h2>
              <div className="glass rounded-[32px] overflow-hidden border-white/5 shadow-2xl">
                <AgentLogTerminal />
              </div>
            </div>
          </div>
        </div>

        {/* TRANSACTION PIPELINE */}
        <div className="glass-card">
          <h2 className="text-sm font-black uppercase tracking-widest text-white/30 mb-8 flex items-center gap-2">
            <Database size={16} /> Transaction Pipeline
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="py-4 text-[10px] font-black text-white/20 uppercase tracking-widest">TX Signature</th>
                  <th className="py-4 text-[10px] font-black text-white/20 uppercase tracking-widest">Operation</th>
                  <th className="py-4 text-[10px] font-black text-white/20 uppercase tracking-widest">Amount</th>
                  <th className="py-4 text-[10px] font-black text-white/20 uppercase tracking-widest">Status</th>
                  <th className="py-4 text-[10px] font-black text-white/20 uppercase tracking-widest">Latency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  { id: "0x7a3f...b9e2", type: "SOL Transfer", amount: "¥4,200", status: "confirmed", time: "2.1s" },
                  { id: "0x9c1d...f4a8", type: "Approval PDA", amount: "—", status: "pending", time: "4.5s" },
                  { id: "0x3e7b...d2f1", type: "USDC Mint", amount: "¥8,500", status: "confirmed", time: "1.8s" },
                  { id: "0x6f2a...c7e3", type: "WorldID Auth", amount: "—", status: "confirmed", time: "0.9s" },
                ].map((tx) => (
                  <tr key={tx.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="py-5 font-mono text-xs text-primary-neon opacity-70 group-hover:opacity-100">{tx.id}</td>
                    <td className="py-5 text-sm font-bold">{tx.type}</td>
                    <td className="py-5 text-sm font-black text-accent-green">{tx.amount}</td>
                    <td className="py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        tx.status === "confirmed" ? "bg-accent-green/10 text-accent-green" : "bg-accent-orange/10 text-accent-orange"
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-5 text-xs text-white/30">{tx.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SYSTEM INFRA */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="glass-card p-6 flex items-center gap-6">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary-neon"><Globe size={24} /></div>
              <div>
                 <div className="text-[10px] font-black text-white/20 uppercase mb-1">Global RPC</div>
                 <div className="font-bold">Solana Mainnet-Beta</div>
              </div>
           </div>
           <div className="glass-card p-6 flex items-center gap-6">
              <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary-neon"><Server size={24} /></div>
              <div>
                 <div className="text-[10px] font-black text-white/20 uppercase mb-1">Compute Unit</div>
                 <div className="font-bold">Vercel Edge Runtime</div>
              </div>
           </div>
           <div className="glass-card p-6 flex items-center gap-6">
              <div className="w-12 h-12 rounded-2xl bg-accent-green/10 flex items-center justify-center text-accent-green"><Shield size={24} /></div>
              <div>
                 <div className="text-[10px] font-black text-white/20 uppercase mb-1">Security</div>
                 <div className="font-bold">Multi-Sig Guarded</div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
