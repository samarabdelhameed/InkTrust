use anchor_lang::prelude::*;

/// On-chain state for a fax request.
/// Each fax from a senior creates a PDA that tracks the request lifecycle:
/// PENDING → APPROVED → EXECUTED → CLOSED
///
/// Seeds: ["fax_request", owner_pubkey, timestamp]
#[account]
#[derive(InitSpace)]
pub struct FaxRequestState {
    /// The senior's embedded wallet (Privy) — owner of the request.
    pub owner: Pubkey,              // 32 bytes

    /// The designated caregiver who can approve this request.
    pub caregiver: Pubkey,          // 32 bytes

    /// The transaction amount in lamports.
    pub amount: u64,                // 8 bytes

    /// Whether the caregiver has approved the request.
    pub is_approved: bool,          // 1 byte

    /// Whether the purchase has been executed.
    pub is_executed: bool,          // 1 byte

    /// Encrypted hash of the fax request details (medication name, etc.)
    /// Encrypted via Arcium for on-chain privacy.
    pub intent_hash: [u8; 32],      // 32 bytes

    /// Unix timestamp when the request was created.
    pub created_at: i64,            // 8 bytes

    /// PDA bump seed for deterministic address derivation.
    pub bump: u8,                   // 1 byte
}
// Total: 32 + 32 + 8 + 1 + 1 + 32 + 8 + 1 = 115 bytes + 8 (discriminator) = 123 bytes
