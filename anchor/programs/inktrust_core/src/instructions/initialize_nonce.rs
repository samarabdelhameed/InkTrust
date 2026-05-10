use anchor_lang::prelude::*;
use crate::state::*;
use crate::constants::*;
use crate::events::*;

#[derive(Accounts)]
pub struct InitializeNonce<'info> {
    #[account(
        init,
        payer = owner,
        space = DISCRIMINATOR_LENGTH + NonceState::INIT_SPACE,
        seeds = [SEED_NONCE, owner.key().as_ref(), nonce_account.key().as_ref()],
        bump
    )]
    pub nonce_pda: Account<'info, NonceState>,
    
    #[account(mut)]
    pub owner: Signer<'info>,
    
    /// CHECK: This is a system program nonce account
    pub nonce_account: UncheckedAccount<'info>,
    
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<InitializeNonce>) -> Result<()> {
    let nonce_pda = &mut ctx.accounts.nonce_pda;
    nonce_pda.owner = ctx.accounts.owner.key();
    nonce_pda.nonce_account = ctx.accounts.nonce_account.key();
    nonce_pda.bump = ctx.bumps.nonce_pda;

    emit!(NonceInitialized {
        nonce_account: ctx.accounts.nonce_account.key(),
        owner: ctx.accounts.owner.key(),
    });

    Ok(())
}
