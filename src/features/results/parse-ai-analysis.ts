export interface AnalysisBlock {
  title: string
  paragraphs: string[]
  bullets: string[]
}

const HEADING_RE = /^(#{1,6}\s+|【|（?\d+[.)、]\s*)/
const BULLET_RE = /^[-*•]\s+/

function cleanHeading(line: string) {
  return line
    .replace(/^#{1,6}\s+/, '')
    .replace(/^【\s*/, '')
    .replace(/\s*】$/, '')
    .replace(/^[（(]?\d+[.)、]\s*/, '')
    .trim()
}

/** 把 AI 回傳文字拆成可呈現的面向區塊 */
export function parseAiAnalysis(text: string): AnalysisBlock[] {
  const lines = text.replace(/\r\n/g, '\n').split('\n')
  const blocks: AnalysisBlock[] = []
  let current: AnalysisBlock | null = null

  function pushCurrent() {
    if (!current) return
    if (current.title || current.paragraphs.length || current.bullets.length) {
      blocks.push(current)
    }
    current = null
  }

  for (const raw of lines) {
    const line = raw.trim()
    if (!line) continue

    const looksLikeHeading =
      /^#{1,6}\s+\S/.test(line) ||
      /^【.+】$/.test(line) ||
      /^\d+[.)、]\s+\S/.test(line)

    if (looksLikeHeading && HEADING_RE.test(line)) {
      pushCurrent()
      current = { title: cleanHeading(line), paragraphs: [], bullets: [] }
      continue
    }

    if (!current) {
      current = { title: '', paragraphs: [], bullets: [] }
    }

    if (BULLET_RE.test(line)) {
      current.bullets.push(line.replace(BULLET_RE, '').trim())
      continue
    }

    current.paragraphs.push(line)
  }

  pushCurrent()

  if (blocks.length === 1 && !blocks[0].title && blocks[0].paragraphs.length) {
    return blocks
  }

  return blocks.filter((block) => block.title || block.paragraphs.length || block.bullets.length)
}
