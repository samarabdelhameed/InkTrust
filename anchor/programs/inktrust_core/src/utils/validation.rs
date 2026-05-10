use anchor_lang::prelude::*;
use crate::errors::InktrustError;
use crate::state::FaxRequestState;

pub fn validate_fax_request(fax_request: &FaxRequestState) -> Result<()> {
    let clock = Clock::get()?;
    if clock.unix_timestamp > fax_request.expires_at {
        return err!(InktrustError::RequestExpired);
    }
    if fax_request.is_executed {
        return err!(InktrustError::AlreadyExecuted);
    }
    Ok(())
}

pub fn validate_policy(amount: u64, limit: u64) -> Result<()> {
    if amount > limit {
        return err!(InktrustError::SpendingLimitExceeded);
    }
    Ok(())
}
