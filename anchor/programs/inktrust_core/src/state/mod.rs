use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct FaxRequestState {
    pub owner: Pubkey,
    pub caregiver_pubkey: Pubkey,
    pub amount: u64,
    pub intent_hash: [u8; 32],
    pub is_approved: bool,
    pub is_executed: bool,
    pub created_at: i64,
    pub expires_at: i64,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct ApprovalState {
    pub fax_request: Pubkey,
    pub approver: Pubkey,
    pub timestamp: i64,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct NonceState {
    pub owner: Pubkey,
    pub nonce_account: Pubkey,
    pub bump: u8,
}
