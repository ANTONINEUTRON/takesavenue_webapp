import { NextResponse } from 'next/server'
import { z } from 'zod'
import { SupabaseService } from '@/lib/supabase_service'
import { v4 as uuidv4 } from 'uuid';

const createTakeSchema = z.object({
  userId: z.string(),
  title: z.string().min(1, 'Title is required'),
  contenttype: z.enum(['video', 'image', 'text'], {
    errorMap: () => ({ message: 'Invalid content type' })
  }),
  punishment: z.string().min(1, 'Punishment is required'),
  content: z.string().min(1, 'Content is required'),
  responder: z.string().optional(),
  duration: z.number()
    .int()
    .min(3600000, 'Duration must be at least 1 hour')
    .max(604800000, 'Duration cannot exceed 7 days')
    .default(86400000) // 24 hours in milliseconds
})

export async function POST(request: Request) {
    try {
      const body = await request.json()
      console.log("takeData hotii", body);
    const takeData = createTakeSchema.parse(body)
        console.log("takeData hotii",takeData);

    const supabaseService = SupabaseService.getInstance()
    console.log("takeData", takeData);
    const take = await supabaseService.createTake({
      id: uuidv4(),
      userId: takeData.userId,
      title: takeData.title,
      contenttype: takeData.contenttype,
      punishment: takeData.punishment,
      content: takeData.content,
      agrees: 0,
      disagrees: 0,
      duration: takeData.duration, // use the duration from the request
      likes: 0,
      shares: 0,
      status: 'pending',
      created_at: new Date(),
      expired_at: new Date(Date.now() + takeData.duration), // use the duration from the request
      responder: takeData.responder!
    });

    return NextResponse.json({ take })

  } catch (error) {
    console.log("error", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Error creating take:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
