import { describe, expect, it } from 'vitest'
import { addNodes, parseBirthday, reduceDigit } from './hologram'

describe('reduceDigit', () => {
  it.each([
    [0, 0],
    [18, 9],
    [10, 1],
    [7, 7],
    [99, 9],
  ])('將 %i 反覆縮減為單一數字 %i', (value, expected) => {
    expect(reduceDigit(value)).toBe(expected)
  })
})

describe('parseBirthday', () => {
  it('依序計算生日輸入與所有衍生節點', () => {
    expect(parseBirthday('1984-12-25').nodes).toEqual({
      A: 2, B: 5, C: 1, D: 2, E: 1, F: 9, G: 8, H: 4,
      I: 7, J: 3, K: 1, L: 3, M: 1, N: 4, O: 5,
      P: 6, Q: 9, R: 6, X: 8, W: 4, S: 3, V: 5, U: 7, T: 3,
    })
  })

  it.each([
    '',
    '1984-13-25',
    '1984-02-30',
    '84-12-25',
    'not-a-date',
  ])('拒絕無效生日 %s', (birthday) => {
    expect(() => parseBirthday(birthday)).toThrow('請輸入有效的生日')
  })

  it('正確保留日期與月份的前導零', () => {
    expect(parseBirthday('2001-03-04').nodes).toMatchObject({
      A: 0, B: 4, C: 0, D: 3, E: 2, F: 0, G: 0, H: 1,
    })
  })

  it('西元 2000 年的 0+0 依特殊規則記為 5', () => {
    expect(parseBirthday('2000-01-01').nodes).toEqual({
      A: 0, B: 1, C: 0, D: 1, E: 2, F: 0, G: 0, H: 0,
      I: 1, J: 1, K: 2, L: 5, M: 2, N: 7, O: 9,
      P: 2, Q: 7, R: 9, X: 3, W: 3, S: 6, V: 9, U: 3, T: 3,
    })
  })
})

describe('addNodes', () => {
  it('兩位皆為 0 時記為 5', () => {
    expect(addNodes(0, 0)).toBe(5)
  })

  it('其餘情況維持單一數字縮減', () => {
    expect(addNodes(0, 4)).toBe(4)
    expect(addNodes(8, 4)).toBe(3)
  })
})
