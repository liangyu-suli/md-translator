import path from 'path'
import fs from 'fs/promises'
import os from 'os'
import { readCache, writeCache, CacheEntry } from '../cache'

let tmpDir: string

beforeEach(async () => {
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'md-translator-test-'))
})

afterEach(async () => {
  await fs.rm(tmpDir, { recursive: true, force: true })
})

test('readCache returns null when file does not exist', async () => {
  const result = await readCache('nonexistent-hash', tmpDir)
  expect(result).toBeNull()
})

test('writeCache then readCache returns the same entry', async () => {
  const entry: CacheEntry = {
    hash: 'abc123',
    source: 'hello world',
    paragraphs: [{ en: 'hello world', zh: '你好世界' }],
    createdAt: '2026-06-08T00:00:00.000Z',
  }
  await writeCache(entry, tmpDir)
  const result = await readCache('abc123', tmpDir)
  expect(result).toEqual(entry)
})

test('writeCache creates the cache directory if it does not exist', async () => {
  const nestedDir = path.join(tmpDir, 'nested', 'cache')
  const entry: CacheEntry = {
    hash: 'xyz',
    source: 'text',
    paragraphs: [],
    createdAt: '2026-06-08T00:00:00.000Z',
  }
  await expect(writeCache(entry, nestedDir)).resolves.not.toThrow()
  const result = await readCache('xyz', nestedDir)
  expect(result).toEqual(entry)
})
