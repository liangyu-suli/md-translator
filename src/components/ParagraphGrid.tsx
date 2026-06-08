'use client'

import { ParagraphCard, ParagraphState } from './ParagraphCard'
import { DisplayMode } from './ModeToolbar'

interface ParagraphGridProps {
  paragraphs: ParagraphState[]
  mode: DisplayMode
  loading: boolean
  onRetry: (index: number, en: string) => void
}

export function ParagraphGrid({ paragraphs, mode, loading, onRetry }: ParagraphGridProps) {
  if (loading && paragraphs.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {paragraphs.map(para => (
        <div key={para.index} className="border-b border-gray-100 pb-6 last:border-0">
          <ParagraphCard paragraph={para} mode={mode} onRetry={onRetry} />
        </div>
      ))}
    </div>
  )
}
