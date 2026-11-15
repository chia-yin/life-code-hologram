import { useEffect } from 'react'
import type { HologramResult, NodeKey } from '../../lib/hologram'
import { getDigitModes } from './digit-modes'
import { getElementPatterns, type ElementPatternReading } from './element-patterns'
import { DIGIT_PROFILES } from './interpretations'
import { ANALYSIS_GROUPS, POSITION_PROFILES } from './position-profiles'
import { buildElementReason, buildPositionNarrative } from './reading-narrative'

interface AnalysisModalProps {
  result: HologramResult
  isOpen: boolean
  selectedNode?: NodeKey | null
  onClose: () => void
}

function PositionReading({
  node,
  result,
  showModes = false,
}: {
  node: NodeKey
  result: HologramResult
  showModes?: boolean
}) {
  const digit = result.nodes[node]
  const digitProfile = DIGIT_PROFILES[digit]
  const position = POSITION_PROFILES[node]
  const modes = showModes ? getDigitModes(digit) : []

  return (
    <article className="reading__position">
      <div className="reading__position-head">
        <span className="reading__digit" aria-label={`${position.label} 數字 ${digit}`}>{digit}</span>
        <h4>{position.label}</h4>
      </div>
      <strong>{digitProfile.title}｜{digitProfile.keywords}</strong>
      <p className="reading__narrative">{buildPositionNarrative(node, digit)}</p>
      {showModes && (
        <ul className="reading__modes">
          {modes.map((mode) => (
            <li key={mode.id}>
              <span>{mode.label}</span>
              <strong>{mode.value}</strong>
              <p>{mode.summary}</p>
            </li>
          ))}
        </ul>
      )}
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

function ElementPatternCard({ pattern }: { pattern: ElementPatternReading }) {
  return (
    <article className={`element-card element-card--${pattern.id}`}>
      <header>
        <p>{pattern.label}</p>
        <strong>
          {pattern.majorLabel} {pattern.majorDigit} × {pattern.minorLabel} {pattern.minorDigit}
        </strong>
      </header>
      <p className="element-card__active">{buildElementReason(pattern)}</p>
      <div className="element-matrix" aria-label={`${pattern.label}象限`}>
        {pattern.quadrants.map((quadrant) => (
          <div
            key={quadrant.id}
            className={`element-cell ${quadrant.id === pattern.active.id ? 'is-active' : ''}`}
          >
            <span>{quadrant.condition}</span>
            <strong>{quadrant.title}</strong>
            <p>{quadrant.description}</p>
          </div>
        ))}
      </div>
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
          {!selectedNode && (
            <>
              <section className="reading__overview" aria-labelledby="mode-overview-title">
                <h3 id="mode-overview-title">核心行為模式</h3>
                <p>依主性格 {result.nodes.O} 推導四種日常切入方式。</p>
                <ul className="reading__modes reading__modes--overview">
                  {getDigitModes(result.nodes.O).map((mode) => (
                    <li key={mode.id}>
                      <span>{mode.label}</span>
                      <strong>{mode.value}</strong>
                      <p>{mode.summary}</p>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="reading__overview" aria-labelledby="element-overview-title">
                <h3 id="element-overview-title">水火象限</h3>
                <p>依推導圖（如基礎、整合、表達那幾排，不含生日八碼）有無小水 2／大水 7、小火 3／大火 8 判斷。</p>
                <div className="element-grid">
                  {getElementPatterns(result.nodes).map((pattern) => (
                    <ElementPatternCard key={pattern.id} pattern={pattern} />
                  ))}
                </div>
              </section>
            </>
          )}

          {selectedNode ? (
            <div className="reading__positions">
              <PositionReading node={selectedNode} result={result} showModes />
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
