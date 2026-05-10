use anchor_lang::prelude::*;
use crate::state::*;
use crate::constants::*;
use crate::errors::*;
use crate::events::*;

#[derive(Accounts)]
pub struct PolicyValidation<'info> {
    #[account(
        seeds = [SEED_FAX_REQUEST, fax_request.owner.as_ref(), fax_request.intent_hash.as_ref()],
        bump = fax_request.bump,
    )]
    pub fax_request: Account<'info, FaxRequestState>,
    
    pub authority: Signer<'info>,
}

pub fn handler(ctx: Context<PolicyValidation>, daily_limit: u64, current_total: u64) -> Result<()> {
    let fax_request = &ctx.accounts.fax_request;
    
    if current_total + fax_request.amount > daily_limit {
        emit!(PolicyRejected {
            fax_request: fax_request.key(),
            reason: "Daily limit exceeded".to_string(),
            timestamp: Clock::get()?.unix_timestamp,
        });
        return err!(InktrustError::PolicyViolation);
    }
    
    Ok(())
}
