use litesvm::LiteSVM;
use solana_sdk::signature::{Keypair, Signer};
use solana_sdk::transaction::Transaction;
use solana_sdk::instruction::{AccountMeta, Instruction};
use solana_sdk::system_program;

pub fn setup_litesvm() -> (LiteSVM, Keypair) {
    let mut svm = LiteSVM::new();
    svm.airdrop(10_000_000_000).unwrap();
    let payer = Keypair::new();
    svm.airdrop(&payer.pubkey(), 10_000_000_000).unwrap();
    (svm, payer)
}

pub fn create_transaction(
    instructions: &[Instruction],
    payer: &Keypair,
    signers: &[&Keypair],
    blockhash: solana_sdk::hash::Hash,
) -> Transaction {
    Transaction::new_signed_with_payer(instructions, Some(&payer.pubkey()), signers, blockhash)
}

pub fn system_transfer_ix(from: &Pubkey, to: &Pubkey, amount: u64) -> Instruction {
    Instruction {
        program_id: system_program::ID,
        accounts: vec![
            AccountMeta::new(*from, true),
            AccountMeta::new(*to, false),
        ],
        data: vec![2, 0, 0, 0] + &amount.to_le_bytes(),
    }
}
