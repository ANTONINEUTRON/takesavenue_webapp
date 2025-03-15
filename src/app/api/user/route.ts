import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { SupabaseService } from '@/lib/supabase_service'
import { Keypair } from '@solana/web3.js'
import { User } from '@/lib/type/user'
import { v4 as uuidv4 } from 'uuid';
import { cAuth } from '@/firebaseconfig'

const userSchema = z.object({
  id: z.string(),
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must not exceed 30 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, hyphens and underscores'),
  email: z.string()
    .email('Invalid email address')
    .toLowerCase()
})

export async function POST(request: NextRequest) {
  try {
    // receive the request body
    const body = await request.json()
    const { id, username, email } = userSchema.parse(body)
console.log("what was gotten",body)
    //verify id in firebase, throw error if not found
    // const verificationId = request.headers.get('id');
// console.log("verificationId", verificationId)
//     var decoded = await cAuth.verifyIdToken(verificationId ?? "")
//     var uid = decoded.uid;
//     if (uid != id) {
//       throw new Error("Invalid user id");
//     }

    //save to supabase
    const user: User =  {
      id: id,
      username: username,
      email: email,
      profile_pics: "",
      credits: 30,
      keypair: Keypair.generate().secretKey as unknown as [],
    }
    const supabaseService = SupabaseService.getInstance()
    await supabaseService.createUser(user);

    //generate wallet keypair and return
    return NextResponse.json({
      message: 'User created successfully',
      user: {...user, keypair: undefined}
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}