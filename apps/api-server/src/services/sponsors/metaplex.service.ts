import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { create, fetchAsset } from "@metaplex-foundation/mpl-core";
import { generateSigner, signerIdentity, type PublicKey } from "@metaplex-foundation/umi";
import { env } from "../../config/env";
import { logger } from "../../utils/logger";

export class MetaplexService {
  private umi: any;

  constructor() {
    this.umi = createUmi(env.SOLANA_RPC_URL);
    const mySigner = generateSigner(this.umi);
    this.umi.use(signerIdentity(mySigner));
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

export const metaplexService = new MetaplexService();
