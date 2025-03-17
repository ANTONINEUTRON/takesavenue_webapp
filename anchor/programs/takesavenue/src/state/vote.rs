use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Vote {
    pub take: Pubkey,
    pub voter: Pubkey,
    pub agree: bool,
    pub stake_amount: u64,
    pub claimed_reward: bool,
    pub bump: u8,
}