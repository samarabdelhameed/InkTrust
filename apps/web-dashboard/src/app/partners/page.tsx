"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import {
  Brain,
  Cpu,
  CreditCard,
  Phone,
  Shield,
  Wallet,
  Radio,
  Globe,
  Image,
  Coins,
} from "lucide-react"

const partners = [
  {
    name: "Google Gemini AI",
    description: "Advanced AI for natural language understanding",
    role: "AI intent parsing & circle detection from handwritten faxes",
    icon: Brain,
    color: "#4285F4",
    status: "Live" as const,
  },
  {
    name: "Solana",
    description: "High-performance blockchain network",
    role: "Blockchain layer for secure transaction execution",
    icon: Cpu,
    color: "#9945FF",
    status: "Live" as const,
  },
  {
    name: "MoonPay",
    description: "Fiat-to-crypto payment infrastructure",
    role: "Fiat-to-crypto on-ramp for payment execution",
    icon: CreditCard,
    color: "#7B61FF",
    status: "Live" as const,
  },
  {
    name: "Telnyx",
    description: "Cloud-based fax and communication API",
    role: "Fax API for sending/receiving fax documents",
    icon: Phone,
    color: "#0D1E2C",
    status: "Live" as const,
  },
  {
    name: "Swig",
    description: "Payment approval and policy orchestration",
    role: "Payment approval orchestration & policy management",
    icon: Shield,
    color: "#00BFA5",
    status: "Live" as const,
  },
  {
    name: "Privy",
    description: "Embedded wallet and auth infrastructure",
    role: "Embedded wallet infrastructure for seamless auth",
    icon: Wallet,
    color: "#FF6B6B",
    status: "Live" as const,
  },
  {
    name: "Helius",
    description: "Solana RPC and webhook platform",
    role: "Solana RPC & webhook infrastructure",
    icon: Radio,
    color: "#34D399",
    status: "Live" as const,
  },
  {
    name: "World ID",
    description: "Decentralized identity and verification",
    role: "Sybil resistance & human verification for approvals",
    icon: Globe,
    color: "#2D2D2D",
    status: "Integrated" as const,
  },
  {
    name: "Metaplex",
    description: "NFT and digital asset framework",
    role: "NFT-based action representation (Blinks)",
    icon: Image,
    color: "#E84142",
    status: "Integrated" as const,
  },
  {
    name: "Coinbase CDP",
    description: "Developer platform for on-chain agents",
    role: "Developer platform for on-chain agents",
    icon: Coins,
    color: "#0052FF",
    status: "Integrated" as const,
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
}

export default function PartnersPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#faf8f5" }}>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h1
            className="text-4xl font-bold tracking-tight sm:text-5xl"
            style={{ color: "rgb(25 35 75)" }}
          >
            Partners & Integrations
          </h1>
          <p
            className="mx-auto mt-4 max-w-2xl text-lg"
            style={{ color: "rgb(25 35 75 / 0.6)" }}
          >
            The services powering{" "}
            <span className="font-semibold" style={{ color: "rgb(25 35 75)" }}>
              Faxi (InkTrust)
            </span>
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {partners.map((partner) => {
            const Icon = partner.icon
            return (
              <motion.div
                key={partner.name}
                variants={cardVariants}
                className="group relative overflow-hidden rounded-2xl border p-6 transition-shadow hover:shadow-lg"
                style={{
                  backgroundColor: "#ffffff",
                  borderColor: "rgb(25 35 75 / 0.08)",
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                    style={{ backgroundColor: `${partner.color}14` }}
                  >
                    <Icon
                      className="h-6 w-6"
                      style={{ color: partner.color }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3
                        className="text-lg font-semibold"
                        style={{ color: "rgb(25 35 75)" }}
                      >
                        {partner.name}
                      </h3>
                      <span
                        className="inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                        style={{
                          backgroundColor:
                            partner.status === "Live"
                              ? "rgb(34 197 94 / 0.1)"
                              : "rgb(234 179 8 / 0.1)",
                          color:
                            partner.status === "Live"
                              ? "rgb(22 163 74)"
                              : "rgb(161 98 7)",
                        }}
                      >
                        {partner.status}
                      </span>
                    </div>
                    <p
                      className="mt-1 text-sm"
                      style={{ color: "rgb(25 35 75 / 0.6)" }}
                    >
                      {partner.description}
                    </p>
                    <p
                      className="mt-2 text-sm font-medium"
                      style={{ color: "rgb(25 35 75 / 0.8)" }}
                    >
                      {partner.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-12 text-center text-sm"
          style={{ color: "rgb(25 35 75 / 0.4)" }}
        >
          Interested in integrating with Faxi?{" "}
          <Link
            href="/help"
            className="font-medium underline underline-offset-2 transition-opacity hover:opacity-70"
            style={{ color: "rgb(25 35 75)" }}
          >
            Get in touch
          </Link>
        </motion.p>
      </div>
    </div>
  )
}
