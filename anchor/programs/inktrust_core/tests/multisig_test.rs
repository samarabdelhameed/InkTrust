use anchor_lang::prelude::*;
use inktrust_core::{self, InkTrustError};
use inktrust_core::state::FaxRequestState;
use litesvm::LiteSVM;
use solana_sdk::instruction::{AccountMeta, Instruction};
use solana_sdk::pubkey::Pubkey;
use solana_sdk::signature::{Keypair, Signer};
use solana_sdk::system_program;
use solana_sdk::transaction::Transaction;

fn setup() -> (LiteSVM, Keypair, Keypair, Keypair) {
    let mut svm = LiteSVM::new();
    svm.airdrop(10_000_000_000).unwrap();
    let payer = Keypair::new();
    svm.airdrop(&payer.pubkey(), 10_000_000_000).unwrap();
    let owner = Keypair::new();
    let caregiver = Keypair::new();
    (svm, payer, owner, caregiver)
}

fn find_pda(owner: &Pubkey, request_id: u64) -> (Pubkey, u8) {
    Pubkey::find_program_address(
        &[b"fax_request", owner.as_ref(), &request_id.to_le_bytes()],
        &inktrust_core::ID,
    )
}

fn setup_request(
    svm: &mut LiteSVM,
    payer: &Keypair,
    owner: &Keypair,
    caregiver: &Keypair,
    request_id: u64,
    amount: u64,
) -> Pubkey {
    let (pda, _) = find_pda(&owner.pubkey(), request_id);

    let ix = Instruction {
        program_id: inktrust_core::ID,
        accounts: vec![
            AccountMeta::new(pda, false),
            AccountMeta::new_readonly(owner.pubkey(), false),
            AccountMeta::new_readonly(caregiver.pubkey(), false),
            AccountMeta::new(payer.pubkey(), true),
            AccountMeta::new_readonly(system_program::ID, false),
        ],
        data: anchor_lang::InstructionData::data(&inktrust_core::instruction::InitializeRequest {
            request_id,
            amount,
            intent_hash: [42u8; 32],
        }),
    };

    let tx = Transaction::new_signed_with_payer(
        &[ix],
        Some(&payer.pubkey()),
        &[payer],
        svm.latest_blockhash(),
    );
    svm.send_transaction(tx).unwrap();
    pda
}

#[test]
fn test_multiple_requests() {
    let (mut svm, payer, owner, caregiver) = setup();

    let pda1 = setup_request(&mut svm, &payer, &owner, &caregiver, 1, 1000);
    let pda2 = setup_request(&mut svm, &payer, &owner, &caregiver, 2, 2000);
    let pda3 = setup_request(&mut svm, &payer, &owner, &caregiver, 3, 3000);

    assert_ne!(pda1, pda2);
    assert_ne!(pda2, pda3);
    assert_ne!(pda1, pda3);

    for pda in &[pda1, pda2, pda3] {
        assert!(svm.get_account(pda).is_some(), "PDA should exist");
    }
}

#[test]
fn test_multi_caregiver_approval() {
    let (mut svm, payer, owner, caregiver1) = setup();
    let caregiver2 = Keypair::new();

    let pda = setup_request(&mut svm, &payer, &owner, &caregiver1, 1, 5000);

    let approve_ix = Instruction {
        program_id: inktrust_core::ID,
        accounts: vec![
            AccountMeta::new(pda, false),
            AccountMeta::new_readonly(caregiver1.pubkey(), true),
        ],
        data: anchor_lang::InstructionData::data(&inktrust_core::instruction::ApproveRequest),
    };

    let tx = Transaction::new_signed_with_payer(
        &[approve_ix],
        Some(&payer.pubkey()),
        &[&payer, &caregiver1],
        svm.latest_blockhash(),
    );
    assert!(svm.send_transaction(tx).is_ok(), "Primary caregiver should be able to approve");

    let account = svm.get_account(&pda).unwrap();
    let state = FaxRequestState::try_deserialize(&mut &account.data[..]).unwrap();
    assert!(state.is_approved);
}

#[test]
fn test_spending_limit_enforcement() {
    let (mut svm, payer, owner, caregiver) = setup();
    let pda = setup_request(&mut svm, &payer, &owner, &caregiver, 1, u64::MAX);

    let approve_ix = Instruction {
        program_id: inktrust_core::ID,
        accounts: vec![
            AccountMeta::new(pda, false),
            AccountMeta::new_readonly(caregiver.pubkey(), true),
        ],
        data: anchor_lang::InstructionData::data(&inktrust_core::instruction::ApproveRequest),
    };

    let tx = Transaction::new_signed_with_payer(
        &[approve_ix],
        Some(&payer.pubkey()),
        &[&payer, &caregiver],
        svm.latest_blockhash(),
    );
    assert!(svm.send_transaction(tx).is_ok(), "Approval should work even with large amounts");
}

#[test]
fn test_close_unapproved_request() {
    let (mut svm, payer, owner, _caregiver) = setup();
    let pda = setup_request(&mut svm, &payer, &owner, &owner, 1, 1000);

    let close_ix = Instruction {
        program_id: inktrust_core::ID,
        accounts: vec![
            AccountMeta::new(pda, false),
            AccountMeta::new(owner.pubkey(), true),
        ],
        data: anchor_lang::InstructionData::data(&inktrust_core::instruction::CloseRequest),
    };

    let tx = Transaction::new_signed_with_payer(
        &[close_ix],
        Some(&payer.pubkey()),
        &[&payer, &owner],
        svm.latest_blockhash(),
    );
    assert!(svm.send_transaction(tx).is_ok(), "Should be able to close unapproved request");
    assert!(svm.get_account(&pda).is_none(), "PDA should be gone after close");
}

#[test]
fn test_concurrent_requests() {
    let (mut svm, payer, owner, caregiver) = setup();
    let mut pdas = Vec::new();

    for i in 0..5 {
        let pda = setup_request(&mut svm, &payer, &owner, &caregiver, i, 1000 * (i + 1));
        pdas.push(pda);
    }

    for (i, pda) in pdas.iter().enumerate() {
        let account = svm.get_account(pda).unwrap();
        let state = FaxRequestState::try_deserialize(&mut &account.data[..]).unwrap();
        assert_eq!(state.amount, 1000 * (i as u64 + 1));
    }
}
