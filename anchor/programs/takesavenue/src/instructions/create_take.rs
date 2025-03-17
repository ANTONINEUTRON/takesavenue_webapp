use anchor_lang::prelude::*;
use anchor_spl::{
    token::{Mint, Token, TokenAccount, Transfer},
    associated_token::AssociatedToken,
};

use crate::Take;

#[derive(Accounts)]
#[instruction(take_id: String)]
pub struct CreateTake<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,

    #[account(
        init,
        payer = creator,
        space = 8 + Take::INIT_SPACE,
        seeds = [b"take", take_id.as_bytes()],
        bump
    )]
    pub take: Account<'info, Take>,

    pub token_mint: Account<'info, Mint>,

    #[account(
        mut,
        associated_token::mint = token_mint,
        associated_token::authority = creator
    )]
    pub creator_token_account: Account<'info, TokenAccount>,

    #[account(
        init,
        payer = creator,
        associated_token::mint = token_mint,
        associated_token::authority = take
    )]
    pub vault_token_account: Account<'info, TokenAccount>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub rent: Sysvar<'info, Rent>,
}

impl<'info> CreateTake<'info> {
    pub fn create_take(
        &mut self,
        take_id: String,
        duration: i64,
        value: u64,
        bump: u8,
    ) -> Result<()> {
        let take = &mut self.take;
        let clock = Clock::get()?;

        take.take_id = take_id;
        take.creator = self.creator.key();
        take.agrees = 0;
        take.disagrees = 0;
        take.created_at = clock.unix_timestamp;
        take.expires_at = clock.unix_timestamp + duration;
        take.claimed = false;
        take.token_mint = self.token_mint.key();
        take.value = value;
        take.bump = bump;

        // Transfer initial stake to vault
        let transfer_ctx = CpiContext::new(
            self.token_program.to_account_info(),
            Transfer {
                from: self.creator_token_account.to_account_info(),
                to: self.vault_token_account.to_account_info(),
                authority: self.creator.to_account_info(),
            },
        );

        anchor_spl::token::transfer(transfer_ctx, value)?;

        Ok(())
    }
}