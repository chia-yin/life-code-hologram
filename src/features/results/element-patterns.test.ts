import { describe, expect, it } from 'vitest'
import { parseBirthday } from '../../lib/hologram'
import { ELEMENT_CHART_KEYS, getElementPatterns } from './element-patterns'

describe('element pattern readings', () => {
  it('水火只掃推導圖 I–R，不把生日八碼算進去', () => {
    // 1985-06-12：生日有 8，但推導圖 I–R 沒有 8
    const nodes = parseBirthday('1985-06-12').nodes
    expect(nodes.G).toBe(8)
    expect(ELEMENT_CHART_KEYS.some((key) => nodes[key] === 8)).toBe(false)

    const fire = getElementPatterns(nodes).find((item) => item.id === 'fire')
    expect(fire?.hasMinor).toBe(true) // I=3
    expect(fire?.hasMajor).toBe(false)
    expect(fire?.active.title).toBe('閃電火花')
  })

  it('依推導圖有無 2／7 判斷水象象限', () => {
    const both = getElementPatterns(parseBirthday('2000-01-01').nodes).find((item) => item.id === 'water')
    const majorOnly = getElementPatterns(parseBirthday('1984-12-25').nodes).find((item) => item.id === 'water')

    expect(both?.active.title).toBe('極度冰封')
    expect(both?.hasMinor).toBe(true)
    expect(both?.hasMajor).toBe(true)
    expect(majorOnly?.active.title).toBe('深海暗流')
    expect(majorOnly?.hasMinor).toBe(false)
    expect(majorOnly?.hasMajor).toBe(true)
  })

  it('依推導圖有無 3／8 判斷火象象限', () => {
    const spark = getElementPatterns(parseBirthday('1984-12-25').nodes).find((item) => item.id === 'fire')
    const calm = getElementPatterns(parseBirthday('2000-01-01').nodes).find((item) => item.id === 'fire')
    const both = getElementPatterns(parseBirthday('1994-09-07').nodes).find((item) => item.id === 'fire')

    expect(spark?.active.title).toBe('閃電火花')
    expect(spark?.hasMinor).toBe(true)
    expect(spark?.hasMajor).toBe(false)
    expect(calm?.active.title).toBe('溫和防火牆')
    expect(calm?.hasMinor).toBe(false)
    expect(calm?.hasMajor).toBe(false)
    expect(both?.active.title).toBe('零星燃點')
    expect(both?.hasMinor).toBe(true)
    expect(both?.hasMajor).toBe(true)
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
