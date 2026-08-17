import { describe, expect, it } from 'vitest'
import { NODE_KEYS } from '../../lib/hologram'
import { ANALYSIS_GROUPS, POSITION_PROFILES } from './position-profiles'

describe('全息圖位置語意表', () => {
  it('完整記錄 24 個節點的位置、來源與解析角色', () => {
    expect(Object.keys(POSITION_PROFILES).sort()).toEqual([...NODE_KEYS].sort())

    NODE_KEYS.forEach((node) => {
      const position = POSITION_PROFILES[node]
      expect(position.label).not.toBe('')
      expect(position.source).not.toBe('')
      expect(position.role).not.toBe('')
    })
  })

  it('解析分組涵蓋每個節點且不重複', () => {
    const groupedNodes = ANALYSIS_GROUPS.flatMap((group) => group.nodes)
    expect(groupedNodes).toHaveLength(NODE_KEYS.length)
    expect(new Set(groupedNodes).size).toBe(NODE_KEYS.length)
    expect([...groupedNodes].sort()).toEqual([...NODE_KEYS].sort())
  })

  it('核心與側翼來源符合計算式', () => {
    expect(POSITION_PROFILES.O.source).toBe('M＋N')
    expect(POSITION_PROFILES.P.source).toBe('M＋O')
    expect(POSITION_PROFILES.Q.source).toBe('N＋O')
    expect(POSITION_PROFILES.S.source).toBe('X＋W')
    expect(POSITION_PROFILES.T.source).toBe('V＋U')
  })
})
