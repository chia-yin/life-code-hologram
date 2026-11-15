import type { HologramResult } from '../../lib/hologram'
import { getDigitModes } from './digit-modes'
import { getElementPatterns } from './element-patterns'
import { DIGIT_PROFILES } from './interpretations'
import { POSITION_PROFILES } from './position-profiles'
import { buildCoreNarrative, buildElementReason } from './reading-narrative'

interface BasicAnalysisProps {
  result: HologramResult
}

export function BasicAnalysis({ result }: BasicAnalysisProps) {
  const coreDigit = result.nodes.O
  const coreProfile = DIGIT_PROFILES[coreDigit]
  const modes = getDigitModes(coreDigit)
  const elements = getElementPatterns(result.nodes)
  const focusPoints = [
    { node: 'I' as const, profile: POSITION_PROFILES.I },
    { node: 'P' as const, profile: POSITION_PROFILES.P },
    { node: 'Q' as const, profile: POSITION_PROFILES.Q },
  ]

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
          <p className="basic-analysis__narrative">{buildCoreNarrative(coreDigit)}</p>
        </div>
      </article>

      <ul className="basic-analysis__modes">
        {modes.map((mode) => (
          <li key={mode.id}>
            <span>{mode.label}</span>
            <strong>{mode.value}</strong>
            <p>{mode.summary}</p>
          </li>
        ))}
      </ul>

      <div className="basic-analysis__elements">
        {elements.map((pattern) => (
          <article key={pattern.id} className={`basic-analysis__element basic-analysis__element--${pattern.id}`}>
            <p>{pattern.label}</p>
            <strong>{pattern.active.title}</strong>
            <span>{buildElementReason(pattern)}</span>
          </article>
        ))}
      </div>

      <ul className="basic-analysis__points">
        {focusPoints.map(({ node, profile }) => {
          const digit = result.nodes[node]
          const digitProfile = DIGIT_PROFILES[digit]
          return (
            <li key={node}>
              <span>{profile.label}</span>
              <strong>{digit}　{digitProfile.title}</strong>
              <p>{profile.role}：{digitProfile.description}</p>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
