import { NextRequest, NextResponse } from 'next/server'
import { SupabaseService } from '@/lib/supabase_service'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '30')

    const supabaseService = SupabaseService.getInstance()

    let users = await supabaseService.getUsers(page, limit)
    users.forEach(user => {
        user.keypair = undefined
    })

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit
      }
    })

  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}