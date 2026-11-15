import type { HologramResult } from '../../lib/hologram'
import { getDigitModes } from './digit-modes'
import { getElementPatterns } from './element-patterns'
import { DIGIT_PROFILES } from './interpretations'
import { POSITION_PROFILES } from './position-profiles'

interface BasicAnalysisProps {
  result: HologramResult
}

export function BasicAnalysis({ result }: BasicAnalysisProps) {
  const coreDigit = result.nodes.O
  const coreProfile = DIGIT_PROFILES[coreDigit]
  const modes = getDigitModes(coreDigit)
  const elements = getElementPatterns(result.nodes)
  const inner = POSITION_PROFILES.I
  const outerLeft = POSITION_PROFILES.P
  const outerRight = POSITION_PROFILES.Q

  return (
    <section className="basic-analysis panel" id="basic-analysis" aria-labelledby="basic-analysis-title">
      <div className="basic-analysis__intro">
        <h2 id="basic-analysis-title">基本分析</h2>
      </div>

      <article className="basic-analysis__core">
        <span className="basic-analysis__digit" aria-hidden="true">{coreDigit}</span>
        <div>
          <p>核心主性格</p>
          <strong>{coreProfile.title}</strong>
          <span>{coreProfile.keywords}</span>
        </div>
      </article>

      <ul className="basic-analysis__modes">
        {modes.map((mode) => (
          <li key={mode.id}>
            <span>{mode.label}</span>
            <strong>{mode.value}</strong>
          </li>
        ))}
      </ul>

      <div className="basic-analysis__elements">
        {elements.map((pattern) => (
          <article key={pattern.id} className={`basic-analysis__element basic-analysis__element--${pattern.id}`}>
            <p>{pattern.label}</p>
            <strong>{pattern.active.title}</strong>
            <span>{pattern.active.description}</span>
          </article>
        ))}
      </div>

      <ul className="basic-analysis__points">
        <li>
          <span>{inner.label}</span>
          <strong>{result.nodes.I}　{DIGIT_PROFILES[result.nodes.I].title}</strong>
        </li>
        <li>
          <span>{outerLeft.label}</span>
          <strong>{result.nodes.P}　{DIGIT_PROFILES[result.nodes.P].title}</strong>
        </li>
        <li>
          <span>{outerRight.label}</span>
          <strong>{result.nodes.Q}　{DIGIT_PROFILES[result.nodes.Q].title}</strong>
        </li>
      </ul>
    </section>
  )
}
