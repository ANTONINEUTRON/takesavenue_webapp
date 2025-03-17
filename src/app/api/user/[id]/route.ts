import { NextRequest, NextResponse } from 'next/server'
import { SupabaseService } from '@/lib/supabase_service'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id
    const supabaseService = SupabaseService.getInstance()
    let user = await supabaseService.signIn(userId)
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

      return NextResponse.json({ ...user, keypair: undefined })

  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}