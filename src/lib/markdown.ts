export interface Paragraph {
  en: string
  shouldTranslate: boolean
}

export function splitParagraphs(content: string): Paragraph[] {
  return content
    .split(/\n\n+/)
    .map(p => p.trim())
    .filter(p => p.length > 0)
    .map(p => ({ en: p, shouldTranslate: !isNonTranslatable(p) }))
}

function isNonTranslatable(p: string): boolean {
  return /^#{1,6}\s/.test(p) || /^-{3,}$/.test(p) || p.startsWith('```')
}
