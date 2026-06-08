'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { DisplayMode } from './ModeToolbar'

export interface ParagraphState {
  index: number
  en: string
  zh: string
  status: 'loading' | 'done' | 'error'
  error?: string
}

interface ParagraphCardProps {
  paragraph: ParagraphState
  mode: DisplayMode
  onRetry: (index: number, en: string) => void
}

export function ParagraphCard({ paragraph, mode, onRetry }: ParagraphCardProps) {
  if (paragraph.status === 'loading') {
    return (
      <div className="animate-pulse">
        <div className={`grid gap-4 ${mode === 'hybrid' ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {(mode === 'hybrid' || mode === 'en') && (
            <div className="h-16 bg-gray-100 rounded" />
          )}
          {(mode === 'hybrid' || mode === 'zh') && (
            <div className="h-16 bg-gray-100 rounded" />
          )}
        </div>
      </div>
    )
  }

  if (paragraph.status === 'error') {
    return (
      <div className="border border-red-200 rounded-lg p-3 bg-red-50">
        <p className="text-sm text-gray-700 font-mono mb-2 whitespace-pre-wrap">{paragraph.en}</p>
        <p className="text-sm text-red-600">{paragraph.error}</p>
        <button
          onClick={() => onRetry(paragraph.index, paragraph.en)}
          className="mt-2 text-sm px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className={`grid gap-4 ${mode === 'hybrid' ? 'grid-cols-2' : 'grid-cols-1'}`}>
      {(mode === 'hybrid' || mode === 'en') && (
        <div className="prose prose-sm max-w-none text-gray-800">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{paragraph.en}</ReactMarkdown>
        </div>
      )}
      {(mode === 'hybrid' || mode === 'zh') && (
        <div className="prose prose-sm max-w-none text-gray-800">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{paragraph.zh}</ReactMarkdown>
        </div>
      )}
    </div>
  )
}
