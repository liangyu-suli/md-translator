import fs from 'fs/promises'
import path from 'path'

export interface ParagraphPair {
  en: string
  zh: string
}

export interface CacheEntry {
  hash: string
  source: string
  paragraphs: ParagraphPair[]
  createdAt: string
}

const DEFAULT_CACHE_DIR = path.join(process.cwd(), 'translations')

export async function readCache(hash: string, cacheDir = DEFAULT_CACHE_DIR): Promise<CacheEntry | null> {
  const filePath = path.join(cacheDir, `${hash}.json`)
  try {
    const content = await fs.readFile(filePath, 'utf8')
    return JSON.parse(content) as CacheEntry
  } catch {
    return null
  }
}

export async function writeCache(entry: CacheEntry, cacheDir = DEFAULT_CACHE_DIR): Promise<void> {
  await fs.mkdir(cacheDir, { recursive: true })
  const filePath = path.join(cacheDir, `${entry.hash}.json`)
  await fs.writeFile(filePath, JSON.stringify(entry, null, 2), 'utf8')
}
