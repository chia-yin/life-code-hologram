import { describe, expect, it } from 'vitest'
import { getDigitModes } from './digit-modes'

describe('digit mode profiles', () => {
  it('小數字走多做想少，大數字走少做多想', () => {
    expect(getDigitModes(3).find((mode) => mode.id === 'tempo')?.value).toBe('多做想少')
    expect(getDigitModes(7).find((mode) => mode.id === 'tempo')?.value).toBe('少做多想')
  })

  it('工作、語言、金錢模式依對照表切分', () => {
    const bold = getDigitModes(5)
    const careful = getDigitModes(4)

    expect(bold.find((mode) => mode.id === 'work')?.value).toBe('先做再說，抓大放小')
    expect(careful.find((mode) => mode.id === 'work')?.value).toBe('小心翼翼，重關係，顧品質')
    expect(getDigitModes(9).find((mode) => mode.id === 'language')?.value).toBe('理性')
    expect(getDigitModes(8).find((mode) => mode.id === 'language')?.value).toBe('感性')
    expect(getDigitModes(1).find((mode) => mode.id === 'money')?.value).toBe('親力親為')
    expect(getDigitModes(6).find((mode) => mode.id === 'money')?.value).toBe('借力使力')
  })

  it('0 保留彈性模式，不硬套固定分類', () => {
    expect(getDigitModes(0).map((mode) => mode.value)).toEqual([
      '彈性觀察',
      '情境調整',
      '可理可感',
      '彈性調度',
    ])
  })
})
