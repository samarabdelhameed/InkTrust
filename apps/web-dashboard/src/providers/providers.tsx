"use client";

import { ReactNode } from "react";

// TODO: Import and configure Solana wallet providers
// import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
// import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
// import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
// import { PrivyProvider } from "@privy-io/react-auth";

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Global providers wrapper for the InkTrust dashboard.
 * Configures: Solana RPC connection, wallet adapters (Phantom/Privy),
 * and any global state providers.
 */
export function Providers({ children }: ProvidersProps) {
  // TODO: Configure Helius RPC endpoint
  // const endpoint = process.env.NEXT_PUBLIC_SOLANA_RPC_URL;
  // const network = WalletAdapterNetwork.Devnet;
  // const wallets = [new PhantomWalletAdapter()];

  return (
    <>
      {/* TODO: Wrap with ConnectionProvider, WalletProvider, PrivyProvider */}
      {children}
    </>
  );
}
