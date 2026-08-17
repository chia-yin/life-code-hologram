import { useState } from 'react'
import type { HologramResult, NodeKey } from '../../lib/hologram'
import { DIGIT_PROFILES } from './interpretations'
import { POSITION_PROFILES } from './position-profiles'

interface AiPromptSectionProps {
  result: HologramResult
}

type PromptFocus = 'overall' | 'sales' | 'cooperation' | 'relationship' | 'communication'

const PROMPT_FOCUSES: Array<{ id: PromptFocus; label: string }> = [
  { id: 'overall', label: '整體解析' },
  { id: 'sales', label: '銷售與吸引' },
  { id: 'cooperation', label: '合作方式' },
  { id: 'relationship', label: '日常相處' },
  { id: 'communication', label: '溝通衝突' },
]

const FOCUS_REQUESTS: Record<PromptFocus, string> = {
  overall: `請依下列順序回答：
1. 用一段話總結整體人格輪廓。
2. 解析核心主性格，以及優勢、壓力下的表現與成長方向。
3. 比較內在驅動與長程節奏，指出一致或拉扯之處。
4. 解析左右兩側的外在表達，以及在人際、工作與親密關係中的可能差異。
5. 解析整合方向與左右翼延伸，說明如何把不同特質整合起來。
6. 提供三項具體、可執行的日常建議。
7. 提出三個適合自我探索的問題。`,
  sales: `請聚焦回答「如何向這個人銷售，以及如何吸引他的注意與信任」：
1. 他做購買決定時可能重視的價值、證據與安全感。
2. 最容易吸引他注意的切入點、內容形式與第一句話。
3. 適合的銷售節奏、提問方式與成交方式。
4. 他可能出現的疑慮、抗拒或失去興趣的原因。
5. 三句可直接使用但不操控、不施壓的溝通示例。
6. 應避免的銷售方式，以及建立長期信任的做法。`,
  cooperation: `請聚焦回答「如何與這個人合作」：
1. 他在團隊中自然適合的角色與能貢獻的價值。
2. 適合他的目標設定、分工、決策與工作節奏。
3. 如何向他提出需求、給予回饋與確認共識。
4. 合作卡住時可能的原因，以及有效的修復方式。
5. 三項具體合作守則，並分別說明主管、同事與夥伴可怎麼做。`,
  relationship: `請聚焦回答「如何與這個人日常相處」：
1. 他感到被理解、被尊重與有安全感的方式。
2. 他需要的陪伴距離、個人空間與情緒回應。
3. 壓力下可能出現的反應，以及對方適合如何接住。
4. 親密關係、友情與家人相處各自要留意的地方。
5. 三句適合表達關心或修復關係的具體說法。`,
  communication: `請聚焦回答「如何與這個人溝通並處理衝突」：
1. 他偏好的資訊順序、語氣、速度與溝通管道。
2. 如何說服他、如何讓他願意表達真正想法。
3. 衝突時他的可能防衛反應與底層需求。
4. 哪些說法容易踩雷，應如何改寫。
5. 提供一段從誤解、澄清到達成共識的示範對話。`,
}

function describeNode(node: NodeKey, result: HologramResult) {
  const digit = result.nodes[node]
  const profile = DIGIT_PROFILES[digit]
  const position = POSITION_PROFILES[node]
  return `${position.label}（${node}＝${position.source}）：${digit}（${profile.title}；${profile.keywords}）`
}

export function buildAiPrompt(result: HologramResult, focus: PromptFocus = 'overall') {
  const { nodes } = result

  return `請擔任溫和、具體且不宿命論的生命密碼解析顧問，根據以下全息圖資料，以繁體中文提供實用解析。

【基本資料】
西元生日：${result.birthday}
生日八位數：${nodes.A}、${nodes.B}、${nodes.C}、${nodes.D}、${nodes.E}、${nodes.F}、${nodes.G}、${nodes.H}

【全息圖主要位置】
${describeNode('O', result)}
${describeNode('I', result)}
${describeNode('L', result)}
${describeNode('P', result)}
${describeNode('Q', result)}
${describeNode('R', result)}
${describeNode('S', result)}
${describeNode('T', result)}

【完整計算節點】
第一層：${nodes.I}、${nodes.J}、${nodes.K}、${nodes.L}
第二層：${nodes.M}、${nodes.N}
核心：${nodes.O}
外在表達：${nodes.P}、${nodes.Q}
整合焦點：${nodes.R}
左翼脈絡：${nodes.X}、${nodes.W}、${nodes.S}
右翼脈絡：${nodes.V}、${nodes.U}、${nodes.T}

計算規則為每次相加後縮減成單一數字；若兩個加數都是 0，特殊記為 5。

【本次解析面向】
${FOCUS_REQUESTS[focus]}

請把每項判讀連結到上述數字特質，避免空泛套話。不要斷言命運、疾病、財富或關係結果；若資訊不足，請明確說明這是一種自我觀察角度，而不是確定判斷。`
}

export function AiPromptSection({ result }: AiPromptSectionProps) {
  const [focus, setFocus] = useState<PromptFocus>('overall')
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle')
  const prompt = buildAiPrompt(result, focus)
  const focusLabel = PROMPT_FOCUSES.find((item) => item.id === focus)?.label

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(prompt)
      setCopyState('copied')
    } catch {
      setCopyState('failed')
    }
  }

  return (
    <section className="ai-prompt panel" id="ai-prompt" aria-label="延伸提問">
      <div className="ai-prompt__focus" aria-label="選擇解析面向">
        {PROMPT_FOCUSES.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={focus === item.id}
            onClick={() => {
              setFocus(item.id)
              setCopyState('idle')
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="ai-prompt__actions">
        <button className="button button--primary" type="button" onClick={copyPrompt}>
          {copyState === 'copied' ? '已複製，可以貼上了' : `複製「${focusLabel}」提示詞`}
        </button>
        {copyState === 'failed' && <p role="alert">無法自動複製，請選取上方文字後手動複製。</p>}
      </div>
    </section>
  )
}
