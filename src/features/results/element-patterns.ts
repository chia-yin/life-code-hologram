import type { HologramNode } from '../../lib/hologram'
import { NODE_KEYS } from '../../lib/hologram'

export type ElementPatternId = 'water' | 'fire'

export interface ElementQuadrant {
  id: string
  condition: string
  title: string
  description: string
  hasMinor: boolean
  hasMajor: boolean
}

export interface ElementPatternReading {
  id: ElementPatternId
  label: string
  minorDigit: number
  majorDigit: number
  minorLabel: string
  majorLabel: string
  hasMinor: boolean
  hasMajor: boolean
  active: ElementQuadrant
  quadrants: readonly ElementQuadrant[]
}

/** 顯示順序對應象限圖：左上、右上、左下、右下 */
const WATER_QUADRANTS: readonly ElementQuadrant[] = [
  {
    id: 'water-major',
    condition: '沒2、有7',
    title: '深海暗流',
    description: '不易冷暴力，但一旦觸發一次就長達半年。',
    hasMinor: false,
    hasMajor: true,
  },
  {
    id: 'water-both',
    condition: '有2、有7',
    title: '極度冰封',
    description: '極愛冷暴力，捂也捂不化。',
    hasMinor: true,
    hasMajor: true,
  },
  {
    id: 'water-none',
    condition: '沒2、沒7',
    title: '絕緣體',
    description: '完全不知道什麼是冷暴力。',
    hasMinor: false,
    hasMajor: false,
  },
  {
    id: 'water-minor',
    condition: '有2、沒7',
    title: '陣發微寒',
    description: '時不時小冷暴力，哄一哄就化了。',
    hasMinor: true,
    hasMajor: false,
  },
]

/** 顯示順序對應象限圖：左上、右上、左下、右下 */
const FIRE_QUADRANTS: readonly ElementQuadrant[] = [
  {
    id: 'fire-major',
    condition: '沒3、有8',
    title: '森林大火',
    description: '平時不容易生氣，一旦生氣就像爆炸一樣大。',
    hasMinor: false,
    hasMajor: true,
  },
  {
    id: 'fire-both',
    condition: '有3、有8',
    title: '零星燃點',
    description: '小事很愛上火，大事反而不著急。',
    hasMinor: true,
    hasMajor: true,
  },
  {
    id: 'fire-none',
    condition: '沒3、沒8',
    title: '溫和防火牆',
    description: '一貫好脾氣，根本不知道地雷在哪裡。',
    hasMinor: false,
    hasMajor: false,
  },
  {
    id: 'fire-minor',
    condition: '有3、沒8',
    title: '閃電火花',
    description: '一點就燃，情緒來得快去得快。',
    hasMinor: true,
    hasMajor: false,
  },
]

function hasDigit(nodes: HologramNode, digit: number) {
  return NODE_KEYS.some((key) => nodes[key] === digit)
}

function pickQuadrant(
  quadrants: readonly ElementQuadrant[],
  hasMinor: boolean,
  hasMajor: boolean,
) {
  const match = quadrants.find(
    (quadrant) => quadrant.hasMinor === hasMinor && quadrant.hasMajor === hasMajor,
  )
  if (!match) throw new Error('找不到對應象限')
  return match
}

export function getElementPatterns(nodes: HologramNode): ElementPatternReading[] {
  const has2 = hasDigit(nodes, 2)
  const has7 = hasDigit(nodes, 7)
  const has3 = hasDigit(nodes, 3)
  const has8 = hasDigit(nodes, 8)

  return [
    {
      id: 'water',
      label: '水象冷暴力',
      minorDigit: 2,
      majorDigit: 7,
      minorLabel: '小水',
      majorLabel: '大水',
      hasMinor: has2,
      hasMajor: has7,
      active: pickQuadrant(WATER_QUADRANTS, has2, has7),
      quadrants: WATER_QUADRANTS,
    },
    {
      id: 'fire',
      label: '火象情緒',
      minorDigit: 3,
      majorDigit: 8,
      minorLabel: '小火',
      majorLabel: '大火',
      hasMinor: has3,
      hasMajor: has8,
      active: pickQuadrant(FIRE_QUADRANTS, has3, has8),
      quadrants: FIRE_QUADRANTS,
    },
  ]
}
