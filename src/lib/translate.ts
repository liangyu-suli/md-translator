import { Paragraph } from './markdown'
import { translateParagraph } from './gemini'

export interface TranslationResult {
  index: number
  en: string
  zh: string
  error?: string
}

export async function translateParagraphs(
  paragraphs: Paragraph[],
  apiKey: string,
  onResult: (result: TranslationResult) => void
): Promise<void> {
  await Promise.all(
    paragraphs.map(async (para, index) => {
      if (!para.shouldTranslate) {
        onResult({ index, en: para.en, zh: para.en })
        return
      }
      try {
        const zh = await translateParagraph(para.en, apiKey)
        onResult({ index, en: para.en, zh })
      } catch (err) {
        onResult({
          index,
          en: para.en,
          zh: '',
          error: err instanceof Error ? err.message : 'Translation failed',
        })
      }
    })
  )
}
