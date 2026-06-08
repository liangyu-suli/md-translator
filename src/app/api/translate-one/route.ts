import { NextRequest } from 'next/server'
import { translateParagraph } from '@/lib/gemini'

export async function POST(request: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return Response.json({ error: 'GEMINI_API_KEY not set' }, { status: 500 })
  }

  let body: { en?: string }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  if (!body.en?.trim()) {
    return Response.json({ error: 'en text is required' }, { status: 400 })
  }

  try {
    const zh = await translateParagraph(body.en, apiKey)
    return Response.json({ zh })
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : 'Translation failed' },
      { status: 500 }
    )
  }
}
