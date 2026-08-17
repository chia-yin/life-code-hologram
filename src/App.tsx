import { useState } from 'react'
import { HologramDiagram } from './features/hologram/HologramDiagram'
import { BirthdayForm } from './features/input/BirthdayForm'
import { AiPromptSection } from './features/results/AiPromptSection'
import { AnalysisModal } from './features/results/AnalysisModal'
import { ResultSummary } from './features/results/ResultSummary'
import { parseBirthday, type HologramResult, type NodeKey } from './lib/hologram'

export default function App() {
  const [result, setResult] = useState<HologramResult | null>(null)
  const [error, setError] = useState('')
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false)
  const [selectedNode, setSelectedNode] = useState<NodeKey | null>(null)
  const [revealKey, setRevealKey] = useState(0)

  function handleSubmit(birthday: string) {
    try {
      const next = parseBirthday(birthday)
      setResult(next)
      setSelectedNode(null)
      setIsAnalysisOpen(false)
      setRevealKey((value) => value + 1)
      setError('')
    } catch {
      setResult(null)
      setError('請輸入有效的生日')
    }
  }

  return (
    <main className="page">
      <header className="brand">
        <span className="brand__mark" aria-hidden="true">全</span>
        <div>
          <p>全息圖</p>
          <strong>生命密碼</strong>
        </div>
      </header>

      <div className="viewport">
        <section className={`stage ${result ? 'is-filled' : ''}`}>
          <span className="stage__glow" aria-hidden="true" />

          <HologramDiagram
            key={result ? `${result.birthday}-${revealKey}` : 'empty'}
            nodes={result?.nodes}
            onNodeSelect={(node) => {
              setSelectedNode(node)
              setIsAnalysisOpen(true)
            }}
          />
        </section>

        <section className="console">
          <BirthdayForm initialValue={result?.birthday} onSubmit={handleSubmit} error={error} />

          {result ? (
            <div className="console__actions">
              <button
                className="button button--outline"
                type="button"
                onClick={() => {
                  setSelectedNode(null)
                  setIsAnalysisOpen(true)
                }}
              >
                查看完整解析
              </button>
              <a className="button button--ghost" href="#ai-prompt">延伸提問</a>
            </div>
          ) : (
            <p className="console__hint">輸入西元生日，數字會依序落入「全」字。</p>
          )}
        </section>
      </div>

      {result && (
        <AnalysisModal
          result={result}
          isOpen={isAnalysisOpen}
          selectedNode={selectedNode}
          onClose={() => setIsAnalysisOpen(false)}
        />
      )}
      {result && <AiPromptSection result={result} />}
      {result && <ResultSummary nodes={result.nodes} />}
    </main>
  )
}
