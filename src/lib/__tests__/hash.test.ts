import { hashContent } from '../hash'

test('returns a 64-character hex string', () => {
  const hash = hashContent('hello world')
  expect(hash).toMatch(/^[0-9a-f]{64}$/)
})

test('is deterministic — same input gives same output', () => {
  expect(hashContent('same content')).toBe(hashContent('same content'))
})

test('different content gives different hash', () => {
  expect(hashContent('content a')).not.toBe(hashContent('content b'))
})

test('empty string produces a valid hash', () => {
  const hash = hashContent('')
  expect(hash).toMatch(/^[0-9a-f]{64}$/)
})
