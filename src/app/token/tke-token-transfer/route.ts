import { mintTkeTokens } from "@/lib/token_ops/mint"
import { transferTkeTokens } from "@/lib/token_ops/tke_transfer"
import { NextRequest, NextResponse } from "next/server"


export async function GET(request: NextRequest) {
    try {
        console.log('Transfering TKE tokens...')
        console.log('Transfering TKE tokens...')
        console.log('duck', process.env.WALLET_SECRET_KEY)
        let res = await transferTkeTokens(
            "EpG8VkF9Cv4iGBGYvaxAATVDEgd74VjWmsPdKcF9WGwc", 10,
        );
        
        return NextResponse.json({ res })
    } catch (error) {
        console.error('Error fetching users:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}