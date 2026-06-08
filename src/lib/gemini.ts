import { GoogleGenerativeAI } from '@google/generative-ai'

const PROMPT_PREFIX =
  'Translate the following English text to Chinese. ' +
  'Preserve all technical terms, code, variable names, and jargon exactly as written. ' +
  'Return only the Chinese translation, no explanation.\n\n'

export async function translateParagraph(text: string, apiKey: string): Promise<string> {
  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite' })
  const result = await model.generateContent(PROMPT_PREFIX + text)
  return result.response.text().trim()
}
