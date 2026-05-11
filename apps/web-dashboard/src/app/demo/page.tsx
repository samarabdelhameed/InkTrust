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
  Terminal as TerminalIcon,
  FileJson,
  Sparkles,
  Clock,
  ArrowLeft,
  Zap,
  Activity,
  Shield
} from "lucide-react";
import Link from "next/link";
import { AgentLogTerminal } from "../../components/AgentLogTerminal";

const STAGES = [
  { id: "fax-received", icon: FileText, label: "Fax Ingest", emoji: "📠", color: "text-primary-neon" },
  { id: "ai-analysis", icon: Brain, label: "AI Analysis", emoji: "🧠", color: "text-secondary-neon" },
  { id: "family-approval", icon: Users, label: "Family Trust", emoji: "👨‍👩‍👧", color: "text-accent-orange" },
  { id: "onchain-execution", icon: Link2, label: "On-Chain", emoji: "⛓️", color: "text-accent-green" },
  { id: "receipt-sent", icon: CheckCircle, label: "Done", emoji: "✅", color: "text-white" },
];

const FAX_PREVIEWS = [
  { text: "Please pay pharmacy bill of ¥4,200 for my monthly medication. Thank you, Yuki.", merchant: "Pharmacy", amount: "¥4,200" },
  { text: "Send ¥12,000 for electricity bill to Tokyo Power Co. due May 15th.", merchant: "Tokyo Power Co.", amount: "¥12,000" },
];

export default function DemoPage() {
  const [currentStage, setCurrentStage] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const startDemo = useCallback(() => {
    setCurrentStage(-1);
    setIsRunning(true);
    setIsComplete(false);
    let step = 0;
    const interval = setInterval(() => {
      if (step < STAGES.length) {
        setCurrentStage(step);
        step++;
      } else {
        clearInterval(interval);
        setIsRunning(false);
        setIsComplete(true);
      }
    }, 2000);
  }, []);

  useEffect(() => {
    const t = setTimeout(startDemo, 1000);
    return () => clearTimeout(t);
  }, [startDemo]);

  return (
    <div className="min-h-screen pt-32 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        
        <header className="flex justify-between items-end mb-12">
           <div>
              <Link href="/" className="flex items-center gap-2 text-white/30 hover:text-white transition-all text-sm mb-4">
                <ArrowLeft size={16} /> Back to Hub
              </Link>
              <h1 className="text-4xl font-black">Interactive Pipeline</h1>
              <p className="text-white/40">Watch the AI agent orchestrate an analog-to-digital transaction.</p>
           </div>
           <button onClick={startDemo} disabled={isRunning} className="btn-neon flex items-center gap-2">
              {isComplete ? <RotateCcw size={18} /> : <Play size={18} />}
              {isComplete ? "Restart Demo" : "Simulate Fax"}
           </button>
        </header>

        {/* Workflow Visualization */}
        <div className="glass-card p-10 mb-12 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px]" />
           <div className="flex justify-between items-center relative z-10">
              {STAGES.map((stage, i) => {
                const isActive = i <= currentStage;
                const isCurrent = i === currentStage;
                const Icon = stage.icon;
                return (
                  <div key={stage.id} className="flex flex-col items-center gap-4 flex-1">
                     <motion.div
                       animate={isCurrent ? { scale: [1, 1.2, 1], boxShadow: ["0 0 0 0px #00F5FF", "0 0 20px 0px #00F5FF", "0 0 0 0px #00F5FF"] } : {}}
                       className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 ${isActive ? 'bg-neon-gradient shadow-lg' : 'glass opacity-20'}`}
                     >
                        <Icon size={28} className={isActive ? 'text-white' : 'text-white/50'} />
                     </motion.div>
                     <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-white' : 'text-white/20'}`}>{stage.label}</span>
                     {i < STAGES.length - 1 && (
                       <div className="absolute right-[-50%] top-8 w-full h-[2px] bg-white/5 overflow-hidden">
                          <motion.div 
                            initial={{ x: "-100%" }}
                            animate={i < currentStage ? { x: "100%" } : { x: "-100%" }}
                            transition={{ duration: 1 }}
                            className="w-full h-full bg-neon-gradient" 
                          />
                       </div>
                     )}
                  </div>
                )
              })}
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           
           {/* Step 1: Input */}
           <div className="space-y-6">
              <h2 className="text-sm font-black uppercase tracking-widest text-white/30 px-2">Source Input</h2>
              <AnimatePresence>
                 {currentStage >= 0 && (
                   <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card">
                      <div className="bg-white rounded-2xl p-6 text-dark font-medium leading-relaxed min-h-[160px] relative">
                         <div className="absolute top-4 right-4 text-[10px] text-dark/20 font-bold tracking-widest">INC-FAX-8812</div>
                         <div className="text-dark/40 italic mb-4">Handwritten:</div>
                         "{FAX_PREVIEWS[0].text}"
                      </div>
                   </motion.div>
                 )}
              </AnimatePresence>
           </div>

           {/* Step 2: Agent Output */}
           <div className="lg:col-span-2 space-y-6">
              <h2 className="text-sm font-black uppercase tracking-widest text-white/30 px-2 flex items-center gap-2">
                 <TerminalIcon size={16} /> Agent Thought Stream
              </h2>
              <div className="glass rounded-[32px] overflow-hidden border-white/5 min-h-[400px]">
                 <AgentLogTerminal live={isRunning} />
              </div>
           </div>

        </div>

        {/* Status Toast */}
        <AnimatePresence>
           {isComplete && (
             <motion.div 
               initial={{ opacity: 0, y: 50 }} 
               animate={{ opacity: 1, y: 0 }}
               className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50"
             >
                <div className="glass px-8 py-4 rounded-full border-accent-green/30 flex items-center gap-4 shadow-[0_0_30px_rgba(0,255,148,0.2)]">
                   <div className="w-8 h-8 rounded-full bg-accent-green/20 flex items-center justify-center text-accent-green">
                      <CheckCircle size={18} />
                   </div>
                   <span className="text-sm font-bold">Pipeline Successfully Executed on Solana Devnet</span>
                   <button onClick={startDemo} className="text-xs font-black text-primary-neon uppercase hover:underline">Re-Run</button>
                </div>
             </motion.div>
           )}
        </AnimatePresence>

      </div>
    </div>
  );
}
