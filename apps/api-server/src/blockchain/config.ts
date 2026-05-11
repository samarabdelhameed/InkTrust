import { PublicKey } from "@solana/web3.js";

let _programId: PublicKey;
try {
  _programId = new PublicKey("D8w7y2m9VywSfAMG48dgiroienfrX419wjESVxPyv4sR");
} catch {
  _programId = PublicKey.default;
}
export const PROGRAM_ID = _programId;

export const RPC_URLS = {
  mainnet: process.env.RPC_URL_MAINNET || "https://api.mainnet-beta.solana.com",
  devnet: process.env.RPC_URL_DEVNET || "https://api.devnet.solana.com",
  local: "http://127.0.0.1:8899",
};

export const COMMITMENT = "confirmed";
