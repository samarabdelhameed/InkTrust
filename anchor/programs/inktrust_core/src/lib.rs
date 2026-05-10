use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

pub mod state;
use state::*;

declare_id!("D8w7y2m9VywSfAMG48dgiroienfrX419wjESVxPyv4sR");

#[program]
pub mod inktrust_core {
    use super::*;

    /// Initialize a new fax request on-chain after AI parses the fax document.
    /// Called by the API server once Gemini extracts the intent.
    pub fn initialize_request(
        ctx: Context<InitializeRequest>,
        request_id: u64,
        amount: u64,
        intent_hash: [u8; 32],
    ) -> Result<()> {
        let request = &mut ctx.accounts.fax_request;
        request.owner = ctx.accounts.owner.key();
        request.caregiver = ctx.accounts.caregiver.key();
        request.amount = amount;
        request.is_approved = false;
        request.is_executed = false;
        request.intent_hash = intent_hash;
        request.created_at = Clock::get()?.unix_timestamp;
        request.bump = ctx.bumps.fax_request;

        msg!("InkTrust: Fax request initialized — amount: {}, awaiting caregiver approval", amount);
        Ok(())
    }

    /// Approve a pending fax request. Called by the caregiver via Solana Blinks.
    /// Only the designated caregiver can sign this transaction.
    pub fn approve_request(ctx: Context<ApproveRequest>) -> Result<()> {
        let request = &mut ctx.accounts.fax_request;

        require!(!request.is_approved, InkTrustError::AlreadyApproved);
        require!(!request.is_executed, InkTrustError::AlreadyExecuted);

        request.is_approved = true;

        msg!("InkTrust: Request approved by caregiver {}", ctx.accounts.caregiver.key());
        Ok(())
    }

    /// Execute the purchase after caregiver approval.
    /// Transfers funds from the senior's embedded wallet to the merchant.
    pub fn execute_purchase(ctx: Context<ExecutePurchase>) -> Result<()> {
        let request = &mut ctx.accounts.fax_request;

        require!(request.is_approved, InkTrustError::NotApproved);
        require!(!request.is_executed, InkTrustError::AlreadyExecuted);

        // CPI to SPL Token Program for Stablecoin (CASH/USDC) payment
        let cpi_accounts = Transfer {
            from: ctx.accounts.owner_token_account.to_account_info(),
            to: ctx.accounts.merchant_token_account.to_account_info(),
            authority: ctx.accounts.owner.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, request.amount)?;

        request.is_executed = true;

        msg!("InkTrust: Purchase executed — {} stablecoin transferred to merchant", request.amount);
        Ok(())
    }

    /// Close the request account and reclaim rent to the senior's wallet.
    pub fn close_request(_ctx: Context<CloseRequest>) -> Result<()> {
        msg!("InkTrust: Request account closed, rent reclaimed");
        Ok(())
    }
}

// ============================================================
// Account Validation Structs
// ============================================================

#[derive(Accounts)]
#[instruction(request_id: u64)]
pub struct InitializeRequest<'info> {
    #[account(
        init,
        payer = payer,
        space = 8 + FaxRequestState::INIT_SPACE,
        seeds = [b"fax_request", owner.key().as_ref(), request_id.to_le_bytes().as_ref()],
        bump,
    )]
    pub fax_request: Account<'info, FaxRequestState>,

    /// The senior (fax sender) whose embedded wallet owns this request.
    /// CHECK: This is the senior's Privy embedded wallet address.
    pub owner: UncheckedAccount<'info>,

    /// The designated caregiver who can approve this request.
    /// CHECK: This is the caregiver's wallet address stored on-chain.
    pub caregiver: UncheckedAccount<'info>,

    /// The account paying for the transaction (API server's hot wallet).
    #[account(mut)]
    pub payer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ApproveRequest<'info> {
    #[account(
        mut,
        has_one = caregiver,
        constraint = !fax_request.is_approved @ InkTrustError::AlreadyApproved,
    )]
    pub fax_request: Account<'info, FaxRequestState>,

    /// The caregiver must sign to approve.
    pub caregiver: Signer<'info>,
}

#[derive(Accounts)]
pub struct ExecutePurchase<'info> {
    #[account(
        mut,
        has_one = owner,
        constraint = fax_request.is_approved @ InkTrustError::NotApproved,
        constraint = !fax_request.is_executed @ InkTrustError::AlreadyExecuted,
    )]
    pub fax_request: Account<'info, FaxRequestState>,

    /// The senior's embedded wallet (source of funds).
    pub owner: Signer<'info>,

    /// The senior's stablecoin token account.
    #[account(mut)]
    pub owner_token_account: Account<'info, TokenAccount>,

    /// The merchant's stablecoin token account.
    #[account(mut)]
    pub merchant_token_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct CloseRequest<'info> {
    #[account(
        mut,
        has_one = owner,
        close = owner,
    )]
    pub fax_request: Account<'info, FaxRequestState>,

    /// Rent is returned to the senior's wallet.
    #[account(mut)]
    pub owner: Signer<'info>,
}

// ============================================================
// Error Codes
// ============================================================

#[error_code]
pub enum InkTrustError {
    #[msg("This request has already been approved")]
    AlreadyApproved,

    #[msg("This request has already been executed")]
    AlreadyExecuted,

    #[msg("Caregiver approval is required before execution")]
    NotApproved,

    #[msg("Spending limit exceeded — caregiver escalation required")]
    SpendingLimitExceeded,

    #[msg("Unauthorized: only the designated caregiver can approve")]
    UnauthorizedCaregiver,
}
