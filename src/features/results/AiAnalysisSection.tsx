import { useState } from 'react'
import type { HologramResult } from '../../lib/hologram'
import { PROMPT_FOCUSES, type PromptFocus } from './ai-prompt'
import { requestAiAnalysis } from './request-ai-analysis'

interface AiAnalysisSectionProps {
  result: HologramResult
}

export function AiAnalysisSection({ result }: AiAnalysisSectionProps) {
  const [focus, setFocus] = useState<PromptFocus>('overall')
  const [analysis, setAnalysis] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle')
  const [error, setError] = useState('')

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
        <h2 id="ai-analysis-title">AI 解析</h2>
        <p>依目前全息圖資料產生延伸解讀，可切換面向後再產生。</p>
      </div>

      <div className="ai-analysis__focus" aria-label="選擇解析面向">
        {PROMPT_FOCUSES.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={focus === item.id}
            onClick={() => {
              setFocus(item.id)
              setStatus('idle')
              setError('')
            }}
          >
            {item.label}
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
          {status === 'loading' ? '解析中…' : '開始 AI 解析'}
        </button>
      </div>

      {status === 'error' && (
        <p className="ai-analysis__error" role="alert">{error}</p>
      )}

      {status === 'ready' && analysis && (
        <article className="ai-analysis__result" aria-live="polite">
          {analysis.split('\n').map((line, index) => (
            <p key={`${index}-${line.slice(0, 12)}`}>{line || '\u00A0'}</p>
          ))}
        </article>
      )}
    </section>
  )
}
