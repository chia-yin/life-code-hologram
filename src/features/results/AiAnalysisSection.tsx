import { useState } from 'react'
import type { HologramResult } from '../../lib/hologram'
import { PROMPT_FOCUSES, type PromptFocus } from './ai-prompt'
import { parseAiAnalysis } from './parse-ai-analysis'
import { requestAiAnalysis } from './request-ai-analysis'

interface AiAnalysisSectionProps {
  result: HologramResult
}

export function AiAnalysisSection({ result }: AiAnalysisSectionProps) {
  const [focus, setFocus] = useState<PromptFocus>('explain')
  const [analysis, setAnalysis] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle')
  const [error, setError] = useState('')

  const focusMeta = PROMPT_FOCUSES.find((item) => item.id === focus)
  const blocks = analysis ? parseAiAnalysis(analysis) : []

  async function handleAnalyze() {
    setStatus('loading')
    setError('')
    try {
      const next = await requestAiAnalysis(result, focus)
      setAnalysis(next)
      setStatus('ready')
    } catch (cause) {
      setAnalysis('')
      setError(cause instanceof Error ? cause.message : 'AI 解析失敗')
      setStatus('error')
    }
  }

  return (
    <section className="ai-analysis panel" id="ai-analysis" aria-labelledby="ai-analysis-title">
      <div className="ai-analysis__intro">
        <h2 id="ai-analysis-title">深入了解</h2>
        <p>承接上方基本分析，幫你讀懂每個區塊在說什麼、彼此怎麼連動。</p>
      </div>

      <div className="ai-analysis__focus" role="tablist" aria-label="選擇說明角度">
        {PROMPT_FOCUSES.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={focus === item.id}
            aria-pressed={focus === item.id}
            onClick={() => {
              setFocus(item.id)
              setStatus('idle')
              setError('')
              setAnalysis('')
            }}
          >
            <strong>{item.label}</strong>
            <span>{item.hint}</span>
          </button>
        ))}
      </div>

      <div className="ai-analysis__actions">
        <button
          className="button button--primary"
          type="button"
          disabled={status === 'loading'}
          onClick={handleAnalyze}
        >
          {status === 'loading'
            ? '說明產生中…'
            : `開始「${focusMeta?.label ?? ''}」`}
        </button>
      </div>

      {status === 'error' && (
        <p className="ai-analysis__error" role="alert">{error}</p>
      )}

      {status === 'ready' && blocks.length > 0 && (
        <div className="ai-analysis__result" aria-live="polite">
          {blocks.map((block, index) => (
            <article key={`${block.title}-${index}`} className="ai-analysis__block">
              {block.title ? <h3>{block.title}</h3> : null}
              {block.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {block.bullets.length > 0 && (
                <ul>
                  {block.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
