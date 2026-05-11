"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Book, FileText, Code, Shield } from "lucide-react";
import Link from "next/link";

export default function DocsPage() {
  return (
    <div className="min-h-screen pt-32 pb-12 px-6 max-w-4xl mx-auto">
      <Link href="/" className="flex items-center gap-2 text-white/30 hover:text-white transition-all text-sm mb-12">
        <ArrowLeft size={16} /> Back to Hub
      </Link>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-5xl font-black mb-6">Documentation</h1>
        <p className="text-xl text-white/40 mb-16 leading-relaxed">
          The technical architecture behind InkTrust — the bridge between analog faxes and the Solana blockchain.
        </p>

        <div className="grid gap-8">
           {[
             { title: "Fax Ingestion Protocol", icon: FileText, desc: "How handwritten faxes are converted into digital signals using Telnyx and S3." },
             { title: "Gemini 2.0 Agentic OCR", icon: Book, desc: "The AI logic used to extract merchant, amount, and intent from handwritten text." },
             { title: "Solana Action Blinks", icon: Code, desc: "Integration of Dialect Blinks for seamless one-click caregiver authorization." },
             { title: "Trust & Security", icon: Shield, desc: "Details on PDA derivation, multi-sig guards, and World ID verification." }
           ].map((doc, i) => (
             <div key={i} className="glass-card flex gap-6 items-center hover:border-primary-neon/30 cursor-pointer">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-primary-neon">
                   <doc.icon size={24} />
                </div>
                <div>
                   <h3 className="text-xl font-bold mb-1">{doc.title}</h3>
                   <p className="text-sm text-white/30">{doc.desc}</p>
                </div>
             </div>
           ))}
        </div>
      </motion.div>
    </div>
  );
}
