import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { createCore, fetchAsset } from "@metaplex-foundation/mpl-core";
import { generateSigner, signerIdentity } from "@metaplex-foundation/umi";
import { env } from "../../lib/env";
import { logger } from "../../lib/logger";

export class MetaplexService {
  private umi: any;

  constructor() {
    this.umi = createUmi(env.SOLANA_RPC_URL);
    // In production, we'd use a real keypair
    const mySigner = generateSigner(this.umi);
    this.umi.use(signerIdentity(mySigner));
  }

  async registerAgentAsNFT(agentId: string, metadata: any) {
    try {
      const asset = generateSigner(this.umi);
      await createCore(this.umi, {
        asset,
        name: `Faxi Agent: ${agentId}`,
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

export const metaplexService = new MetaplexService();
