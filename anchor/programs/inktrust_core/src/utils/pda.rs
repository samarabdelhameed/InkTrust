use anchor_lang::prelude::*;
use crate::constants::*;

pub fn get_fax_request_address(owner: &Pubkey, intent_hash: &[u8; 32], program_id: &Pubkey) -> (Pubkey, u8) {
    Pubkey::find_program_address(
        &[SEED_FAX_REQUEST, owner.as_ref(), intent_hash.as_ref()],
        program_id,
    )
}

pub fn get_approval_address(fax_request: &Pubkey, approver: &Pubkey, program_id: &Pubkey) -> (Pubkey, u8) {
    Pubkey::find_program_address(
        &[SEED_APPROVAL, fax_request.as_ref(), approver.as_ref()],
        program_id,
    )
}
