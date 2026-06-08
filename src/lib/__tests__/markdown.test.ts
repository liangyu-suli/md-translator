import { splitParagraphs } from '../markdown'

test('splits on double newlines', () => {
  const result = splitParagraphs('Hello world\n\nSecond paragraph')
  expect(result).toEqual([
    { en: 'Hello world', shouldTranslate: true },
    { en: 'Second paragraph', shouldTranslate: true },
  ])
})

test('filters empty strings', () => {
  const result = splitParagraphs('\n\nHello\n\n\n\nWorld\n\n')
  expect(result).toEqual([
    { en: 'Hello', shouldTranslate: true },
    { en: 'World', shouldTranslate: true },
  ])
})

test('translates headings', () => {
  const result = splitParagraphs('# Title\n\nSome text')
  expect(result).toEqual([
    { en: '# Title', shouldTranslate: true },
    { en: 'Some text', shouldTranslate: true },
  ])
})

test('translates ## headings', () => {
  const result = splitParagraphs('## Section\n\nBody text')
  expect(result).toEqual([
    { en: '## Section', shouldTranslate: true },
    { en: 'Body text', shouldTranslate: true },
  ])
})

test('marks code fences as no-translate', () => {
  const result = splitParagraphs('```js\nconst x = 1\n```\n\nSome text')
  expect(result).toEqual([
    { en: '```js\nconst x = 1\n```', shouldTranslate: false },
    { en: 'Some text', shouldTranslate: true },
  ])
})

test('marks horizontal rules as no-translate', () => {
  const result = splitParagraphs('---\n\nBody')
  expect(result).toEqual([
    { en: '---', shouldTranslate: false },
    { en: 'Body', shouldTranslate: true },
  ])
})

test('returns empty array for empty input', () => {
  expect(splitParagraphs('')).toEqual([])
  expect(splitParagraphs('   \n\n   ')).toEqual([])
})
