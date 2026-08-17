import { describe, expect, it } from 'vitest'
import { NODE_KEYS } from '../../lib/hologram'
import {
  GLYPH_STROKES,
  NODE_LAYOUT,
  NODE_ROLES,
  REVEAL_PHASE,
  VIEW_BOX,
  toPercent,
} from './node-layout'

describe('hologram node topology', () => {
  it('包含所有計算節點與有限座標', () => {
    expect(Object.keys(NODE_LAYOUT).sort()).toEqual([...NODE_KEYS].sort())
    Object.values(NODE_LAYOUT).forEach((position) => {
      expect(position.every(Number.isFinite)).toBe(true)
    })
  })

  it('以 O 為中軸、R 為最高點、S/T 分居兩翼', () => {
    const centerX = VIEW_BOX.width / 2
    expect(NODE_LAYOUT.O[0]).toBe(centerX)
    expect(NODE_LAYOUT.R[1]).toBeLessThan(
      Math.min(...Object.entries(NODE_LAYOUT).filter(([key]) => key !== 'R').map(([, p]) => p[1])),
    )
    expect(NODE_LAYOUT.S[0]).toBeLessThan(centerX)
    expect(NODE_LAYOUT.T[0]).toBeGreaterThan(centerX)
  })

  it('左右對應節點沿中軸鏡像對齊', () => {
    const centerX = VIEW_BOX.width / 2
    const mirrored: [keyof typeof NODE_LAYOUT, keyof typeof NODE_LAYOUT][] = [
      ['Q', 'P'], ['M', 'N'], ['I', 'L'], ['J', 'K'],
      ['W', 'V'], ['X', 'U'], ['S', 'T'],
    ]

    mirrored.forEach(([left, right]) => {
      expect(centerX - NODE_LAYOUT[left][0]).toBeCloseTo(NODE_LAYOUT[right][0] - centerX)
      expect(NODE_LAYOUT[left][1]).toBe(NODE_LAYOUT[right][1])
    })
  })

  it('每個衍生節點排在其來源節點的上一列', () => {
    const stacked: [keyof typeof NODE_LAYOUT, keyof typeof NODE_LAYOUT][] = [
      ['I', 'A'], ['J', 'C'], ['K', 'E'], ['L', 'G'],
      ['M', 'I'], ['N', 'K'], ['O', 'M'], ['R', 'Q'],
    ]

    stacked.forEach(([upper, lower]) => {
      expect(NODE_LAYOUT[upper][1]).toBeLessThan(NODE_LAYOUT[lower][1])
    })
  })

  it('輸入位對齊其配對節點的中線', () => {
    const pairs: [keyof typeof NODE_LAYOUT, [keyof typeof NODE_LAYOUT, keyof typeof NODE_LAYOUT]][] = [
      ['I', ['A', 'B']], ['J', ['C', 'D']], ['K', ['E', 'F']], ['L', ['G', 'H']],
    ]

    pairs.forEach(([node, [first, second]]) => {
      const midpoint = (NODE_LAYOUT[first][0] + NODE_LAYOUT[second][0]) / 2
      expect(NODE_LAYOUT[node][0]).toBeCloseTo(midpoint)
    })
  })

  it('所有節點落在字圖取景範圍內', () => {
    Object.values(NODE_LAYOUT).forEach(([x, y]) => {
      expect(x).toBeGreaterThanOrEqual(0)
      expect(x).toBeLessThanOrEqual(VIEW_BOX.width)
      expect(y).toBeGreaterThanOrEqual(0)
      expect(y).toBeLessThanOrEqual(VIEW_BOX.height)
    })
  })

  it('字骨架依書寫順序包含撇、捺、三橫與中軸豎筆', () => {
    expect(GLYPH_STROKES.map((stroke) => stroke.id)).toEqual([
      'pie', 'na', 'bar-top', 'bar-middle', 'stem', 'bar-bottom',
    ])
  })

  it('每一筆都是帶粗細變化的封閉輪廓', () => {
    GLYPH_STROKES.forEach(({ d }) => {
      expect(d.startsWith('M ')).toBe(true)
      expect(d.endsWith('Z')).toBe(true)
      expect(d.match(/Q /g)).toHaveLength(2)
      expect(d.split(/[ ,]/).some((token) => token !== '' && Number.isNaN(Number(token)) && !'MQLZ'.includes(token))).toBe(false)
    })
  })

  it('把節點座標換算成容器百分比', () => {
    expect(toPercent(NODE_LAYOUT.O)).toEqual({ left: '50%', top: `${(310 / 930) * 100}%` })
  })

  it('為每個節點標註角色與揭曉階段', () => {
    expect(NODE_KEYS.every((key) => NODE_ROLES[key] && REVEAL_PHASE[key])).toBe(true)
    expect(NODE_ROLES.O).toBe('core')
    expect(REVEAL_PHASE.O).toBe(3)
    expect(REVEAL_PHASE.A).toBe(1)
    expect(REVEAL_PHASE.I).toBe(2)
  })
})
