use anchor_lang::prelude::*;
use anchor_spl::token::{Token, TokenAccount};
use crate::state::*;
use crate::constants::*;
use crate::errors::*;
use crate::events::*;
use crate::utils::cpi_helpers;

#[derive(Accounts)]
pub struct ExecuteTransaction<'info> {
    #[account(
        mut,
        seeds = [SEED_FAX_REQUEST, fax_request.owner.as_ref(), fax_request.intent_hash.as_ref()],
        bump = fax_request.bump,
        constraint = fax_request.is_approved == true @ InktrustError::Unauthorized,
        constraint = fax_request.is_executed == false @ InktrustError::AlreadyExecuted
    )]
    pub fax_request: Account<'info, FaxRequestState>,
    
    #[account(mut)]
    pub owner: Signer<'info>,
    
    /// CHECK: Could be a vendor or another user
    #[account(mut)]
    pub recipient: AccountInfo<'info>,

    #[account(mut)]
    pub owner_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub recipient_token_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<ExecuteTransaction>) -> Result<()> {
    let fax_request = &mut ctx.accounts.fax_request;
    let clock = Clock::get()?;

    if clock.unix_timestamp > fax_request.expires_at {
        return err!(InktrustError::RequestExpired);
    }

    // Perform SPL Token Transfer CPI
    cpi_helpers::transfer_tokens(
        ctx.accounts.owner_token_account.to_account_info(),
        ctx.accounts.recipient_token_account.to_account_info(),
        ctx.accounts.owner.to_account_info(),
        ctx.accounts.token_program.to_account_info(),
        fax_request.amount,
    )?;

    fax_request.is_executed = true;

    emit!(FaxRequestExecuted {
        fax_request: fax_request.key(),
        executor: ctx.accounts.owner.key(),
        amount: fax_request.amount,
        timestamp: clock.unix_timestamp,
    });

    Ok(())
}
