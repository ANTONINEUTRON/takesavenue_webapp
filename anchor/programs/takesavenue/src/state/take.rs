use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Take {
    #[max_len(32)]
    pub take_id: String,
    pub creator: Pubkey,
    pub agrees: u64,
    pub disagrees: u64,
    pub created_at: i64,
    pub expires_at: i64,
    pub claimed: bool,
    pub token_mint: Pubkey,
    pub value: u64, 
    pub bump: u8,
}
