import { Paragraph } from './markdown'
import { translateParagraph } from './gemini'

export interface TranslationResult {
  index: number
  en: string
  zh: string
  error?: string
}

const CONCURRENCY = 5

export async function translateParagraphs(
  paragraphs: Paragraph[],
  apiKey: string,
  onResult: (result: TranslationResult) => void
): Promise<void> {
  let next = 0

  const worker = async () => {
    while (next < paragraphs.length) {
      const index = next++
      const para = paragraphs[index]
      if (!para.shouldTranslate) {
        onResult({ index, en: para.en, zh: para.en })
        continue
      }
      try {
        const zh = await translateParagraph(para.en, apiKey)
        onResult({ index, en: para.en, zh })
      } catch (err) {
        onResult({
          index,
          en: para.en,
          zh: para.en,
          error: err instanceof Error ? err.message : 'Translation failed',
        })
      }
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, paragraphs.length) }, worker)
  )
}
