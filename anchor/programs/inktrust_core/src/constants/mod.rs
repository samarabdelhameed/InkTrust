use anchor_lang::prelude::*;

#[constant]
pub const SEED_FAX_REQUEST: &[u8] = b"fax_request";
#[constant]
pub const SEED_APPROVAL: &[u8] = b"approval";
#[constant]
pub const SEED_NONCE: &[u8] = b"nonce";

pub const MAX_INTENT_HASH_LEN: usize = 32;
pub const DISCRIMINATOR_LENGTH: usize = 8;
