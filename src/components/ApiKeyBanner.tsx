'use client'

interface ApiKeyBannerProps {
  missing: boolean
}

export function ApiKeyBanner({ missing }: ApiKeyBannerProps) {
  if (!missing) return null
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <p className="text-red-800 font-semibold">DEEPSEEK_API_KEY is not set</p>
      <p className="text-red-600 text-sm mt-1">
        Create a <code className="bg-red-100 px-1 rounded">.env.local</code> file in the project root with:
      </p>
      <pre className="bg-red-100 rounded p-2 mt-2 text-sm text-red-800 font-mono">
        DEEPSEEK_API_KEY=your_key_here
      </pre>
      <p className="text-red-600 text-sm mt-2">Then restart the dev server.</p>
    </div>
  )
}
