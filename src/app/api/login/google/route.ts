import { NextResponse } from 'next/server'
import { z } from 'zod'
import { SupabaseService } from '@/lib/supabase_service'
import { INITIAL_CREDIT } from '@/lib/constants'
import { Keypair } from '@solana/web3.js'

const googleLoginSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  username: z.string().min(3),
  profile_pics: z.string().default('')
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const userData = googleLoginSchema.parse(body)

    const supabaseService = SupabaseService.getInstance()
    
    // Check if user exists
    let user = await supabaseService.signIn(userData.id)

    // Create new user if doesn't exist
    if (!user) {
      await supabaseService.createUser({
        id: userData.id,
        email: userData.email,
        username: userData.username,
        profile_pics: userData.profile_pics,
        keypair: [],
        credits: INITIAL_CREDIT
      })
      
      // Fetch newly created user
      user = await supabaseService.signIn(userData.id)
    }

    return NextResponse.json({ 
      user: { ...user, keypair: Keypair.fromSecretKey(Uint8Array.from(Object.values(user!.keypair!))).publicKey.toString(), } 
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Error in Google login:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}