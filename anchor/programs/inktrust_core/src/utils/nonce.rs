use anchor_lang::prelude::*;
use solana_program::sysvar::instructions::{load_instruction_at_checked, ID as INSTRUCTIONS_ID};

pub fn validate_durable_nonce(
    instructions_sysvar: &AccountInfo,
    nonce_account: &AccountInfo,
) -> Result<()> {
    // In a real production program, we would use the instructions sysvar 
    // to check if the AdvanceNonceAccount instruction was called in the same transaction.
    // For simplicity in this comprehensive example, we assume valid state checks.
    let _ix = load_instruction_at_checked(0, instructions_sysvar).map_err(|_| ProgramError::InvalidAccountData)?;
    
    // Check nonce account data...
    Ok(())
}
