import { NextRequest } from 'next/server'
import fs from 'fs/promises'
import { splitParagraphs } from '@/lib/markdown'
import { hashContent } from '@/lib/hash'
import { readCache, writeCache, CacheEntry } from '@/lib/cache'
import { translateParagraphs } from '@/lib/translate'

export const dynamic = 'force-dynamic'

function makeSSE(data: object): Uint8Array {
  return new TextEncoder().encode(`data: ${JSON.stringify(data)}\n\n`)
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return Response.json({ error: 'GEMINI_API_KEY not set' }, { status: 500 })
  }

  let body: { filePath?: string; text?: string }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  let content: string
  try {
    if (body.filePath) {
      content = await fs.readFile(body.filePath, 'utf8')
    } else if (body.text) {
      content = body.text
    } else {
      return Response.json({ error: 'Provide filePath or text' }, { status: 400 })
    }
  } catch (err) {
    const isNotFound = (err as NodeJS.ErrnoException).code === 'ENOENT'
    if (isNotFound) {
      return Response.json({ error: `File not found: ${body.filePath}` }, { status: 404 })
    }
    return Response.json({ error: `Failed to read file: ${(err as Error).message}` }, { status: 500 })
  }

  if (!content.trim()) {
    return Response.json({ error: 'Content is empty' }, { status: 400 })
  }

  const hash = hashContent(content)
  const cached = await readCache(hash)

  const stream = new ReadableStream({
    async start(controller) {
      try {
        if (cached) {
          controller.enqueue(makeSSE({ type: 'init', count: cached.paragraphs.length }))
          for (let i = 0; i < cached.paragraphs.length; i++) {
            controller.enqueue(makeSSE({ type: 'paragraph', index: i, ...cached.paragraphs[i] }))
          }
          controller.enqueue(makeSSE({ type: 'done' }))
          controller.close()
          return
        }

        const paragraphs = splitParagraphs(content)
        controller.enqueue(makeSSE({ type: 'init', count: paragraphs.length }))

        const results: Array<{ en: string; zh: string } | null> = new Array(paragraphs.length).fill(null)
        let hasError = false

        await translateParagraphs(paragraphs, apiKey, result => {
          if (result.error) {
            hasError = true
            controller.enqueue(makeSSE({ type: 'error', index: result.index, en: result.en, message: result.error }))
          } else {
            results[result.index] = { en: result.en, zh: result.zh }
            controller.enqueue(makeSSE({ type: 'paragraph', index: result.index, en: result.en, zh: result.zh }))
          }
        })

        if (!hasError) {
          const entry: CacheEntry = {
            hash,
            source: content,
            paragraphs: results as Array<{ en: string; zh: string }>,
            createdAt: new Date().toISOString(),
          }
          await writeCache(entry)
        }

        controller.enqueue(makeSSE({ type: 'done' }))
        controller.close()
      } catch (err) {
        controller.enqueue(makeSSE({ type: 'fatal', message: err instanceof Error ? err.message : 'Internal error' }))
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
