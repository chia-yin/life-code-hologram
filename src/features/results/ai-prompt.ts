import type { HologramResult, NodeKey } from '../../lib/hologram'
import { getDigitModes } from './digit-modes'
import { getElementPatterns } from './element-patterns'
import { DIGIT_PROFILES } from './interpretations'
import { POSITION_PROFILES } from './position-profiles'
import { buildCoreNarrative, buildElementReason } from './reading-narrative'

export type PromptFocus = 'explain' | 'connect'

export const PROMPT_FOCUSES: Array<{ id: PromptFocus; label: string; hint: string }> = [
  { id: 'explain', label: '逐項讀懂', hint: '把基本分析每一塊講清楚' },
  { id: 'connect', label: '串聯提醒', hint: '看它們如何互相拉扯與配合' },
]

const OUTPUT_FORMAT = `【輸出格式】
請依序輸出 4 到 5 個面向區塊。
每個區塊第一行只用「## 面向名稱」，不要加編號、不要用 ###。
面向名稱後空一行，再寫 2 到 4 句具體說明；必要時可用「- 」條列。
不要寫開場白或結語，直接從第一個面向開始。
用詞要像在幫人看懂報告，不要像在做銷售或命定預言。`

const FOCUS_REQUESTS: Record<PromptFocus, string> = {
  explain: `任務：協助讀者「讀懂上方基本分析」。
請依基本分析的結構往下開展，涵蓋這些面向：
1. 核心主性格：這個數字代表什麼，日常怎麼看出來
2. 四種行為模式：思維／工作／語言／金錢各自是什麼意思，彼此怎麼配合
3. 水火象限：冷暴力與情緒落點怎麼理解，什麼情境容易出現
4. 三個關鍵位置：日期基礎、個人表達、社會表達各自看什麼
5. 容易誤解的地方：別人可能誤會什麼，自己可能忽略什麼`,
  connect: `任務：把基本分析串成一幅可理解的圖，並給出提醒。
請涵蓋這些面向：
1. 整圖一句話：先用白話總結這張基本分析
2. 一致之處：哪些特質互相加強
3. 拉扯之處：哪些模式可能互相打架
4. 關係與工作各看什麼：個人面向與社會面向怎麼分工
5. 三個可觀察的提醒：具體、可做、不說教`,
}

function describeNode(node: NodeKey, result: HologramResult) {
  const digit = result.nodes[node]
  const profile = DIGIT_PROFILES[digit]
  const position = POSITION_PROFILES[node]
  return `${position.label}（${node}）：${digit}「${profile.title}」｜${position.role}｜${profile.keywords}`
}

/** 與頁面「基本分析」對齊的摘要，供 AI 往下開展 */
export function buildBasicAnalysisBrief(result: HologramResult) {
  const coreDigit = result.nodes.O
  const coreProfile = DIGIT_PROFILES[coreDigit]
  const modes = getDigitModes(coreDigit)
  const elements = getElementPatterns(result.nodes)

  const modeLines = modes
    .map((mode) => `- ${mode.label}：${mode.value}｜${mode.summary}`)
    .join('\n')

  const elementLines = elements
    .map((pattern) => `- ${pattern.label}：${pattern.active.title}｜${buildElementReason(pattern)}`)
    .join('\n')

  const pointLines = (['I', 'P', 'Q'] as const)
    .map((node) => {
      const digit = result.nodes[node]
      const profile = POSITION_PROFILES[node]
      const digitProfile = DIGIT_PROFILES[digit]
      return `- ${profile.label}：${digit}「${digitProfile.title}」｜${profile.role}｜${digitProfile.description}`
    })
    .join('\n')

  return `【頁面基本分析（請以此為主軸往下說明）】
核心主性格：${coreDigit}「${coreProfile.title}」｜${coreProfile.keywords}
${buildCoreNarrative(coreDigit)}

四種行為模式：
${modeLines}

水火象限：
${elementLines}

三個關鍵位置：
${pointLines}`
}

export function buildAiPrompt(result: HologramResult, focus: PromptFocus = 'explain') {
  const { nodes } = result

  return `請擔任溫和、清楚、不宿命論的生命密碼解讀助手。
你的目標不是另開一套華麗報告，而是協助讀者理解「頁面上的基本分析」：把每個區塊講明白、串起來、指出可觀察的提醒。

西元生日：${result.birthday}

${buildBasicAnalysisBrief(result)}

【補充節點，僅在需要時引用】
${describeNode('O', result)}
${describeNode('M', result)}
${describeNode('N', result)}
${describeNode('R', result)}
${describeNode('S', result)}
${describeNode('T', result)}
第一層：${nodes.I}、${nodes.J}、${nodes.K}、${nodes.L}
計算規則：相加後縮成單一數字；兩個加數都是 0 時記為 5。

【本次說明角度】
${FOCUS_REQUESTS[focus]}

${OUTPUT_FORMAT}

請緊扣基本分析已出現的數字與用語，避免空泛套話；不要斷言命運、疾病、財富或關係結果。`
}

export const AI_SYSTEM_PROMPT =
  '你是協助讀懂生命密碼基本分析的解說者。一律繁體中文，清楚、溫和、不說教；優先解釋頁面上已有的區塊，輸出時嚴格使用「## 面向名稱」格式。'
