import { describe, expect, it } from 'vitest'
import { parseBirthday } from '../../lib/hologram'
import { buildAiPrompt } from './ai-prompt'

describe('buildAiPrompt', () => {
  it('組出含主性格、模式與水火象限的整體解析提示', () => {
    const prompt = buildAiPrompt(parseBirthday('2000-01-01'), 'overall')
    expect(prompt).toContain('西元生日：2000-01-01')
    expect(prompt).toContain('核心主性格')
    expect(prompt).toContain('年份後段')
    expect(prompt).toContain('思維節奏：少做多想')
    expect(prompt).toContain('閃電火花')
    expect(prompt).toContain('若兩個加數都是 0，特殊記為 5')
    expect(prompt).toContain('用一段話總結整體人格輪廓')
  })

  it('銷售面向帶入對應提問', () => {
    const prompt = buildAiPrompt(parseBirthday('1984-12-25'), 'sales')
    expect(prompt).toContain('如何向這個人銷售')
    expect(prompt).toContain('極度冰封')
  })
})
