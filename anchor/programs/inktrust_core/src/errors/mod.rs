use anchor_lang::prelude::*;

#[error_code]
pub enum InktrustError {
    #[msg("Unauthorized access")]
    Unauthorized,
    #[msg("The request has expired")]
    RequestExpired,
    #[msg("The request has already been approved")]
    AlreadyApproved,
    #[msg("The request has already been executed")]
    AlreadyExecuted,
    #[msg("Invalid durable nonce")]
    InvalidNonce,
    #[msg("Spending limit exceeded")]
    SpendingLimitExceeded,
    #[msg("Policy engine violation")]
    PolicyViolation,
    #[msg("Invalid caregiver for this request")]
    InvalidCaregiver,
    #[msg("Multisig threshold not met")]
    MultisigThresholdNotMet,
    #[msg("Invalid intent hash")]
    InvalidIntentHash,
    #[msg("Arithmetic overflow")]
    Overflow,
}
