use anchor_lang::prelude::*;
use crate::state::*;
use crate::constants::*;
use crate::events::*;

#[derive(Accounts)]
#[instruction(amount: u64, intent_hash: [u8; 32])]
pub struct CreateFaxRequest<'info> {
    #[account(
        init,
        payer = owner,
        space = DISCRIMINATOR_LENGTH + FaxRequestState::INIT_SPACE,
        seeds = [SEED_FAX_REQUEST, owner.key().as_ref(), intent_hash.as_ref()],
        bump
    )]
    pub fax_request: Account<'info, FaxRequestState>,
    
    #[account(mut)]
    pub owner: Signer<'info>,
    
    /// CHECK: The caregiver is verified off-chain or via policy
    pub caregiver: UncheckedAccount<'info>,
    
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<CreateFaxRequest>, amount: u64, intent_hash: [u8; 32], expires_at: i64) -> Result<()> {
    let fax_request = &mut ctx.accounts.fax_request;
    let clock = Clock::get()?;

    fax_request.owner = ctx.accounts.owner.key();
    fax_request.caregiver = ctx.accounts.caregiver.key();
    fax_request.amount = amount;
    fax_request.intent_hash = intent_hash;
    fax_request.is_approved = false;
    fax_request.is_executed = false;
    fax_request.created_at = clock.unix_timestamp;
    fax_request.expires_at = expires_at;
    fax_request.bump = ctx.bumps.fax_request;

    emit!(FaxRequestCreated {
        fax_request: fax_request.key(),
        owner: fax_request.owner,
        caregiver: fax_request.caregiver,
        amount: fax_request.amount,
        intent_hash: fax_request.intent_hash,
        timestamp: clock.unix_timestamp,
    });

    Ok(())
}
