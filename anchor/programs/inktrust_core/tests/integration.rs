use anchor_lang::prelude::*;
use inktrust_core::state::FaxRequestState;
use inktrust_core::{self, InkTrustError};
use litesvm::LiteSVM;
use solana_sdk::instruction::{AccountMeta, Instruction};
use solana_sdk::pubkey::Pubkey;
use solana_sdk::signature::{Keypair, Signer};
use solana_sdk::system_program;
use solana_sdk::transaction::Transaction;
use std::str::FromStr;

fn setup_validator() -> (LiteSVM, Keypair) {
    let mut svm = LiteSVM::new();
    svm.airdrop(5_000_000_000).unwrap();
    let payer = Keypair::new();
    svm.airdrop(&payer.pubkey(), 10_000_000_000).unwrap();
    (svm, payer)
}

fn find_fax_request_pda(owner: &Pubkey, request_id: u64) -> (Pubkey, u8) {
    Pubkey::find_program_address(
        &[b"fax_request", owner.as_ref(), &request_id.to_le_bytes()],
        &inktrust_core::ID,
    )
}

#[test]
fn test_initialize_request() {
    let (mut svm, payer) = setup_validator();
    let owner = Keypair::new();
    let caregiver = Keypair::new();
    let request_id: u64 = 1;
    let amount: u64 = 1_000_000;
    let intent_hash = [42u8; 32];

    let (fax_request_pda, _bump) = find_fax_request_pda(&owner.pubkey(), request_id);

    let accounts = vec![
        AccountMeta::new(fax_request_pda, false),
        AccountMeta::new_readonly(owner.pubkey(), false),
        AccountMeta::new_readonly(caregiver.pubkey(), false),
        AccountMeta::new(payer.pubkey(), true),
        AccountMeta::new_readonly(system_program::ID, false),
    ];

    let mut data = vec![0; 8];
    data.extend_from_slice(&request_id.to_le_bytes());
    data.extend_from_slice(&amount.to_le_bytes());
    data.extend_from_slice(&intent_hash);

    let ix = Instruction {
        program_id: inktrust_core::ID,
        accounts,
        data: anchor_lang::InstructionData::data(&inktrust_core::instruction::InitializeRequest {
            request_id,
            amount,
            intent_hash,
        }),
    };

    let tx = Transaction::new_signed_with_payer(
        &[ix],
        Some(&payer.pubkey()),
        &[&payer],
        svm.latest_blockhash(),
    );

    let result = svm.send_transaction(tx);
    assert!(result.is_ok(), "Initialize request failed: {:?}", result.err());

    let account_data = svm.get_account(&fax_request_pda).unwrap();
    let fax_request = FaxRequestState::try_deserialize(&mut &account_data.data[..]).unwrap();

    assert_eq!(fax_request.owner, owner.pubkey());
    assert_eq!(fax_request.caregiver, caregiver.pubkey());
    assert_eq!(fax_request.amount, amount);
    assert_eq!(fax_request.intent_hash, intent_hash);
    assert!(!fax_request.is_approved);
    assert!(!fax_request.is_executed);
}

#[test]
fn test_approve_request() {
    let (mut svm, payer) = setup_validator();
    let owner = Keypair::new();
    let caregiver = Keypair::new();
    let request_id: u64 = 1;
    let amount: u64 = 1_000_000;
    let intent_hash = [42u8; 32];

    let (fax_request_pda, _bump) = find_fax_request_pda(&owner.pubkey(), request_id);

    let init_accounts = vec![
        AccountMeta::new(fax_request_pda, false),
        AccountMeta::new_readonly(owner.pubkey(), false),
        AccountMeta::new_readonly(caregiver.pubkey(), false),
        AccountMeta::new(payer.pubkey(), true),
        AccountMeta::new_readonly(system_program::ID, false),
    ];

    let init_ix = Instruction {
        program_id: inktrust_core::ID,
        accounts: init_accounts,
        data: anchor_lang::InstructionData::data(&inktrust_core::instruction::InitializeRequest {
            request_id,
            amount,
            intent_hash,
        }),
    };

    let approve_accounts = vec![
        AccountMeta::new(fax_request_pda, false),
        AccountMeta::new_readonly(caregiver.pubkey(), true),
    ];

    let approve_ix = Instruction {
        program_id: inktrust_core::ID,
        accounts: approve_accounts,
        data: anchor_lang::InstructionData::data(&inktrust_core::instruction::ApproveRequest),
    };

    let tx = Transaction::new_signed_with_payer(
        &[init_ix, approve_ix],
        Some(&payer.pubkey()),
        &[&payer, &caregiver],
        svm.latest_blockhash(),
    );

    let result = svm.send_transaction(tx);
    assert!(result.is_ok(), "Approve request failed: {:?}", result.err());

    let account_data = svm.get_account(&fax_request_pda).unwrap();
    let fax_request = FaxRequestState::try_deserialize(&mut &account_data.data[..]).unwrap();
    assert!(fax_request.is_approved);
}

#[test]
fn test_approve_twice_fails() {
    let (mut svm, payer) = setup_validator();
    let owner = Keypair::new();
    let caregiver = Keypair::new();
    let request_id: u64 = 1;
    let amount: u64 = 1_000_000;
    let intent_hash = [42u8; 32];

    let (fax_request_pda, _bump) = find_fax_request_pda(&owner.pubkey(), request_id);

    let init_ix = Instruction {
        program_id: inktrust_core::ID,
        accounts: vec![
            AccountMeta::new(fax_request_pda, false),
            AccountMeta::new_readonly(owner.pubkey(), false),
            AccountMeta::new_readonly(caregiver.pubkey(), false),
            AccountMeta::new(payer.pubkey(), true),
            AccountMeta::new_readonly(system_program::ID, false),
        ],
        data: anchor_lang::InstructionData::data(&inktrust_core::instruction::InitializeRequest {
            request_id,
            amount,
            intent_hash,
        }),
    };

    let approve_ix = |signer: &Keypair| Instruction {
        program_id: inktrust_core::ID,
        accounts: vec![
            AccountMeta::new(fax_request_pda, false),
            AccountMeta::new_readonly(caregiver.pubkey(), true),
        ],
        data: anchor_lang::InstructionData::data(&inktrust_core::instruction::ApproveRequest),
    };

    let first_tx = Transaction::new_signed_with_payer(
        &[init_ix, approve_ix(&caregiver)],
        Some(&payer.pubkey()),
        &[&payer, &caregiver],
        svm.latest_blockhash(),
    );
    assert!(svm.send_transaction(first_tx).is_ok());

    let second_tx = Transaction::new_signed_with_payer(
        &[approve_ix(&caregiver)],
        Some(&payer.pubkey()),
        &[&payer, &caregiver],
        svm.latest_blockhash(),
    );
    let result = svm.send_transaction(second_tx);
    assert!(result.is_err(), "Second approval should have failed");
}

#[test]
fn test_unauthorized_caregiver() {
    let (mut svm, payer) = setup_validator();
    let owner = Keypair::new();
    let authorized = Keypair::new();
    let unauthorized = Keypair::new();
    let request_id: u64 = 1;

    let (fax_request_pda, _bump) = find_fax_request_pda(&owner.pubkey(), request_id);

    let init_ix = Instruction {
        program_id: inktrust_core::ID,
        accounts: vec![
            AccountMeta::new(fax_request_pda, false),
            AccountMeta::new_readonly(owner.pubkey(), false),
            AccountMeta::new_readonly(authorized.pubkey(), false),
            AccountMeta::new(payer.pubkey(), true),
            AccountMeta::new_readonly(system_program::ID, false),
        ],
        data: anchor_lang::InstructionData::data(&inktrust_core::instruction::InitializeRequest {
            request_id,
            amount: 1_000_000,
            intent_hash: [42u8; 32],
        }),
    };

    let approve_ix = Instruction {
        program_id: inktrust_core::ID,
        accounts: vec![
            AccountMeta::new(fax_request_pda, false),
            AccountMeta::new_readonly(unauthorized.pubkey(), true),
        ],
        data: anchor_lang::InstructionData::data(&inktrust_core::instruction::ApproveRequest),
    };

    let tx = Transaction::new_signed_with_payer(
        &[init_ix, approve_ix],
        Some(&payer.pubkey()),
        &[&payer, &unauthorized],
        svm.latest_blockhash(),
    );

    let result = svm.send_transaction(tx);
    assert!(result.is_err(), "Unauthorized caregiver should have been rejected");
}

#[test]
fn test_close_request() {
    let (mut svm, payer) = setup_validator();
    let owner = Keypair::new();
    let caregiver = Keypair::new();
    let request_id: u64 = 1;

    let (fax_request_pda, _bump) = find_fax_request_pda(&owner.pubkey(), request_id);

    let init_ix = Instruction {
        program_id: inktrust_core::ID,
        accounts: vec![
            AccountMeta::new(fax_request_pda, false),
            AccountMeta::new_readonly(owner.pubkey(), false),
            AccountMeta::new_readonly(caregiver.pubkey(), false),
            AccountMeta::new(payer.pubkey(), true),
            AccountMeta::new_readonly(system_program::ID, false),
        ],
        data: anchor_lang::InstructionData::data(&inktrust_core::instruction::InitializeRequest {
            request_id,
            amount: 1_000_000,
            intent_hash: [42u8; 32],
        }),
    };

    let close_ix = Instruction {
        program_id: inktrust_core::ID,
        accounts: vec![
            AccountMeta::new(fax_request_pda, false),
            AccountMeta::new(owner.pubkey(), true),
        ],
        data: anchor_lang::InstructionData::data(&inktrust_core::instruction::CloseRequest),
    };

    let tx = Transaction::new_signed_with_payer(
        &[init_ix, close_ix],
        Some(&payer.pubkey()),
        &[&payer, &owner],
        svm.latest_blockhash(),
    );

    let result = svm.send_transaction(tx);
    assert!(result.is_ok(), "Close request failed: {:?}", result.err());
    assert!(svm.get_account(&fax_request_pda).is_none(), "PDA should be closed");
}

#[test]
fn test_full_workflow() {
    let (mut svm, payer) = setup_validator();
    let owner = Keypair::new();
    let caregiver = Keypair::new();
    let request_id: u64 = 42;
    let amount: u64 = 500_000;
    let intent_hash = [7u8; 32];

    let (fax_request_pda, _bump) = find_fax_request_pda(&owner.pubkey(), request_id);

    let make_ix = |ix_data: Vec<u8>, accounts: Vec<AccountMeta>| Instruction {
        program_id: inktrust_core::ID,
        accounts,
        data: ix_data,
    };

    let init_ix = make_ix(
        anchor_lang::InstructionData::data(&inktrust_core::instruction::InitializeRequest {
            request_id,
            amount,
            intent_hash,
        }),
        vec![
            AccountMeta::new(fax_request_pda, false),
            AccountMeta::new_readonly(owner.pubkey(), false),
            AccountMeta::new_readonly(caregiver.pubkey(), false),
            AccountMeta::new(payer.pubkey(), true),
            AccountMeta::new_readonly(system_program::ID, false),
        ],
    );

    let approve_ix = make_ix(
        anchor_lang::InstructionData::data(&inktrust_core::instruction::ApproveRequest),
        vec![
            AccountMeta::new(fax_request_pda, false),
            AccountMeta::new_readonly(caregiver.pubkey(), true),
        ],
    );

    let close_ix = make_ix(
        anchor_lang::InstructionData::data(&inktrust_core::instruction::CloseRequest),
        vec![
            AccountMeta::new(fax_request_pda, false),
            AccountMeta::new(owner.pubkey(), true),
        ],
    );

    let tx = Transaction::new_signed_with_payer(
        &[init_ix, approve_ix, close_ix],
        Some(&payer.pubkey()),
        &[&payer, &caregiver, &owner],
        svm.latest_blockhash(),
    );

    let result = svm.send_transaction(tx);
    assert!(result.is_ok(), "Full workflow failed: {:?}", result.err());
    assert!(svm.get_account(&fax_request_pda).is_none(), "PDA should be closed after workflow");
}

#[test]
fn test_pda_deterministic() {
    let owner = Pubkey::from_str("D8w7y2m9VywSfAMG48dgiroienfrX419wjESVxPyv4sR").unwrap();
    let request_id: u64 = 1;
    let (pda1, bump1) = find_fax_request_pda(&owner, request_id);
    let (pda2, bump2) = find_fax_request_pda(&owner, request_id);
    assert_eq!(pda1, pda2, "PDA should be deterministic");
    assert_eq!(bump1, bump2, "Bump should be deterministic");
}
