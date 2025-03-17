use anchor_lang::prelude::*;
use anchor_spl::{
    token::{Mint, Token, TokenAccount, Transfer},
    associated_token::AssociatedToken,
};
use crate::state::*;

#[derive(Accounts)]
pub struct CastVote<'info> {
    #[account(mut)]
    pub voter: Signer<'info>,

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
        associated_token::authority = voter
    )]
    pub voter_token_account: Account<'info, TokenAccount>,

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

impl<'info> CastVote<'info> {
    pub fn cast_vote(
        &mut self,
        agree: bool,
        amount: u64,
    ) -> Result<()> {
        let take = &mut self.take;
        let clock = Clock::get()?;

        // Check if take is still active
        require!(
            clock.unix_timestamp < take.expires_at,
            TakeError::TakeExpired
        );

        // Update vote count
        if agree {
            take.agrees += 1;
        } else {
            take.disagrees += 1;
        }

        // Transfer tokens to vault
        let transfer_ctx = CpiContext::new(
            self.token_program.to_account_info(),
            Transfer {
                from: self.voter_token_account.to_account_info(),
                to: self.vault_token_account.to_account_info(),
                authority: self.voter.to_account_info(),
            },
        );

        anchor_spl::token::transfer(transfer_ctx, amount)?;

        Ok(())
    }
}

#[error_code]
pub enum TakeError {
    #[msg("Take has expired")]
    TakeExpired,
}