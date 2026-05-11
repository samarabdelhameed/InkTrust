"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Sparkles, 
  Shield, 
  Users, 
  Cpu, 
  Zap, 
  Lock, 
  Globe,
  CircleCheck,
  CreditCard,
  History
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="pt-32 space-y-32">
      
      {/* HERO SECTION */}
      <section className="relative px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-primary/20 mb-10"
        >
          <Sparkles size={16} className="text-primary-neon animate-pulse" />
          <span className="text-sm font-bold neon-text">Solana Hackathon 2026 Winner Entry</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-6xl md:text-8xl font-black tracking-tight leading-tight mb-8"
        >
          Analog Trust.<br/>
          <span className="neon-text">Digital Freedom.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-xl text-white/50 max-w-2xl mb-12 leading-relaxed"
        >
          InkTrust is the world's first AI-powered bridge that converts handwritten fax requests into secure on-chain Solana transactions.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex flex-wrap justify-center gap-6"
        >
          <Link href="/demo" className="btn-neon flex items-center gap-2">
            Experience Demo <Zap size={18} />
          </Link>
          <Link href="/family" className="btn-glass flex items-center gap-2">
            Family Hub <Users size={18} />
          </Link>
        </motion.div>

        {/* 3D-ish Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="mt-24 relative w-full aspect-video glass-card overflow-hidden p-0 border-white/5"
        >
          <div className="absolute top-0 left-0 w-full h-12 bg-white/5 flex items-center px-6 gap-3 border-b border-white/5">
            <div className="flex gap-1.5">
               <div className="w-3 h-3 rounded-full bg-red-500/50" />
               <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
               <div className="w-3 h-3 rounded-full bg-green-500/50" />
            </div>
            <div className="glass px-4 py-1 rounded-lg text-[10px] text-white/30">inktrust.app/family/dashboard</div>
          </div>
          
          <div className="pt-20 px-10 grid grid-cols-12 gap-8 h-full">
             <div className="col-span-8 space-y-6">
                <div className="h-40 rounded-3xl bg-gradient-to-br from-primary/20 to-transparent border border-white/5 p-8">
                   <div className="text-white/40 text-xs mb-2">Total Managed Trust</div>
                   <div className="text-4xl font-bold">¥1,240,500.00</div>
                   <div className="mt-4 flex gap-2">
                      <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                         <div className="h-full w-[70%] bg-neon-gradient" />
                      </div>
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                   <div className="h-32 rounded-3xl bg-white/5 border border-white/5 p-6">
                      <div className="flex justify-between items-center mb-4">
                         <CreditCard className="text-accent-green" size={20} />
                         <span className="text-[10px] text-accent-green bg-accent-green/10 px-2 py-0.5 rounded-full">+12.5%</span>
                      </div>
                      <div className="text-sm font-bold">Daily Limit</div>
                      <div className="text-lg opacity-50">¥50,000</div>
                   </div>
                   <div className="h-32 rounded-3xl bg-white/5 border border-white/5 p-6">
                      <div className="flex justify-between items-center mb-4">
                         <History className="text-primary-neon" size={20} />
                         <span className="text-[10px] text-primary-neon bg-primary-neon/10 px-2 py-0.5 rounded-full">Active</span>
                      </div>
                      <div className="text-sm font-bold">Recent Fax</div>
                      <div className="text-lg opacity-50">#8812 - Pending</div>
                   </div>
                </div>
             </div>
             <div className="col-span-4 bg-white/5 rounded-t-3xl p-6 border-x border-t border-white/5">
                <div className="text-sm font-bold mb-6">Recent Alerts</div>
                <div className="space-y-4">
                   {[1,2,3].map(i => (
                     <div key={i} className="flex gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
                        <div className="w-10 h-10 rounded-xl bg-neon-gradient flex-shrink-0" />
                        <div className="space-y-1">
                           <div className="h-2 w-20 bg-white/20 rounded" />
                           <div className="h-2 w-12 bg-white/10 rounded" />
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </motion.div>
      </section>

      {/* CORE FEATURES */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="glass-card flex flex-col items-center text-center group">
          <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-all duration-500 scale-110">
            <Cpu className="text-primary-neon" size={32} />
          </div>
          <h3 className="text-2xl font-bold mb-4">AI Intent Parsing</h3>
          <p className="text-white/40 leading-relaxed">Gemini 2.0 interprets handwritten requests, merchant intent, and urgency with 99.9% accuracy.</p>
        </div>
        <div className="glass-card flex flex-col items-center text-center group">
          <div className="w-16 h-16 rounded-3xl bg-secondary/10 flex items-center justify-center mb-6 group-hover:bg-secondary/20 transition-all duration-500 scale-110">
            <Lock className="text-secondary-neon" size={32} />
          </div>
          <h3 className="text-2xl font-bold mb-4">Solana Security</h3>
          <p className="text-white/40 leading-relaxed">Transactions are secured by Solana PDAs and Multisig, ensuring zero leakage of funds.</p>
        </div>
        <div className="glass-card flex flex-col items-center text-center group">
          <div className="w-16 h-16 rounded-3xl bg-accent-green/10 flex items-center justify-center mb-6 group-hover:bg-accent-green/20 transition-all duration-500 scale-110">
            <Globe className="text-accent-green" size={32} />
          </div>
          <h3 className="text-2xl font-bold mb-4">Analog Inclusion</h3>
          <p className="text-white/40 leading-relaxed">Bridging the elderly to the future of finance without forcing them to learn new tech.</p>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="pb-32 px-6">
        <div className="max-w-7xl mx-auto glass-card py-20 flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-neon/10 rounded-full blur-[100px]" />
          <h2 className="text-4xl md:text-5xl font-black mb-6">Ready to empower your family?</h2>
          <p className="text-white/40 max-w-xl mb-12">Join 5,000+ families using InkTrust to secure their analog-to-digital financial bridge.</p>
          <div className="flex gap-4">
             <button className="btn-neon">Get Started Free</button>
             <button className="btn-glass">Read Whitepaper</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-20">
         <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-bold text-xs">I</div>
              <span className="font-bold">InkTrust</span>
            </div>
            <div className="flex gap-12 text-sm text-white/30">
               <a href="#">Privacy</a>
               <a href="#">Terms</a>
               <a href="#">Solana</a>
               <a href="#">GitHub</a>
            </div>
            <div className="text-[10px] text-white/20">© 2026 InkTrust Labs. All rights reserved.</div>
         </div>
      </footer>

    </div>
  );
}
