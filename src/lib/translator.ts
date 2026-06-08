import OpenAI from 'openai'

const PROMPT_PREFIX =
  'Translate the following English text to Chinese. ' +
  'Preserve all technical terms, code, variable names, and jargon exactly as written. ' +
  'Preserve all markdown formatting exactly (bold, italic, headings, inline code, bullet points, etc). ' +
  'Return only the Chinese translation, no explanation.\n\n'

export async function translateParagraph(text: string, apiKey: string): Promise<string> {
  const client = new OpenAI({ apiKey, baseURL: 'https://api.deepseek.com' })
  const response = await client.chat.completions.create({
    model: 'deepseek-v4-flash',
    messages: [{ role: 'user', content: PROMPT_PREFIX + text }],
  })
  return response.choices[0].message.content?.trim() ?? ''
}
