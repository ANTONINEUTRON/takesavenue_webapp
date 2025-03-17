import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { SupabaseService } from '@/lib/supabase_service'

const userTakesSchema = z.object({
  id: z.string(),
  page: z.number().optional().default(1),
  limit: z.number().optional().default(30)
})

export async function POST(request: NextRequest) {
  try {
      const body = await request.json()
      console.log("takes got in users", body);
      const { id, page, limit } = userTakesSchema.parse(body)
      console.log("after expected fetch in users", body);

    const supabaseService = SupabaseService.getInstance()
    const takes = await supabaseService.getUserTakes(id, page, limit)

    return NextResponse.json({
      takes,
      pagination: {
        page,
        limit
      }
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Error fetching user takes:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}