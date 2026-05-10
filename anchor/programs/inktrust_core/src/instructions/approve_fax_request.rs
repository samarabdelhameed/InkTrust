use anchor_lang::prelude::*;
use crate::state::*;
use crate::constants::*;
use crate::errors::*;
use crate::events::*;

#[derive(Accounts)]
pub struct ApproveFaxRequest<'info> {
    #[account(
        mut,
        seeds = [SEED_FAX_REQUEST, fax_request.owner.as_ref(), fax_request.intent_hash.as_ref()],
        bump = fax_request.bump,
        constraint = fax_request.caregiver == caregiver.key() @ InktrustError::InvalidCaregiver
    )]
    pub fax_request: Account<'info, FaxRequestState>,
    
    #[account(
        init,
        payer = caregiver,
        space = DISCRIMINATOR_LENGTH + ApprovalState::INIT_SPACE,
        seeds = [SEED_APPROVAL, fax_request.key().as_ref(), caregiver.key().as_ref()],
        bump
    )]
    pub approval: Account<'info, ApprovalState>,
    
    #[account(mut)]
    pub caregiver: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<ApproveFaxRequest>) -> Result<()> {
    let fax_request = &mut ctx.accounts.fax_request;
    let approval = &mut ctx.accounts.approval;
    let clock = Clock::get()?;

    if fax_request.is_approved {
        return err!(InktrustError::AlreadyApproved);
    }

    fax_request.is_approved = true;
    
    approval.fax_request = fax_request.key();
    approval.approver = ctx.accounts.caregiver.key();
    approval.timestamp = clock.unix_timestamp;
    approval.bump = ctx.bumps.approval;

    emit!(FaxRequestApproved {
        fax_request: fax_request.key(),
        approver: ctx.accounts.caregiver.key(),
        timestamp: clock.unix_timestamp,
    });

    Ok(())
}
