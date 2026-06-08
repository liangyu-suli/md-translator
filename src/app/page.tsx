'use client'

import { useState, useCallback } from 'react'
import { InputForm } from '@/components/InputForm'
import { ModeToolbar, DisplayMode } from '@/components/ModeToolbar'
import { ParagraphGrid } from '@/components/ParagraphGrid'
import { ApiKeyBanner } from '@/components/ApiKeyBanner'
import { ParagraphState } from '@/components/ParagraphCard'

export default function HomePage() {
  const [mode, setMode] = useState<DisplayMode>('hybrid')
  const [paragraphs, setParagraphs] = useState<ParagraphState[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [apiKeyMissing, setApiKeyMissing] = useState(false)

  const handleSubmit = useCallback(async (input: { filePath?: string; text?: string }) => {
    setLoading(true)
    setError(null)
    setParagraphs([])
    setApiKeyMissing(false)

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })

      if (!response.ok) {
        const data = await response.json()
        if (response.status === 500 && data.error?.includes('GEMINI_API_KEY')) {
          setApiKeyMissing(true)
        } else {
          setError(data.error ?? 'Unknown error')
        }
        setLoading(false)
        return
      }

      if (!response.body) {
        setError('No response body')
        setLoading(false)
        return
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })

          const lines = buffer.split('\n')
          buffer = lines.pop() ?? ''

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue
            try {
              const data = JSON.parse(line.slice(6))

              if (data.type === 'init') {
                setParagraphs(
                  Array.from({ length: data.count }, (_, i) => ({
                    index: i, en: '', zh: '', status: 'loading' as const,
                  }))
                )
              } else if (data.type === 'paragraph') {
                setParagraphs(prev =>
                  prev.map(p =>
                    p.index === data.index
                      ? { index: data.index, en: data.en, zh: data.zh, status: 'done' as const }
                      : p
                  )
                )
              } else if (data.type === 'error') {
                setParagraphs(prev =>
                  prev.map(p =>
                    p.index === data.index
                      ? { index: data.index, en: data.en ?? p.en, zh: '', status: 'error' as const, error: data.message }
                      : p
                  )
                )
              } else if (data.type === 'fatal') {
                setError(data.message ?? 'Fatal stream error')
                setLoading(false)
                return
              } else if (data.type === 'done') {
                setLoading(false)
              }
            } catch {
              // skip malformed SSE line
            }
          }
        }
      } finally {
        setLoading(false)
        reader.cancel()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error')
      setLoading(false)
    }
  }, [])

  const handleRetry = useCallback(async (index: number, en: string) => {
    setParagraphs(prev =>
      prev.map(p => p.index === index ? { ...p, status: 'loading' as const, error: undefined } : p)
    )
    try {
      const res = await fetch('/api/translate-one', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ en }),
      })
      const data = await res.json()
      if (res.ok) {
        setParagraphs(prev =>
          prev.map(p => p.index === index ? { ...p, zh: data.zh, status: 'done' as const, error: undefined } : p)
        )
      } else {
        setParagraphs(prev =>
          prev.map(p =>
            p.index === index
              ? { ...p, status: 'error' as const, error: data.error ?? 'Retry failed' }
              : p
          )
        )
      }
    } catch {
      setParagraphs(prev =>
        prev.map(p =>
          p.index === index ? { ...p, status: 'error' as const, error: 'Network error' } : p
        )
      )
    }
  }, [])

  const showToolbar = paragraphs.length > 0 || loading

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">MD Translator</h1>
      <p className="text-gray-500 text-sm mb-6">English → Chinese, paragraph by paragraph</p>

      <ApiKeyBanner missing={apiKeyMissing} />

      <div className="mb-6">
        <InputForm onSubmit={handleSubmit} loading={loading} />
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {showToolbar && (
        <div className="mb-4">
          <ModeToolbar mode={mode} onChange={setMode} />
        </div>
      )}

      <ParagraphGrid
        paragraphs={paragraphs}
        mode={mode}
        loading={loading}
        onRetry={handleRetry}
      />
    </main>
  )
}
