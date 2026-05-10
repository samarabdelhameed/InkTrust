import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { create } from "@metaplex-foundation/mpl-core";
import { createSignerFromKeypair, generateSigner, signerIdentity, publicKey as toUmiPublicKey, type PublicKey, type Umi } from "@metaplex-foundation/umi";
import { env } from "../../config/env";
import { logger } from "../../utils/logger";

export class MetaplexService {
  private umi: Umi;

  constructor() {
    this.umi = createUmi(env.SOLANA_RPC_URL);
    const signer = loadAgentSigner(this.umi);
    if (signer) {
      this.umi.use(signerIdentity(signer));
    }
  }

  async registerAgentAsNFT(agentId: string, metadata: any): Promise<PublicKey> {
    try {
      const asset = generateSigner(this.umi);
      await create(this.umi, {
        asset,
        name: `InkTrust Agent: ${agentId}`,
        uri: metadata.uri || "https://inktrust.io/agent-metadata.json",
      }).sendAndConfirm(this.umi);

      logger.info({ asset: asset.publicKey }, "Agent registered as Metaplex Core NFT");
      return asset.publicKey;
    } catch (error) {
      logger.error({ err: error }, "Metaplex Agent registration failed");
      throw error;
    }
  }
}

function loadAgentSigner(umi: Umi) {
  const hex = env.AGENT_PRIVATE_KEY;
  if (!hex) return null;
  try {
    const bytes = Buffer.from(hex, "hex");
    const pubkeyBytes = bytes.subarray(32, 64);
    const keypair = {
      publicKey: toUmiPublicKey(new Uint8Array(pubkeyBytes)),
      secretKey: new Uint8Array(bytes),
    };
    return createSignerFromKeypair(umi, keypair);
  } catch {
    logger.warn("Failed to parse AGENT_PRIVATE_KEY for Metaplex");
    return null;
  }
}

export const metaplexService = new MetaplexService();
