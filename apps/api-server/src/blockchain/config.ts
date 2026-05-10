import { PublicKey } from "@solana/web3.js";

export const PROGRAM_ID = new PublicKey("Ink7777777777777777777777777777777777777777");

export const RPC_URLS = {
  mainnet: process.env.RPC_URL_MAINNET || "https://api.mainnet-beta.solana.com",
  devnet: process.env.RPC_URL_DEVNET || "https://api.devnet.solana.com",
  local: "http://127.0.0.1:8899",
};

export const COMMITMENT = "confirmed";
