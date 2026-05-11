"use client"

import { motion } from "framer-motion"
import { FileText, Globe, Cpu, Users, Shield, Sparkles, ArrowRight, Printer } from "lucide-react"
import Link from "next/link"

const stats = [
  { number: "1.7B", label: "Unbanked adults worldwide" },
  { number: "60%", label: "Of seniors prefer paper-based transactions" },
  { number: "7.5M", label: "Faxes still sent daily in healthcare alone" },
]

const principles = [
  {
    icon: Users,
    title: "Elderly First",
    desc: "Every design decision starts with the question: can grandma use this? If the answer is no, we go back to the drawing board.",
  },
  {
    icon: Cpu,
    title: "AI for Inclusion",
    desc: "Large language models parse messy handwriting, detect intent, and translate analog requests into structured blockchain transactions.",
  },
  {
    icon: Shield,
    title: "Safety by Design",
    desc: "Family approval flows, fraud detection, risk scoring, and encrypted storage ensure every transaction is protected.",
  },
  {
    icon: Globe,
    title: "Open Infrastructure",
    desc: "Built on Solana for low fees and fast settlement. Connected via World ID for verified identity and MoonPay for fiat on-ramps.",
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#faf8f5" }}>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[rgb(25_35_75)] via-[rgb(30_45_90)] to-[rgb(15_22_50)]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, white 2px, transparent 0)`,
          backgroundSize: '50px 50px'
        }} />
        <div className="relative max-w-3xl mx-auto px-6 pt-20 pb-28 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 mb-6">
              <Sparkles size={14} className="text-amber-300" />
              <span className="text-xs font-medium text-white/70">Analog to Onchain Bridge</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
              Bridging the{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-orange-300">
                analog world
              </span>{" "}
              to the digital economy
            </h1>
            <p className="mt-5 text-lg text-white/60 max-w-xl mx-auto leading-relaxed">
              Faxi turns the fax machine — the most enduring analog device — into a gateway for elderly
              financial inclusion on Solana.
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#faf8f5] to-transparent" />
      </section>

      {/* THE PROBLEM */}
      <section className="max-w-3xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-semibold" style={{ color: "rgb(25 35 75)" }}>
            The Problem
          </h2>
          <p className="mt-4 text-base leading-relaxed" style={{ color: "rgb(25 35 75 / 0.6)" }}>
            There are <strong style={{ color: "rgb(25 35 75)" }}>1.7 billion unbanked adults</strong> worldwide.
            A disproportionate number are elderly — people who grew up in an analog world and never made the
            leap to smartphones, apps, or online banking. Many still rely on fax machines for everything from
            medical forms to payment instructions.
          </p>
          <p className="mt-3 text-base leading-relaxed" style={{ color: "rgb(25 35 75 / 0.6)" }}>
            Asking an 80-year-old to install a crypto wallet, manage seed phrases, or use a DeFi app is not
            inclusion — it&apos;s a barrier. The tools of the digital economy are designed for the young and
            tech-native, leaving an entire generation behind.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl p-5 text-center"
              style={{ backgroundColor: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)" }}
            >
              <div className="text-3xl font-bold" style={{ color: "rgb(25 35 75)" }}>{stat.number}</div>
              <div className="text-sm mt-1 leading-snug" style={{ color: "rgb(25 35 75 / 0.5)" }}>{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* THE SOLUTION */}
      <section style={{ backgroundColor: "white" }}>
        <div className="max-w-3xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4" style={{ backgroundColor: "rgb(25 35 75 / 0.06)", color: "rgb(25 35 75)" }}>
              <Cpu size={16} />
              AI-Powered Fax-to-Blockchain Bridge
            </div>
            <h2 className="text-2xl font-semibold" style={{ color: "rgb(25 35 75)" }}>
              The Solution
            </h2>
            <p className="mt-4 text-base leading-relaxed" style={{ color: "rgb(25 35 75 / 0.6)" }}>
              Faxi is an <strong style={{ color: "rgb(25 35 75)" }}>AI-powered fax-to-blockchain bridge</strong> that lets
              seniors interact with the Solana economy using nothing more than a pen and a fax machine.
            </p>
          </motion.div>

          <div className="relative mt-12 rounded-2xl overflow-hidden" style={{ backgroundColor: "#faf8f5" }}>
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="rounded-xl p-3" style={{ backgroundColor: "rgb(25 35 75)" }}>
                  <Printer size={24} className="text-white" />
                </div>
                <ArrowRight size={20} style={{ color: "rgb(25 35 75 / 0.3)" }} />
                <div className="rounded-xl p-3" style={{ backgroundColor: "rgb(59 130 246 / 0.1)" }}>
                  <Cpu size={24} style={{ color: "rgb(59 130 246)" }} />
                </div>
                <ArrowRight size={20} style={{ color: "rgb(25 35 75 / 0.3)" }} />
                <div className="rounded-xl p-3" style={{ backgroundColor: "rgb(139 92 246 / 0.1)" }}>
                  <Globe size={24} style={{ color: "rgb(139 92 246)" }} />
                </div>
              </div>
              <ol className="space-y-4">
                {[
                  { step: "1", label: "Senior writes a request by hand and sends it by fax" },
                  { step: "2", label: "Gemini AI reads the handwriting and extracts intent" },
                  { step: "3", label: "Family approves via World ID or the family dashboard" },
                  { step: "4", label: "Transaction executes on Solana; receipt faxed back" },
                ].map((item) => (
                  <li key={item.step} className="flex items-start gap-3">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold shrink-0 mt-0.5" style={{ backgroundColor: "rgb(25 35 75)", color: "white" }}>
                      {item.step}
                    </span>
                    <span className="text-base" style={{ color: "rgb(25 35 75 / 0.7)" }}>{item.label}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* PRINCIPLES */}
      <section className="max-w-3xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl font-semibold" style={{ color: "rgb(25 35 75)" }}>
            Built on Principles
          </h2>
          <p className="mt-2 text-base" style={{ color: "rgb(25 35 75 / 0.5)" }}>
            Four pillars guide everything we build
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {principles.map((principle, i) => {
            const Icon = principle.icon
            return (
              <motion.div
                key={principle.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl p-6"
                style={{ backgroundColor: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)" }}
              >
                <div className="rounded-xl p-3 inline-flex mb-4" style={{ backgroundColor: "rgb(25 35 75 / 0.06)" }}>
                  <Icon size={22} style={{ color: "rgb(25 35 75)" }} />
                </div>
                <h3 className="text-lg font-semibold" style={{ color: "rgb(25 35 75)" }}>{principle.title}</h3>
                <p className="text-sm mt-2 leading-relaxed" style={{ color: "rgb(25 35 75 / 0.6)" }}>{principle.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* SOLANA RENAISSANCE */}
      <section style={{ backgroundColor: "white" }}>
        <div className="max-w-3xl mx-auto px-6 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4" style={{ backgroundColor: "rgb(25 35 75 / 0.06)", color: "rgb(25 35 75)" }}>
              <Sparkles size={16} />
              Solana Renaissance
            </div>
            <h2 className="text-2xl font-semibold" style={{ color: "rgb(25 35 75)" }}>
              Built for the Solana Renaissance
            </h2>
            <p className="mt-4 text-base leading-relaxed max-w-lg mx-auto" style={{ color: "rgb(25 35 75 / 0.6)" }}>
              Faxi is built for the next chapter of the Solana ecosystem — one that focuses on real-world
              adoption, accessibility, and bridging the gap between traditional infrastructure and
              decentralized finance.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              <Link href="/demo" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-opacity hover:opacity-90" style={{ backgroundColor: "rgb(25 35 75)" }}>
                See the Demo <ArrowRight size={16} />
              </Link>
              <Link href="/help" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm border transition-colors" style={{ borderColor: "rgb(25 35 75 / 0.15)", color: "rgb(25 35 75)" }}>
                View FAQ
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t" style={{ borderColor: "rgb(25 35 75 / 0.06)", backgroundColor: "#faf8f5" }}>
        <div className="max-w-3xl mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg text-white text-xs font-bold" style={{ backgroundColor: "rgb(25 35 75)" }}>
                F
              </div>
              <span className="font-bold" style={{ color: "rgb(25 35 75)" }}>Faxi</span>
            </div>
            <p className="text-xs" style={{ color: "rgb(25 35 75 / 0.3)" }}>
              AI-Powered Analog-to-Onchain Bridge · Built for Solana Renaissance
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
