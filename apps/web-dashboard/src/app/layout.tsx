import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "InkTrust | Analog-to-Onchain AI Bridge",
  description: "Bridges handwritten faxes to Solana via AI agents and World ID.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="fixed inset-0 pointer-events-none z-0">
           <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px]" />
           <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/20 blur-[120px]" />
        </div>
        <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center p-6">
          <div className="glass px-8 py-4 rounded-full flex items-center gap-12">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-neon-gradient flex items-center justify-center font-bold text-xs">I</div>
              <span className="font-bold tracking-tight text-xl">InkTrust</span>
            </Link>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
              <Link href="/#platform" className="hover:text-primary-neon transition-colors">Platform</Link>
              <Link href="/#ai" className="hover:text-primary-neon transition-colors">AI Agents</Link>
              <Link href="/#solana" className="hover:text-primary-neon transition-colors">Solana</Link>
              <Link href="/docs" className="hover:text-primary-neon transition-colors">Docs</Link>
            </div>
            <Link href="/demo" className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-all text-xs font-bold border border-white/10">
              Launch App
            </Link>
          </div>
        </nav>
        <main className="relative z-10">{children}</main>
      </body>
    </html>
  );
}
