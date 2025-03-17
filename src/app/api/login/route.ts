import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { SupabaseService } from '@/lib/supabase_service'
import { Keypair } from '@solana/web3.js'

const signInSchema = z.object({
  userId: z.string()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId } = signInSchema.parse(body)

    const supabaseService = SupabaseService.getInstance()
    const user = await supabaseService.signIn(userId)

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }


    return NextResponse.json({
      user: { ...user, keypair: Keypair.fromSecretKey(Uint8Array.from(Object.values(user.keypair!))).publicKey.toString(), }
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Error signing in:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
