"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FileText, Send, Clock, CheckCircle, Search, ArrowLeft } from "lucide-react"
import Link from "next/link"

const requests = [
  { id: 1, merchant: "Pharmacy", amount: "¥4,200", date: "Today", status: "Completed" as const },
  { id: 2, merchant: "Grocery Delivery", amount: "¥8,500", date: "May 7, 2026", status: "Family Review" as const },
  { id: 3, merchant: "Utility Bill", amount: "¥12,000", date: "May 5, 2026", status: "Processing" as const },
]

const statusConfig = {
  Completed: { icon: CheckCircle, color: "text-accent-green", bg: "bg-accent-green/10", label: "Completed" },
  "Family Review": { icon: Clock, color: "text-accent-orange", bg: "bg-accent-orange/10", label: "Family Review" },
  Processing: { icon: Search, color: "text-primary-neon", bg: "bg-primary-neon/10", label: "AI Processing" },
}

export default function SeniorPage() {
  const [text, setText] = useState("")

  return (
    <div className="min-h-screen pt-32 pb-12 px-6">
      <div className="max-w-2xl mx-auto">
        
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 flex justify-between items-end"
        >
          <div>
            <Link href="/" className="flex items-center gap-2 text-white/30 hover:text-white transition-all text-sm mb-4">
              <ArrowLeft size={16} /> Back to Hub
            </Link>
            <h1 className="text-4xl font-black">Senior Service</h1>
            <p className="text-white/40 mt-2">Write your request as if on paper. Our AI handles the rest.</p>
          </div>
          <div className="w-16 h-16 rounded-[20px] glass flex items-center justify-center text-primary-neon">
            <FileText size={32} />
          </div>
        </motion.div>

        {/* The "Digital Paper" Section */}
        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-16 relative"
        >
          <div className="glass-card p-2 border-primary/20">
            <div className="rounded-[24px] p-8 bg-white text-dark min-h-[300px] shadow-inner relative overflow-hidden">
               {/* Paper Lines */}
               <div className="absolute inset-0 pointer-events-none opacity-10" style={{
                 backgroundImage: 'linear-gradient(#000 1.5px, transparent 1.5px)',
                 backgroundSize: '100% 40px',
                 marginTop: '45px'
               }} />
               
               <label className="block text-[10px] font-black uppercase text-dark/30 tracking-widest mb-4 relative z-10">
                 Analog Input Terminal
               </label>
               
               <textarea
                 value={text}
                 onChange={(e) => setText(e.target.value)}
                 placeholder="Example: Please pay the pharmacy bill for 12,500 Yen..."
                 className="w-full bg-transparent border-none focus:ring-0 text-2xl font-medium text-dark leading-[40px] relative z-10 min-h-[200px] placeholder:text-dark/10"
               />
            </div>
            
            <div className="p-4 flex justify-between items-center">
               <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary-neon shadow-[0_0_10px_#00F5FF]" />
                  <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">AI Ready</span>
               </div>
               <button
                 onClick={() => { setText(""); alert("Fax transmitted! 📠"); }}
                 disabled={!text.trim()}
                 className={`btn-neon flex items-center gap-3 ${!text.trim() && 'opacity-20 cursor-not-allowed'}`}
               >
                 <Send size={20} /> Transmit Fax
               </button>
            </div>
          </div>
        </motion.section>

        {/* Request History */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <History size={20} className="text-white/30" /> Transaction History
          </h2>

          <div className="space-y-4">
            {requests.map((req, i) => {
              const Config = statusConfig[req.status]
              return (
                <motion.div
                  key={req.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="glass-card flex items-center justify-between p-5 group hover:border-primary/30"
                >
                  <div className="flex items-center gap-5">
                    <div className={`w-14 h-14 rounded-2xl ${Config.bg} flex items-center justify-center text-white`}>
                      <Config.icon size={24} className={Config.color} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{req.merchant}</h3>
                      <p className="text-sm text-white/40 font-medium">{req.amount} &middot; {req.date}</p>
                    </div>
                  </div>
                  <div className={`px-4 py-1.5 rounded-full ${Config.bg} ${Config.color} text-[10px] font-black uppercase tracking-widest`}>
                    {Config.label}
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
