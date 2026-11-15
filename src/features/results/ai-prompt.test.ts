import { describe, expect, it } from 'vitest'
import { parseBirthday } from '../../lib/hologram'
import { buildAiPrompt, buildBasicAnalysisBrief, PROMPT_FOCUSES } from './ai-prompt'

describe('buildAiPrompt', () => {
  it('只提供兩個協助讀懂的角度', () => {
    expect(PROMPT_FOCUSES.map((item) => item.id)).toEqual(['explain', 'connect'])
  })

  it('基本分析摘要與頁面區塊對齊', () => {
    const brief = buildBasicAnalysisBrief(parseBirthday('1984-12-25'))
    expect(brief).toContain('核心主性格：5「彈性探索」')
    expect(brief).toContain('思維節奏：多做想少')
    expect(brief).toContain('極度冰封')
    expect(brief).toContain('日期基礎')
    expect(brief).toContain('個人面向表達')
    expect(brief).toContain('社會面向表達')
  })

  it('提示詞以基本分析為主軸並要求協助讀懂', () => {
    const prompt = buildAiPrompt(parseBirthday('2000-01-01'), 'explain')
    expect(prompt).toContain('頁面基本分析')
    expect(prompt).toContain('讀懂上方基本分析')
    expect(prompt).toContain('四種行為模式')
    expect(prompt).toContain('核心主性格：9')
    expect(prompt).toContain('## 面向名稱')
  })

  it('串聯角度帶入一致與拉扯提醒', () => {
    const prompt = buildAiPrompt(parseBirthday('1984-12-25'), 'connect')
    expect(prompt).toContain('串成一幅可理解的圖')
    expect(prompt).toContain('拉扯之處')
    expect(prompt).toContain('極度冰封')
  })
})
