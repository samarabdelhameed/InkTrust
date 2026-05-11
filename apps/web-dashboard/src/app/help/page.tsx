"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, FileText, Shield, Send, Users, Lock, HelpCircle } from "lucide-react"
import Link from "next/link"

const faqs = [
  {
    icon: HelpCircle,
    question: "How does it work?",
    answer:
      "You write a request on paper — like a check or a note — and send it by fax to Faxi. Our AI reads your handwriting, figures out what you need (like paying a bill or sending money), and processes it securely on the blockchain. A receipt gets faxed back to you automatically.",
  },
  {
    icon: Shield,
    question: "Is it safe?",
    answer:
      "Yes. Your request is reviewed by AI for fraud detection and can also be approved by a family member before anything happens. All transactions are recorded on the Solana blockchain, which is tamper-proof and transparent. Your handwritten fax is the only password you need.",
  },
  {
    icon: Send,
    question: "How do I send a fax?",
    answer:
      "You can use any fax machine or a mobile fax app. Just write your request clearly on a piece of paper — include the recipient, the amount, and what it's for — and fax it to the number Faxi provides. We'll handle the rest.",
  },
  {
    icon: Users,
    question: "How does my family approve?",
    answer:
      "When you send a fax request, your family gets a notification on their phone or computer. They can see what you requested, review a risk score, and approve it with one tap. You can also set it up so certain requests (like small amounts) go through automatically.",
  },
  {
    icon: Lock,
    question: "What about privacy?",
    answer:
      "Your fax is scanned only to extract the request details. The image is encrypted and stored securely. Family members only see what you approved them to see. We never sell or share your data. Think of it like a digital safe where only you and your chosen family have the keys.",
  },
]

function FaqItem({ faq, index }: { faq: (typeof faqs)[0]; index: number }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut", delay: 0.1 + index * 0.06 }}
      className="rounded-2xl overflow-hidden"
      style={{ backgroundColor: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)" }}
    >
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex items-center gap-4 p-5 text-left transition-colors hover:bg-[rgb(25_35_75_/_0.02)]"
      >
        <div className="rounded-xl p-3 shrink-0" style={{ backgroundColor: "rgb(25 35 75 / 0.06)" }}>
          <faq.icon size={24} style={{ color: "rgb(25 35 75)" }} />
        </div>
        <span className="flex-1 text-lg font-medium leading-snug" style={{ color: "rgb(25 35 75)" }}>
          {faq.question}
        </span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0"
          style={{ color: "rgb(25 35 75 / 0.4)" }}
        >
          <ChevronDown size={22} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pl-[4.5rem]">
              <p className="text-base leading-relaxed" style={{ color: "rgb(25 35 75 / 0.6)" }}>
                {faq.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function HelpPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#faf8f5" }}>
      <div className="max-w-2xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mb-10"
        >
          <Link href="/" className="inline-flex items-center gap-2 text-sm" style={{ color: "rgb(25 35 75 / 0.5)" }}>
            <FileText size={20} />
            Faxi
          </Link>
          <h1 className="text-3xl font-bold mt-3" style={{ color: "rgb(25 35 75)" }}>
            Help & FAQ
          </h1>
          <p className="text-base mt-1" style={{ color: "rgb(25 35 75 / 0.5)" }}>
            Everything you need to know about using Faxi
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <FaqItem key={i} faq={faq} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 rounded-2xl p-6 text-center"
          style={{ backgroundColor: "rgb(25 35 75 / 0.04)" }}
        >
          <p className="text-base font-medium" style={{ color: "rgb(25 35 75)" }}>
            Still have questions?
          </p>
          <p className="text-sm mt-1" style={{ color: "rgb(25 35 75 / 0.5)" }}>
            Your family member or caregiver can help, or visit the{" "}
            <Link href="/about" className="underline hover:opacity-70">
              About page
            </Link>{" "}
            to learn more.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
