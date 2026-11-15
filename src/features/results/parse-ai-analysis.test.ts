import { describe, expect, it } from 'vitest'
import { parseAiAnalysis } from './parse-ai-analysis'

describe('parseAiAnalysis', () => {
  it('把 ## 標題拆成面向區塊，並去掉井號', () => {
    const blocks = parseAiAnalysis(`## 人格輪廓
這個人外放而敏銳。

## 核心主性格
數字 3 偏向創意表達。
- 優勢：感染力
- 提醒：別散焦`)

    expect(blocks).toHaveLength(2)
    expect(blocks[0].title).toBe('人格輪廓')
    expect(blocks[0].paragraphs).toEqual(['這個人外放而敏銳。'])
    expect(blocks[1].title).toBe('核心主性格')
    expect(blocks[1].bullets).toEqual(['優勢：感染力', '提醒：別散焦'])
  })

  it('相容 ### 與編號標題', () => {
    const blocks = parseAiAnalysis(`### 1. 總結整體人格輪廓
第一段。

2. 核心主性格解析
第二段。`)

    expect(blocks.map((block) => block.title)).toEqual([
      '總結整體人格輪廓',
      '核心主性格解析',
    ])
  })
})
