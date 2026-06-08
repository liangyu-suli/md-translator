'use client'

export type DisplayMode = 'hybrid' | 'en' | 'zh'

interface ModeToolbarProps {
  mode: DisplayMode
  onChange: (mode: DisplayMode) => void
}

const MODES: { value: DisplayMode; label: string }[] = [
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'en', label: 'EN' },
  { value: 'zh', label: 'ZH' },
]

export function ModeToolbar({ mode, onChange }: ModeToolbarProps) {
  return (
    <div className="flex gap-1 p-1 bg-gray-100 rounded-lg w-fit">
      {MODES.map(m => (
        <button
          key={m.value}
          onClick={() => onChange(m.value)}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
            mode === m.value
              ? 'bg-white shadow text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {m.label}
        </button>
      ))}
    </div>
  )
}
