import { describe, expect, it } from 'vitest'
import { parseBirthday } from '../../lib/hologram'
import { getElementPatterns } from './element-patterns'

describe('element pattern readings', () => {
  it('依全圖有無 2／7 判斷水象象限', () => {
    const both = getElementPatterns(parseBirthday('1984-12-25').nodes).find((item) => item.id === 'water')
    const majorOnly = getElementPatterns(parseBirthday('1994-09-07').nodes).find((item) => item.id === 'water')

    expect(both?.active.title).toBe('極度冰封')
    expect(both?.hasMinor).toBe(true)
    expect(both?.hasMajor).toBe(true)
    expect(majorOnly?.active.title).toBe('深海暗流')
    expect(majorOnly?.hasMinor).toBe(false)
    expect(majorOnly?.hasMajor).toBe(true)
  })

  it('依全圖有無 3／8 判斷火象象限', () => {
    const both = getElementPatterns(parseBirthday('1984-12-25').nodes).find((item) => item.id === 'fire')
    const minorOnly = getElementPatterns(parseBirthday('2000-01-01').nodes).find((item) => item.id === 'fire')

    expect(both?.active.title).toBe('零星燃點')
    expect(both?.hasMinor).toBe(true)
    expect(both?.hasMajor).toBe(true)
    expect(minorOnly?.active.title).toBe('閃電火花')
    expect(minorOnly?.hasMinor).toBe(true)
    expect(minorOnly?.hasMajor).toBe(false)
  })

  it('同時標出四個象限並標示目前落點', () => {
    const patterns = getElementPatterns(parseBirthday('2000-01-01').nodes)
    expect(patterns).toHaveLength(2)
    patterns.forEach((pattern) => {
      expect(pattern.quadrants).toHaveLength(4)
      expect(pattern.quadrants.some((quadrant) => quadrant.id === pattern.active.id)).toBe(true)
    })
  })
})
