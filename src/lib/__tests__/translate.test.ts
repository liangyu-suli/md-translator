import { translateParagraphs, TranslationResult } from '../translate'
import { Paragraph } from '../markdown'

jest.mock('../gemini', () => ({
  translateParagraph: jest.fn().mockImplementation((text: string) =>
    Promise.resolve(`ZH:${text}`)
  ),
}))

test('calls onResult for each paragraph', async () => {
  const paragraphs: Paragraph[] = [
    { en: 'Hello', shouldTranslate: true },
    { en: 'World', shouldTranslate: true },
  ]
  const results: TranslationResult[] = []
  await translateParagraphs(paragraphs, 'fake-key', r => results.push(r))
  expect(results).toHaveLength(2)
  expect(results.find(r => r.index === 0)).toEqual({ index: 0, en: 'Hello', zh: 'ZH:Hello' })
  expect(results.find(r => r.index === 1)).toEqual({ index: 1, en: 'World', zh: 'ZH:World' })
})

test('passes shouldTranslate=false paragraphs through unchanged (zh = en)', async () => {
  const paragraphs: Paragraph[] = [
    { en: '# Heading', shouldTranslate: false },
    { en: 'Body text', shouldTranslate: true },
  ]
  const results: TranslationResult[] = []
  await translateParagraphs(paragraphs, 'fake-key', r => results.push(r))
  const heading = results.find(r => r.index === 0)!
  expect(heading.zh).toBe('# Heading')
  expect(heading.error).toBeUndefined()
})

test('captures per-paragraph errors without throwing', async () => {
  const { translateParagraph } = require('../gemini')
  translateParagraph.mockRejectedValueOnce(new Error('quota'))

  const paragraphs: Paragraph[] = [
    { en: 'Fail this', shouldTranslate: true },
    { en: 'Succeed this', shouldTranslate: true },
  ]
  const results: TranslationResult[] = []
  await translateParagraphs(paragraphs, 'fake-key', r => results.push(r))

  expect(results).toHaveLength(2)
  const failed = results.find(r => r.en === 'Fail this')!
  expect(failed.error).toBe('quota')
  expect(failed.zh).toBe('Fail this')
  const succeeded = results.find(r => r.en === 'Succeed this')!
  expect(succeeded.zh).toBe('ZH:Succeed this')
})
