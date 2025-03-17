use anchor_lang::prelude::*;
use anchor_spl::{
    token::{Mint, Token, TokenAccount, Transfer},
    associated_token::AssociatedToken,
};
use crate::state::*;

#[derive(Accounts)]
pub struct ClaimRewards<'info> {
    #[account(mut)]
    pub claimer: Signer<'info>,

    #[account(
        mut,
        seeds = [b"take", take.take_id.as_bytes()],
        bump = take.bump,
    )]
    pub take: Account<'info, Take>,

    pub token_mint: Account<'info, Mint>,

    #[account(
        mut,
        associated_token::mint = token_mint,
        associated_token::authority = claimer
    )]
    pub claimer_token_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        associated_token::mint = token_mint,
        associated_token::authority = take
    )]
    pub vault_token_account: Account<'info, TokenAccount>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

impl<'info> ClaimRewards<'info> {
    pub fn claim_rewards(&mut self) -> Result<()> {
        let take = &mut self.take;
        let clock = Clock::get()?;

        // Verify take has expired
        require!(
            clock.unix_timestamp >= take.expires_at,
            TakeError::TakeNotExpired
        );

        // Check not already claimed
        require!(!take.claimed, TakeError::AlreadyClaimed);

        // Determine winning side and reward amount
        let (winning_side, total_winners) = if take.agrees > take.disagrees {
            (true, take.agrees)
        } else if take.disagrees > take.agrees {
            (false, take.disagrees)
        } else {
            return Err(TakeError::NoWinner.into());
        };

        // Calculate reward per winner
        let reward_per_winner = take.value / total_winners;

        // Transfer reward if claimer is on winning side
        let is_winner = if winning_side {
            take.agrees > take.disagrees
        } else {
            take.disagrees > take.agrees
        };

        require!(is_winner, TakeError::NotWinner);

        // Transfer tokens from vault to winner
        let transfer_ctx = CpiContext::new_with_signer(
            self.token_program.to_account_info(),
            Transfer {
                from: self.vault_token_account.to_account_info(),
                to: self.claimer_token_account.to_account_info(),
                authority: self.token_mint.to_account_info(),
            },
            &[&[
                b"take",
                take.take_id.as_bytes(),
                &[take.bump],
            ]],
        );

        anchor_spl::token::transfer(transfer_ctx, reward_per_winner)?;

        // Mark take as claimed
        take.claimed = true;

        Ok(())
    }
}

#[error_code]
pub enum TakeError {
    #[msg("Take has not expired yet")]
    TakeNotExpired,
    #[msg("Rewards already claimed")]
    AlreadyClaimed,
    #[msg("No winning side")]
    NoWinner,
    #[msg("Not on winning side")]
    NotWinner,
}