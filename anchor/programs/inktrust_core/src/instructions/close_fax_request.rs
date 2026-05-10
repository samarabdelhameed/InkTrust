use anchor_lang::prelude::*;
use crate::state::*;
use crate::constants::*;

#[derive(Accounts)]
pub struct CloseFaxRequest<'info> {
    #[account(
        mut,
        seeds = [SEED_FAX_REQUEST, fax_request.owner.as_ref(), fax_request.intent_hash.as_ref()],
        bump = fax_request.bump,
        close = owner,
        constraint = fax_request.owner == owner.key()
    )]
    pub fax_request: Account<'info, FaxRequestState>,
    
    #[account(mut)]
    pub owner: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

pub fn handler(_ctx: Context<CloseFaxRequest>) -> Result<()> {
    Ok(())
}
