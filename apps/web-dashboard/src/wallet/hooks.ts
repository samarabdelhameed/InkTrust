import { useState, useCallback, useEffect } from "react";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";

export const useSolanaWallet = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connect = useCallback(async () => {
    try {
      const { solana } = window as any;
      if (solana?.isPhantom) {
        const response = await solana.connect();
        setWalletAddress(response.publicKey.toString());
        setIsConnected(true);
      } else {
        window.open("https://phantom.app/", "_blank");
      }
    } catch (error) {
      console.error("Connection failed", error);
    }
  }, []);

  const disconnect = useCallback(async () => {
    const { solana } = window as any;
    if (solana) {
      await solana.disconnect();
      setWalletAddress(null);
      setIsConnected(false);
    }
  }, []);

  const signAndSendTransaction = useCallback(async (transaction: Transaction, connection: Connection) => {
    const { solana } = window as any;
    if (!solana) throw new Error("Wallet not found");

    const { signature } = await solana.signAndSendTransaction(transaction);
    await connection.confirmTransaction(signature);
    return signature;
  }, []);

  return {
    walletAddress,
    isConnected,
    connect,
    disconnect,
    signAndSendTransaction,
  };
};
