import type { Metadata } from "next";
import { Inter, Cairo } from "next/font/google";
import { Providers } from "../providers/providers";
import { Navbar } from "../components/Navbar";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const cairo = Cairo({
  subsets: ["arabic"],
  display: "swap",
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  title: "Faxi | AI-Powered Analog-to-Onchain Bridge",
  description:
    "Faxi (InkTrust) transforms handwritten fax requests into blockchain-secured actions. AI-powered analog-to-onchain bridge for elderly financial inclusion.",
  keywords: ["Faxi", "InkTrust", "Solana", "AI", "fax", "blockchain", "elderly care"],
  openGraph: {
    title: "Faxi — Analog to Onchain",
    description: "Transforming handwritten faxes into blockchain-secured actions",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${cairo.variable}`}>
      <body className="min-h-screen bg-[#faf8f5]">
        <Providers>
          <Navbar />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
