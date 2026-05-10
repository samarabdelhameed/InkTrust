use anchor_lang::prelude::*;

pub mod constants;
pub mod errors;
pub mod events;
pub mod instructions;
pub mod state;
pub mod utils;

use instructions::*;

declare_id!("D8w7y2m9VywSfAMG48dgiroienfrX419wjESVxPyv4sR");

#[program]
pub mod inktrust_core {
    use super::*;

    pub fn create_fax_request(
        ctx: Context<CreateFaxRequest>, 
        amount: u64, 
        intent_hash: [u8; 32], 
        expires_at: i64
    ) -> Result<()> {
        instructions::create_fax_request::handler(ctx, amount, intent_hash, expires_at)
    }

    pub fn approve_fax_request(ctx: Context<ApproveFaxRequest>) -> Result<()> {
        instructions::approve_fax_request::handler(ctx)
    }

    pub fn execute_transaction(ctx: Context<ExecuteTransaction>) -> Result<()> {
        instructions::execute_transaction::handler(ctx)
    }

    pub fn close_fax_request(ctx: Context<CloseFaxRequest>) -> Result<()> {
        instructions::close_fax_request::handler(ctx)
    }

    pub fn initialize_nonce(ctx: Context<InitializeNonce>) -> Result<()> {
        instructions::initialize_nonce::handler(ctx)
    }

    pub fn multisig_approval(
        ctx: Context<MultisigApproval>, 
        threshold: u8, 
        approvals_count: u8
    ) -> Result<()> {
        instructions::multisig_approval::handler(ctx, threshold, approvals_count)
    }

    pub fn validate_policy(
        ctx: Context<PolicyValidation>, 
        daily_limit: u64, 
        current_total: u64
    ) -> Result<()> {
        instructions::policy_validation::handler(ctx, daily_limit, current_total)
    }
}
