import { useEffect } from 'react'
import type { HologramResult, NodeKey } from '../../lib/hologram'
import { DIGIT_PROFILES } from './interpretations'
import { ANALYSIS_GROUPS, POSITION_PROFILES } from './position-profiles'

interface AnalysisModalProps {
  result: HologramResult
  isOpen: boolean
  selectedNode?: NodeKey | null
  onClose: () => void
}

function PositionReading({ node, result }: { node: NodeKey; result: HologramResult }) {
  const digit = result.nodes[node]
  const digitProfile = DIGIT_PROFILES[digit]
  const position = POSITION_PROFILES[node]

  return (
    <article className="reading__position">
      <div className="reading__position-head">
        <span className="reading__digit" aria-label={`${position.label} 數字 ${digit}`}>{digit}</span>
        <h4>{position.label}</h4>
      </div>
      <p className="reading__role">位置功能：{position.role}</p>
      <strong>{digitProfile.title}｜{digitProfile.keywords}</strong>
      <p>{digitProfile.description}</p>
      <dl>
        <div>
          <dt>優勢表現</dt>
          <dd>{digitProfile.strength}</dd>
        </div>
        <div>
          <dt>壓力盲點</dt>
          <dd>{digitProfile.challenge}</dd>
        </div>
        <div>
          <dt>發展建議</dt>
          <dd>{digitProfile.development}</dd>
        </div>
      </dl>
    </article>
  )
}

export function AnalysisModal({ result, isOpen, selectedNode, onClose }: AnalysisModalProps) {
  useEffect(() => {
    if (!isOpen) return

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="modal" role="presentation" onMouseDown={onClose}>
      <section
        className={`modal__panel ${selectedNode ? 'is-focused' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="analysis-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="modal__close" type="button" aria-label="關閉結構解析" onClick={onClose}>
          ×
        </button>

        <div className="modal__intro">
          <h2 id="analysis-title">
            {selectedNode ? `${POSITION_PROFILES[selectedNode].label}解析` : '生命密碼結構解析'}
          </h2>
        </div>

        <div className={`reading ${selectedNode ? 'reading--focused' : ''}`}>
          {selectedNode ? (
            <div className="reading__positions">
              <PositionReading node={selectedNode} result={result} />
            </div>
          ) : ANALYSIS_GROUPS.map((group) => (
            <section key={group.id} className="reading__group" aria-labelledby={`group-${group.id}`}>
              <h3 id={`group-${group.id}`}>{group.title}</h3>
              <div className="reading__positions">
                {group.nodes.map((node) => (
                  <PositionReading key={node} node={node} result={result} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </div>
  )
}
