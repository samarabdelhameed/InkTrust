import type { Metadata } from "next";
import { Providers } from "../providers/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "InkTrust — Caregiver Dashboard",
  description:
    "Monitor fax requests, approve transactions, and manage spending policies for elderly family members. Powered by Solana.",
  keywords: ["InkTrust", "Solana", "caregiver", "elderly care", "blockchain"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
