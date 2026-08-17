import { NODE_KEYS, type HologramNode } from '../../lib/hologram'

interface ResultSummaryProps {
  nodes: HologramNode
}

export function ResultSummary({ nodes }: ResultSummaryProps) {
  return (
    <section className="sr-only" aria-label="完整節點結果">
      <ul>
        {NODE_KEYS.map((key) => <li key={key}>{key}：{nodes[key]}</li>)}
      </ul>
    </section>
  )
}
