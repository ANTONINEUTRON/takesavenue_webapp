import { mintTkeTokens } from "@/lib/token_ops/mint"
import { NextRequest, NextResponse } from "next/server"


export async function GET(request: NextRequest) {
  try {
      console.log('Minting TKE tokens...')
      console.log('Minting TKE tokens...')
      console.log('duck', process.env.WALLET_SECRET_KEY)
    let res = await mintTkeTokens();



    return NextResponse.json({res})
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}