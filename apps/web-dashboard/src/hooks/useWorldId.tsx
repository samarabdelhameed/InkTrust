"use client";

import { useCallback, useState } from "react";
import { IDKitWidget, VerificationLevel } from "@worldcoin/idkit";

interface WorldIdVerification {
  merkle_root: string;
  nullifier_hash: string;
  proof: string;
  verification_level: string;
}

export function useWorldId() {
  const [isVerified, setIsVerified] = useState(false);
  const [verification, setVerification] = useState<WorldIdVerification | null>(null);

  const handleVerify = useCallback(
    async (proof: WorldIdVerification) => {
      setVerification(proof);
      setIsVerified(true);

      const res = await fetch("/api/v1/auth/verify-world-id", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "current-user-id",
          ...proof,
        }),
      });

      if (!res.ok) {
        setIsVerified(false);
        throw new Error("World ID verification failed on server");
      }
    },
    [],
  );

  return {
    isVerified,
    verification,
    IDKitWidget: ({ children }: { children: React.ReactNode }) => (
      <IDKitWidget
        appId={process.env.NEXT_PUBLIC_WORLD_ID_APP_ID || ""}
        action={process.env.NEXT_PUBLIC_WORLD_ID_ACTION || "verify_caregiver_action"}
        verificationLevel={VerificationLevel.Orb}
        handleVerify={handleVerify}
      >
        {({ open }: { open: () => void }) => (
          <div onClick={open}>{children}</div>
        )}
      </IDKitWidget>
    ),
  };
}
