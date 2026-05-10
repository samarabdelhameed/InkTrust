use anchor_lang::prelude::*;

#[event]
pub struct FaxRequestCreated {
    pub fax_request: Pubkey,
    pub owner: Pubkey,
    pub caregiver: Pubkey,
    pub amount: u64,
    pub intent_hash: [u8; 32],
    pub timestamp: i64,
}

#[event]
pub struct FaxRequestApproved {
    pub fax_request: Pubkey,
    pub approver: Pubkey,
    pub timestamp: i64,
}

#[event]
pub struct FaxRequestExecuted {
    pub fax_request: Pubkey,
    pub executor: Pubkey,
    pub amount: u64,
    pub timestamp: i64,
}

#[event]
pub struct PolicyRejected {
    pub fax_request: Pubkey,
    pub reason: String,
    pub timestamp: i64,
}

#[event]
pub struct NonceInitialized {
    pub nonce_account: Pubkey,
    pub owner: Pubkey,
}
