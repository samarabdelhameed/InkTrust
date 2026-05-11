"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Settings,
  Bell,
  TrendingUp,
  Clock,
  Wallet,
  Shield,
  CreditCard,
  Plus,
  Search,
  Filter,
  MessageSquare,
  History,
  LayoutGrid,
  PieChart
} from "lucide-react";
import { ApprovalCard } from "../../components/ApprovalCard";
import { RiskBadge, RiskScoreBar } from "../../components/RiskBadge";

const initialApprovals = [
  { id: "1", seniorName: "Ahmed", merchant: "Al-Ahli Pharmacy", amount: 4200, intent: "Prescription refill - blood pressure medication", riskScore: 25, timestamp: "10:32 AM" },
  { id: "2", seniorName: "Fatima", merchant: "Carrefour Grocery", amount: 8500, intent: "Weekly grocery delivery order", riskScore: 55, timestamp: "9:15 AM" },
  { id: "3", seniorName: "Mohammed", merchant: "SEPA Electricity", amount: 12000, intent: "Monthly utility bill payment", riskScore: 12, timestamp: "Yesterday" },
  { id: "4", seniorName: "Aisha", merchant: "Al-Noor Medical Center", amount: 15000, intent: "Scheduled doctor consultation & lab tests", riskScore: 78, timestamp: "Yesterday" },
];

export default function FamilyDashboardPage() {
  const [approvals, setApprovals] = useState(initialApprovals);
  const [dailyLimit] = useState(10000);
  const [dailySpend] = useState(4200);

  return (
    <div className="min-h-screen pt-28 pb-12 px-6 flex gap-8 max-w-[1600px] mx-auto">
      
      {/* 1. THIN SIDEBAR */}
      <aside className="hidden lg:flex flex-col gap-8 w-20 items-center py-8 glass rounded-[40px] h-[calc(100vh-140px)] sticky top-28">
         <div className="w-12 h-12 rounded-2xl bg-primary-neon/20 flex items-center justify-center text-primary-neon"><LayoutGrid size={24} /></div>
         <div className="w-12 h-12 rounded-2xl hover:bg-white/5 flex items-center justify-center text-white/30 hover:text-white transition-all cursor-pointer"><PieChart size={24} /></div>
         <div className="w-12 h-12 rounded-2xl hover:bg-white/5 flex items-center justify-center text-white/30 hover:text-white transition-all cursor-pointer"><History size={24} /></div>
         <div className="w-12 h-12 rounded-2xl hover:bg-white/5 flex items-center justify-center text-white/30 hover:text-white transition-all cursor-pointer"><MessageSquare size={24} /></div>
         <div className="mt-auto w-12 h-12 rounded-2xl hover:bg-white/5 flex items-center justify-center text-white/30 hover:text-white transition-all cursor-pointer"><Settings size={24} /></div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 space-y-10">
        
        {/* Welcome & Search */}
        <header className="flex justify-between items-end">
           <div>
              <h1 className="text-4xl font-black mb-2">My Dashboard</h1>
              <p className="text-white/30 text-sm">Managing trust for 5 family members</p>
           </div>
           <div className="flex gap-4">
              <div className="glass px-4 py-2 rounded-2xl flex items-center gap-3 border-white/5">
                 <Search size={18} className="text-white/20" />
                 <input type="text" placeholder="Search transactions..." className="bg-transparent border-none focus:ring-0 text-sm w-48" />
              </div>
              <button className="w-10 h-10 rounded-2xl glass flex items-center justify-center text-white/50"><Filter size={18} /></button>
           </div>
        </header>

        {/* Big Balance Card */}
        <section className="grid grid-cols-12 gap-8">
           <div className="col-span-12 lg:col-span-7 h-80 rounded-[40px] bg-neon-gradient p-10 relative overflow-hidden group shadow-[0_0_50px_rgba(0,245,255,0.2)]">
              <div className="absolute top-[-50%] right-[-10%] w-96 h-96 bg-white/20 rounded-full blur-[100px] group-hover:scale-110 transition-transform duration-1000" />
              <div className="relative z-10 flex flex-col h-full">
                 <div className="text-white/70 text-sm font-bold uppercase tracking-widest mb-2">Total Managed Trust</div>
                 <div className="text-6xl font-black mb-auto">¥1,240,456.50</div>
                 <div className="flex items-center gap-4">
                    <button className="px-8 py-3 rounded-2xl bg-black text-white text-sm font-bold hover:bg-black/80 transition-all">Transfer Funds</button>
                    <button className="px-8 py-3 rounded-2xl bg-white/20 text-white text-sm font-bold backdrop-blur-md border border-white/10 hover:bg-white/30 transition-all">Add Limit</button>
                 </div>
              </div>
           </div>

           <div className="col-span-12 lg:col-span-5 grid grid-rows-2 gap-8">
              <div className="glass-card flex justify-between items-center px-10">
                 <div>
                    <div className="text-white/30 text-[10px] font-bold uppercase mb-1">Weekly Income</div>
                    <div className="text-3xl font-black">+¥24,456</div>
                 </div>
                 <div className="w-14 h-14 rounded-full bg-accent-green/20 flex items-center justify-center text-accent-green"><TrendingUp size={24} /></div>
              </div>
              <div className="glass-card flex justify-between items-center px-10">
                 <div>
                    <div className="text-white/30 text-[10px] font-bold uppercase mb-1">Weekly Expenses</div>
                    <div className="text-3xl font-black">-¥11,124</div>
                 </div>
                 <div className="w-14 h-14 rounded-full bg-accent-pink/20 flex items-center justify-center text-accent-pink"><Clock size={24} /></div>
              </div>
           </div>
        </section>

        {/* Pending Requests */}
        <section className="space-y-6">
           <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black">Pending Requests</h2>
              <RiskBadge level="medium" score={45} />
           </div>
           <div className="grid gap-6">
              <AnimatePresence mode="popLayout">
                {approvals.map((app) => (
                  <ApprovalCard 
                    key={app.id} 
                    {...app} 
                    onApprove={() => setApprovals(p => p.filter(x => x.id !== app.id))}
                    onReject={() => setApprovals(p => p.filter(x => x.id !== app.id))}
                  />
                ))}
              </AnimatePresence>
           </div>
        </section>
      </main>

      {/* 3. RIGHT STATS SIDEBAR */}
      <aside className="hidden xl:flex flex-col gap-8 w-96">
         
         {/* Cards Management */}
         <div className="glass-card overflow-hidden">
            <div className="flex justify-between items-center mb-8">
               <h3 className="font-bold">Family Cards <span className="text-white/20 ml-2">3</span></h3>
               <button className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/50"><Plus size={16} /></button>
            </div>
            
            <div className="relative h-48 mb-8">
               {/* Stacked Cards Effect */}
               <div className="absolute top-0 left-0 w-full h-full rounded-3xl bg-gradient-to-br from-accent-pink to-secondary transform rotate-[-2deg] opacity-50 translate-y-[-10px]" />
               <div className="absolute top-0 left-0 w-full h-full rounded-3xl bg-gradient-to-br from-primary to-primary-neon p-6 shadow-2xl">
                  <div className="flex justify-between items-start mb-10">
                     <div className="w-10 h-6 bg-white/20 rounded" />
                     <div className="text-xs font-bold tracking-widest">VISA</div>
                  </div>
                  <div className="text-xl font-medium tracking-[4px] mb-2">**** **** **** 6902</div>
                  <div className="flex justify-between items-end">
                     <div className="text-[10px] text-white/50">MICKY LARSON</div>
                     <div className="text-[10px] text-white/50">07/25</div>
                  </div>
               </div>
            </div>

            <div className="space-y-4">
               <h4 className="text-[10px] font-bold uppercase text-white/20 tracking-widest">Spending Summary</h4>
               <RiskScoreBar score={45} />
               <div className="grid grid-cols-3 gap-2">
                  <div className="p-3 rounded-2xl bg-white/5 text-center">
                     <div className="text-lg font-black text-accent-green">2</div>
                     <div className="text-[8px] text-white/30 uppercase">Low</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/5 text-center">
                     <div className="text-lg font-black text-accent-orange">1</div>
                     <div className="text-[8px] text-white/30 uppercase">Med</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/5 text-center">
                     <div className="text-lg font-black text-accent-pink">1</div>
                     <div className="text-[8px] text-white/30 uppercase">High</div>
                  </div>
               </div>
            </div>
         </div>

         {/* Subscriptions / Integrations */}
         <div className="glass-card">
            <h3 className="font-bold mb-6">Linked Accounts</h3>
            <div className="space-y-4">
               {[
                 { name: "Medicare App", price: "Active", icon: Shield, color: "bg-accent-green" },
                 { name: "Amazon Pharmacy", price: "Linked", icon: CreditCard, color: "bg-primary-neon" },
                 { name: "System Fax", price: "+18139...", icon: History, color: "bg-accent-pink" }
               ].map((s, i) => (
                 <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-3">
                       <div className={`w-10 h-10 rounded-xl ${s.color}/10 flex items-center justify-center text-white`}><s.icon size={18} /></div>
                       <span className="text-sm font-bold">{s.name}</span>
                    </div>
                    <span className="text-xs font-bold text-white/30">{s.price}</span>
                 </div>
               ))}
            </div>
         </div>

         {/* Alert Center */}
         <div className="glass-card bg-accent-pink/5 border-accent-pink/20">
            <div className="flex items-center gap-3 mb-4 text-accent-pink">
               <Bell size={20} className="animate-bounce" />
               <h3 className="font-bold">Security Alert</h3>
            </div>
            <p className="text-xs text-white/50 leading-relaxed">
               Unusual fax detected from <span className="text-white">Al-Noor Center</span>. Risk score: 78%. Manual approval required.
            </p>
         </div>

      </aside>

    </div>
  );
}
