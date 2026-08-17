export const NODE_KEYS = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
  'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
  'Q', 'R', 'X', 'W', 'S', 'V', 'U', 'T',
] as const

export type NodeKey = (typeof NODE_KEYS)[number]
export type HologramNode = Record<NodeKey, number>

export interface HologramResult {
  birthday: string
  nodes: HologramNode
}

const INVALID_BIRTHDAY = '請輸入有效的生日'

export const ZERO_PAIR_VALUE = 5

export function reduceDigit(value: number): number {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error('數值必須是非負有限數')
  }

  let result = Math.trunc(value)
  while (result > 9) {
    result = String(result)
      .split('')
      .reduce((sum, digit) => sum + Number(digit), 0)
  }
  return result
}

// 兩位皆為 0 時（例如西元 2000 年的年份後兩位）依教學規則記為 5。
export function addNodes(left: number, right: number): number {
  if (left === 0 && right === 0) return ZERO_PAIR_VALUE
  return reduceDigit(left + right)
}

function validateBirthday(input: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(input)
  if (!match) throw new Error(INVALID_BIRTHDAY)

  const [, yearText, monthText, dayText] = match
  const year = Number(yearText)
  const month = Number(monthText)
  const day = Number(dayText)
  const candidate = new Date(Date.UTC(year, month - 1, day))

  if (
    year < 1 ||
    candidate.getUTCFullYear() !== year ||
    candidate.getUTCMonth() !== month - 1 ||
    candidate.getUTCDate() !== day
  ) {
    throw new Error(INVALID_BIRTHDAY)
  }

  return { yearText, monthText, dayText }
}

export function parseBirthday(birthday: string): HologramResult {
  const { yearText, monthText, dayText } = validateBirthday(birthday)
  const inputDigits = `${dayText}${monthText}${yearText}`.split('').map(Number)
  const [A, B, C, D, E, F, G, H] = inputDigits
  const add = addNodes

  const I = add(A, B)
  const J = add(C, D)
  const K = add(E, F)
  const L = add(G, H)
  const M = add(I, J)
  const N = add(K, L)
  const O = add(M, N)
  const P = add(M, O)
  const Q = add(N, O)
  const R = add(Q, P)
  const X = add(I, M)
  const W = add(J, M)
  const S = add(X, W)
  const V = add(K, N)
  const U = add(L, N)
  const T = add(V, U)

  return {
    birthday,
    nodes: {
      A, B, C, D, E, F, G, H,
      I, J, K, L, M, N, O, P, Q, R,
      X, W, S, V, U, T,
    },
  }
}
