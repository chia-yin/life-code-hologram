import { describe, expect, it } from 'vitest'
import { parseBirthday } from '../../lib/hologram'
import { getElementPatterns } from './element-patterns'
import {
  buildCoreNarrative,
  buildElementReason,
  buildPositionNarrative,
} from './reading-narrative'

describe('reading narrative helpers', () => {
  it('主性格敘事串起數字標題與描述', () => {
    const text = buildCoreNarrative(5)
    expect(text).toContain('主性格落在 5「彈性探索」')
    expect(text).toContain('透過移動、嘗試與直接經驗')
  })

  it('水火落點說明寫出條件與象限標題', () => {
    const water = getElementPatterns(parseBirthday('1984-12-25').nodes).find((item) => item.id === 'water')
    expect(water).toBeDefined()
    const text = buildElementReason(water!)
    expect(text).toContain('全圖有2、有7')
    expect(text).toContain('極度冰封')
    expect(text).toContain('極愛冷暴力')
  })

  it('位置敘事把角色與數字特質合成一句', () => {
    const text = buildPositionNarrative('O', 5)
    expect(text).toContain('核心主性格')
    expect(text).toContain('判斷、選擇與自我定位的核心模式')
    expect(text).toContain('數字 5「彈性探索」')
    expect(text).toContain('變化、自由、經驗')
  })
})
