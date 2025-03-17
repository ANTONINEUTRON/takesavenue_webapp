use anchor_lang::prelude::*;

pub mod instructions;
use instructions::*;

pub mod state;
pub use state::*;

declare_id!("3P93gJvovZBs2hZvAdsC3JpobCcoU1qqoYwaCpUPVGpZ");

#[program]
pub mod takesavenue {
    use super::*;

    pub fn create_take(
        ctx: Context<CreateTake>,
        take_id: String,
        duration: i64,
        value: u64,
    ) -> Result<()> {
        let _ = ctx
            .accounts.create_take(
            &mut ctx.accounts,
            take_id,
            duration,
            value,
        );

        Ok(())
    }

    pub fn cast_vote(
        ctx: Context<CastVote>,
        agree: bool,
        amount: u64,
    ) -> Result<()> {
        let _ = ctx
            .accounts.cast_vote(
            &mut ctx.accounts,
            agree,
            amount,
        );

        Ok(())
    }

    pub fn claim_rewards(
        ctx: Context<ClaimRewards>,
    ) -> Result<()> {
        let _ = ctx
            .accounts.claim_rewards(
            &mut ctx.accounts,
        );

        Ok(())
    }
}
