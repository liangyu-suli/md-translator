'use client'

import { useState } from 'react'

interface InputFormProps {
  onSubmit: (input: { filePath?: string; text?: string }) => void
  loading: boolean
}

type InputMode = 'path' | 'text'

export function InputForm({ onSubmit, loading }: InputFormProps) {
  const [inputMode, setInputMode] = useState<InputMode>('path')
  const [filePath, setFilePath] = useState('')
  const [text, setText] = useState('')

  const isEmpty = inputMode === 'path' ? !filePath.trim() : !text.trim()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputMode === 'path') {
      onSubmit({ filePath: filePath.trim() })
    } else {
      onSubmit({ text: text.trim() })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setInputMode('path')}
          className={`px-3 py-1 rounded text-sm font-medium ${
            inputMode === 'path' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          File Path
        </button>
        <button
          type="button"
          onClick={() => setInputMode('text')}
          className={`px-3 py-1 rounded text-sm font-medium ${
            inputMode === 'text' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Paste Text
        </button>
      </div>

      {inputMode === 'path' ? (
        <input
          type="text"
          value={filePath}
          onChange={e => setFilePath(e.target.value)}
          placeholder="/path/to/your/file.md"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      ) : (
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Paste your markdown here..."
          rows={8}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      )}

      <button
        type="submit"
        disabled={loading || isEmpty}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
      >
        {loading ? 'Translating...' : 'Translate'}
      </button>
    </form>
  )
}
