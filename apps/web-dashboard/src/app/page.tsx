"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Shield, Users, Cpu, ChevronDown } from "lucide-react";
import { AgentLogTerminal } from "../components/AgentLogTerminal";

const personas = [
  {
    icon: Users,
    title: "For Seniors",
    desc: "Send handwritten fax requests — no apps, no passwords, no blockchain. Just write and send.",
    color: "from-blue-500 to-indigo-500",
    href: "/senior",
  },
  {
    icon: Shield,
    title: "For Families",
    desc: "Review and approve requests from a simple dashboard. Set spending rules and get notified instantly.",
    color: "from-green-500 to-emerald-500",
    href: "/family",
  },
  {
    icon: Cpu,
    title: "For the System",
    desc: "AI agents parse intent, assess risk, execute on Solana, and fax back receipts — fully autonomous.",
    color: "from-purple-500 to-pink-500",
    href: "/admin",
  },
];

const steps = [
  { num: "01", title: "Senior writes & faxes", desc: "Handwritten request sent via any fax machine or mobile fax app." },
  { num: "02", title: "AI parses intent", desc: "Gemini extracts merchant, amount, and urgency. Circle detection identifies the family." },
  { num: "03", title: "Family approves", desc: "Caregiver reviews risk score and approves with World ID + Solana wallet." },
  { num: "04", title: "On-chain execution", desc: "Payment is executed via Swig/MoonPay. Receipt is faxed back automatically." },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[rgb(25_35_75)] via-[rgb(30_45_90)] to-[rgb(15_22_50)]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, white 2px, transparent 0)`,
          backgroundSize: '50px 50px'
        }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 mb-6">
              <Sparkles size={14} className="text-amber-300" />
              <span className="text-xs font-medium text-white/70">Analog to Onchain Bridge</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight text-balance">
              Turn handwritten faxes into{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">
                blockchain-secured
              </span>{" "}
              actions
            </h1>
            <p className="mt-6 text-lg text-white/60 max-w-xl leading-relaxed">
              Faxi bridges the analog world to Solana. Seniors send fax requests, AI interprets them,
              families approve with one click, and payments execute automatically on-chain.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link href="/demo" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-[rgb(25_35_75)] font-semibold text-sm hover:shadow-xl hover:shadow-white/10 transition-all">
                See Live Demo
                <ArrowRight size={16} />
              </Link>
              <Link href="/family" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/20 text-white font-medium text-sm hover:bg-white/5 transition-all">
                Family Dashboard
              </Link>
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#faf8f5] to-transparent" />
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-[rgb(25_35_75)]">How It Works</h2>
          <p className="mt-4 text-[rgb(25_35_75_/_0.6)] max-w-lg mx-auto">
            Four simple steps from handwritten fax to on-chain execution
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative bg-white rounded-xl border border-[rgb(25_35_75_/_0.06)] p-6 card-hover"
            >
              <span className="text-4xl font-bold text-[rgb(25_35_75_/_0.06)]">{step.num}</span>
              <h3 className="mt-2 font-semibold text-[rgb(25_35_75)]">{step.title}</h3>
              <p className="mt-2 text-sm text-[rgb(25_35_75_/_0.5)] leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PERSONA CARDS */}
      <section className="bg-white/50 border-y border-[rgb(25_35_75_/_0.04)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-[rgb(25_35_75)]">Built for Everyone</h2>
            <p className="mt-4 text-[rgb(25_35_75_/_0.6)] max-w-lg mx-auto">
              Three user experiences, one unified system
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {personas.map((persona, i) => {
              const Icon = persona.icon;
              return (
                <motion.div
                  key={persona.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={persona.href}
                    className="block bg-white rounded-xl border border-[rgb(25_35_75_/_0.06)] p-8 card-hover h-full"
                  >
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${persona.color} flex items-center justify-center mb-5`}>
                      <Icon size={24} className="text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-[rgb(25_35_75)] mb-2">{persona.title}</h3>
                    <p className="text-sm text-[rgb(25_35_75_/_0.5)] leading-relaxed mb-4">{persona.desc}</p>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-[rgb(25_35_75)]">
                      Learn more <ArrowRight size={14} />
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* LIVE DEMO PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-[rgb(25_35_75)]">See It In Action</h2>
          <p className="mt-4 text-[rgb(25_35_75_/_0.6)] max-w-lg mx-auto">
            Watch AI agents process a fax request in real-time
          </p>
        </motion.div>

        <AgentLogTerminal />

        <div className="text-center mt-8">
          <Link href="/demo" className="btn-primary">
            Full Interactive Demo <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[rgb(25_35_75)] to-[rgb(15_22_50)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Ready to Bridge the Analog World?
            </h2>
            <p className="mt-4 text-white/60 max-w-md mx-auto">
              Explore the full system — from fax input to on-chain approval
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              <Link href="/demo" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-[rgb(25_35_75)] font-semibold text-sm hover:shadow-xl transition-all">
                Start Demo <ArrowRight size={16} />
              </Link>
              <Link href="/partners" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/20 text-white font-medium text-sm hover:bg-white/5 transition-all">
                View Partners
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[rgb(15_22_50)] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white text-xs font-bold">
                F
              </div>
              <span className="text-white font-bold">Faxi</span>
            </div>
            <p className="text-xs text-white/30">
              Built for Solana Renaissance · AI-Powered Analog-to-Onchain Bridge
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
