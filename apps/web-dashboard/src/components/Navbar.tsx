"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/senior", label: "Senior Service" },
  { href: "/family", label: "Family Dashboard" },
  { href: "/partners", label: "Partners" },
  { href: "/demo", label: "Live Demo" },
  { href: "/help", label: "Help" },
  { href: "/about", label: "About" },
  { href: "/admin", label: "System", isAdmin: true },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[rgb(25_35_75_/_0.06)] bg-[#faf8f5]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[rgb(25_35_75)] text-white text-sm font-bold group-hover:shadow-lg transition-shadow">
            F
          </div>
          <span className="text-xl font-bold tracking-tight text-[rgb(25_35_75)]">
            Faxi
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                pathname === link.href
                  ? "text-[rgb(25_35_75)] bg-[rgb(25_35_75_/_0.06)]"
                  : "text-[rgb(25_35_75_/_0.6)] hover:text-[rgb(25_35_75)] hover:bg-[rgb(25_35_75_/_0.04)]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/demo" className="btn-primary text-sm !py-2 !px-5">
            Try Demo
          </Link>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-lg text-[rgb(25_35_75)] hover:bg-[rgb(25_35_75_/_0.06)] transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-[rgb(25_35_75_/_0.06)] bg-white overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? "text-[rgb(25_35_75)] bg-[rgb(25_35_75_/_0.06)]"
                      : "text-[rgb(25_35_75_/_0.6)] hover:text-[rgb(25_35_75)] hover:bg-[rgb(25_35_75_/_0.04)]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/demo"
                onClick={() => setMobileOpen(false)}
                className="btn-primary text-sm !py-2.5 !px-5 w-full text-center mt-3"
              >
                Try Demo
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
