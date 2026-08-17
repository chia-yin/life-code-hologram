import type { NodeKey } from '../../lib/hologram'

export interface PositionProfile {
  label: string
  source: string
  role: string
}

/**
 * 全息圖位置語意表。
 *
 * `source` 只描述可驗證的計算來源；`role` 是解析時使用的觀察面向。
 * 將位置定義集中在此處，避免畫面、提示詞與解析文案各自命名。
 */
export const POSITION_PROFILES: Record<NodeKey, PositionProfile> = {
  A: { label: '出生日十位', source: '日期第一碼', role: '早期反應與行動起點' },
  B: { label: '出生日個位', source: '日期第二碼', role: '日常反應與個人表現' },
  C: { label: '出生月十位', source: '月份第一碼', role: '情境接收與關係背景' },
  D: { label: '出生月個位', source: '月份第二碼', role: '互動需求與適應方式' },
  E: { label: '出生年千位', source: '年份第一碼', role: '世代背景的起始特質' },
  F: { label: '出生年百位', source: '年份第二碼', role: '世代環境的承接方式' },
  G: { label: '出生年十位', source: '年份第三碼', role: '成長階段的內在傾向' },
  H: { label: '出生年個位', source: '年份第四碼', role: '個人經驗的落實方式' },
  I: { label: '日期基礎', source: 'A＋B', role: '直覺啟動與第一反應' },
  J: { label: '月份基礎', source: 'C＋D', role: '關係互動與情境適應' },
  K: { label: '年份前段', source: 'E＋F', role: '世代脈絡與外部要求' },
  L: { label: '年份後段', source: 'G＋H', role: '長期節奏與經驗累積' },
  M: { label: '個人經驗整合', source: 'I＋J', role: '個人需求與關係經驗的整合' },
  N: { label: '長程經驗整合', source: 'K＋L', role: '環境脈絡與長期經驗的整合' },
  O: { label: '核心主性格', source: 'M＋N', role: '判斷、選擇與自我定位的核心模式' },
  P: { label: '個人面向表達', source: 'M＋O', role: '核心特質在個人與熟悉情境中的表達' },
  Q: { label: '社會面向表達', source: 'N＋O', role: '核心特質在工作與外部情境中的表達' },
  R: { label: '整體整合方向', source: 'P＋Q', role: '內外表達協調後的發展方向' },
  X: { label: '日期延伸', source: 'I＋M', role: '行動本能經整合後的延伸反應' },
  W: { label: '月份延伸', source: 'J＋M', role: '關係需求經整合後的延伸反應' },
  S: { label: '個人側翼', source: 'X＋W', role: '私人生活與親近關係中的綜合模式' },
  V: { label: '年份前段延伸', source: 'K＋N', role: '面對制度、責任與環境要求的延伸反應' },
  U: { label: '年份後段延伸', source: 'L＋N', role: '面對長程目標與經驗累積的延伸反應' },
  T: { label: '社會側翼', source: 'V＋U', role: '工作、團體與公共情境中的綜合模式' },
}

export const ANALYSIS_GROUPS: readonly {
  id: string
  title: string
  nodes: readonly NodeKey[]
}[] = [
  { id: 'core', title: '核心結構', nodes: ['O'] },
  { id: 'integration', title: '內在整合', nodes: ['M', 'N'] },
  { id: 'expression', title: '外在表達', nodes: ['P', 'Q', 'R'] },
  { id: 'foundation', title: '四組基礎', nodes: ['I', 'J', 'K', 'L'] },
  { id: 'wings', title: '情境側翼', nodes: ['S', 'T'] },
  { id: 'wing-paths', title: '側翼來源', nodes: ['X', 'W', 'V', 'U'] },
  { id: 'source', title: '生日原始碼', nodes: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'] },
]
