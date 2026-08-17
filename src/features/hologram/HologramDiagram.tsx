import type { CSSProperties } from 'react'
import type { HologramNode, NodeKey } from '../../lib/hologram'
import { NODE_KEYS } from '../../lib/hologram'
import {
  DIAGRAM_LABELS,
  GLYPH_STROKES,
  NODE_LAYOUT,
  NODE_ROLES,
  REVEAL_PHASE,
  VIEW_BOX,
  toPercent,
} from './node-layout'
import { POSITION_PROFILES } from '../results/position-profiles'

interface HologramDiagramProps {
  nodes?: HologramNode
  onNodeSelect?: (node: NodeKey) => void
}

function withVars(style: CSSProperties, order: number, phase: 1 | 2 | 3) {
  return { ...style, '--order': order, '--phase': phase } as CSSProperties
}

function nodeClass(key: NodeKey) {
  const role = NODE_ROLES[key]
  return `diagram__node is-${role} reveal-phase-${REVEAL_PHASE[key]}`
}

export function HologramDiagram({ nodes, onNodeSelect }: HologramDiagramProps) {
  return (
    <div className={`diagram is-revealing ${nodes ? 'is-filled' : 'is-idle'}`}>
      <svg
        className="diagram__frame"
        viewBox={`0 0 ${VIEW_BOX.width} ${VIEW_BOX.height}`}
        preserveAspectRatio="xMidYMid meet"
        focusable="false"
        aria-hidden="true"
      >
        <g className="diagram__glyph">
          {GLYPH_STROKES.map(({ id, d }, index) => (
            <path key={id} d={d} style={withVars({}, index, 2)} />
          ))}
        </g>
      </svg>

      {nodes && NODE_KEYS.map((key, index) => {
        const position = POSITION_PROFILES[key]
        return (
          <button
            key={key}
            className={nodeClass(key)}
            style={withVars(toPercent(NODE_LAYOUT[key]), index, REVEAL_PHASE[key])}
            type="button"
            aria-label={`${position.label}，數字 ${nodes[key]}，查看解析`}
            title={`查看${position.label}解析`}
            onClick={() => onNodeSelect?.(key)}
          >
            <strong>{nodes[key]}</strong>
          </button>
        )
      })}

      {nodes && DIAGRAM_LABELS.map(({ id, text, position }) => (
        <span
          key={id}
          className={`diagram__label diagram__label--${id} reveal-phase-${id === 'core' ? 3 : 1}`}
          style={toPercent(position)}
        >
          {text}
        </span>
      ))}
    </div>
  )
}
