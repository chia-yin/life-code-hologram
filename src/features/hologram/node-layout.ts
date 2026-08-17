import type { NodeKey } from '../../lib/hologram'

export type NodePosition = readonly [number, number]

export const VIEW_BOX = { width: 970, height: 930 } as const

const WING_ROW = 310
const CORE_ROW = 525
const PAIR_ROW = 675
const INPUT_ROW = 800

export const NODE_LAYOUT: Record<NodeKey, NodePosition> = {
  R: [485, 50],
  Q: [365, 135],
  P: [605, 135],
  O: [485, WING_ROW],
  S: [40, WING_ROW],
  X: [160, WING_ROW],
  W: [255, WING_ROW],
  V: [715, WING_ROW],
  U: [810, WING_ROW],
  T: [930, WING_ROW],
  M: [385, CORE_ROW],
  N: [585, CORE_ROW],
  I: [245, PAIR_ROW],
  J: [405, PAIR_ROW],
  K: [565, PAIR_ROW],
  L: [725, PAIR_ROW],
  A: [205, INPUT_ROW],
  B: [285, INPUT_ROW],
  C: [365, INPUT_ROW],
  D: [445, INPUT_ROW],
  E: [525, INPUT_ROW],
  F: [605, INPUT_ROW],
  G: [685, INPUT_ROW],
  H: [765, INPUT_ROW],
}

type StrokeWidths = readonly [number, number, number]

const round = (value: number) => Math.round(value * 10) / 10

/**
 * 由中軸的起、中、收三點與對應筆寬，算出帶起收筆的封閉輪廓，
 * 讓「全」字有書法的粗細變化而非等寬線段。
 */
function brushStroke(from: NodePosition, mid: NodePosition, to: NodePosition, widths: StrokeWidths) {
  const control: NodePosition = [
    2 * mid[0] - (from[0] + to[0]) / 2,
    2 * mid[1] - (from[1] + to[1]) / 2,
  ]

  const tangents: NodePosition[] = [
    [control[0] - from[0], control[1] - from[1]],
    [(to[0] - from[0]) / 2, (to[1] - from[1]) / 2],
    [to[0] - control[0], to[1] - control[1]],
  ]

  const rims = [from, mid, to].map((center, index) => {
    const [tx, ty] = tangents[index]
    const length = Math.hypot(tx, ty) || 1
    const half = widths[index] / 2
    const nx = (-ty / length) * half
    const ny = (tx / length) * half
    return {
      left: [center[0] + nx, center[1] + ny] as NodePosition,
      right: [center[0] - nx, center[1] - ny] as NodePosition,
    }
  })

  const point = ([x, y]: NodePosition) => `${round(x)} ${round(y)}`
  const edge = (start: NodePosition, middle: NodePosition, end: NodePosition) => {
    const bend: NodePosition = [
      2 * middle[0] - (start[0] + end[0]) / 2,
      2 * middle[1] - (start[1] + end[1]) / 2,
    ]
    return `Q ${point(bend)} ${point(end)}`
  }

  const [head, waist, tail] = rims
  return [
    `M ${point(head.left)}`,
    edge(head.left, waist.left, tail.left),
    `L ${point(tail.right)}`,
    edge(tail.right, waist.right, head.right),
    'Z',
  ].join(' ')
}

/** 「全」字六筆，依書寫順序：撇、捺、上橫、中橫、豎、下橫 */
const GLYPH_SKELETON: readonly {
  id: string
  from: NodePosition
  mid: NodePosition
  to: NodePosition
  widths: StrokeWidths
}[] = [
  { id: 'pie', from: [489, 186], mid: [345, 288], to: [172, 406], widths: [26, 17, 4] },
  { id: 'na', from: [479, 194], mid: [670, 322], to: [802, 412], widths: [10, 22, 5] },
  { id: 'bar-top', from: [300, 473], mid: [485, 468], to: [672, 466], widths: [17, 12, 21] },
  { id: 'bar-middle', from: [324, 603], mid: [486, 598], to: [650, 596], widths: [16, 11, 19] },
  { id: 'stem', from: [487, 466], mid: [490, 601], to: [487, 736], widths: [21, 17, 18] },
  { id: 'bar-bottom', from: [240, 741], mid: [485, 735], to: [732, 732], widths: [18, 13, 22] },
]

export const GLYPH_STROKES: readonly { id: string; d: string }[] = GLYPH_SKELETON.map(
  ({ id, from, mid, to, widths }) => ({ id, d: brushStroke(from, mid, to, widths) }),
)

export interface DiagramLabel {
  id: string
  text: string
  position: NodePosition
}

export const DIAGRAM_LABELS: readonly DiagramLabel[] = [
  { id: 'core', text: '主性格', position: [485, 385] },
  { id: 'sum-left', text: '=', position: [100, WING_ROW] },
  { id: 'sum-right', text: '=', position: [870, WING_ROW] },
  { id: 'birthday', text: '西元生日', position: [95, INPUT_ROW] },
  { id: 'day', text: '日期', position: [245, 865] },
  { id: 'month', text: '月份', position: [405, 865] },
  { id: 'year', text: '年份', position: [645, 865] },
]

export type NodeRole = 'birthday' | 'foundation' | 'bridge' | 'core' | 'outer' | 'wing'

export const NODE_ROLES: Record<NodeKey, NodeRole> = {
  A: 'birthday', B: 'birthday', C: 'birthday', D: 'birthday',
  E: 'birthday', F: 'birthday', G: 'birthday', H: 'birthday',
  I: 'foundation', J: 'foundation', K: 'foundation', L: 'foundation',
  M: 'bridge', N: 'bridge',
  O: 'core',
  P: 'outer', Q: 'outer', R: 'outer',
  X: 'wing', W: 'wing', S: 'wing',
  V: 'wing', U: 'wing', T: 'wing',
}

/** 揭曉儀式：生日 → 路徑 → 核心 */
export const REVEAL_PHASE: Record<NodeKey, 1 | 2 | 3> = {
  A: 1, B: 1, C: 1, D: 1, E: 1, F: 1, G: 1, H: 1,
  I: 2, J: 2, K: 2, L: 2, M: 2, N: 2,
  X: 2, W: 2, V: 2, U: 2, S: 2, T: 2,
  P: 2, Q: 2, R: 2,
  O: 3,
}

export function toPercent([x, y]: NodePosition) {
  return {
    left: `${(x / VIEW_BOX.width) * 100}%`,
    top: `${(y / VIEW_BOX.height) * 100}%`,
  }
}
