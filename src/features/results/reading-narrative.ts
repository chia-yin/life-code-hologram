import type { NodeKey } from '../../lib/hologram'
import type { ElementPatternReading } from './element-patterns'
import { DIGIT_PROFILES } from './interpretations'
import { POSITION_PROFILES } from './position-profiles'

/** 基本分析：主性格開場敘事 */
export function buildCoreNarrative(digit: number) {
  const profile = DIGIT_PROFILES[digit]
  return `主性格落在 ${digit}「${profile.title}」。${profile.description}`
}

/** 水火象限：說明為何落到這個象限 */
export function buildElementReason(pattern: ElementPatternReading) {
  const minorState = pattern.hasMinor ? `有${pattern.minorDigit}` : `沒${pattern.minorDigit}`
  const majorState = pattern.hasMajor ? `有${pattern.majorDigit}` : `沒${pattern.majorDigit}`
  return `推導圖${minorState}、${majorState}（不含生日八碼），落在「${pattern.active.title}」。${pattern.active.description}`
}

/** 位置 × 數字：單點／結構解析的因果敘事 */
export function buildPositionNarrative(node: NodeKey, digit: number) {
  const position = POSITION_PROFILES[node]
  const profile = DIGIT_PROFILES[digit]
  return `在「${position.label}」這個位置，重點看${position.role}。數字 ${digit}「${profile.title}」帶著${profile.keywords}的傾向：${profile.description}`
}
