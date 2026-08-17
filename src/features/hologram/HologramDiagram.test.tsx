import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { NODE_KEYS, parseBirthday } from '../../lib/hologram'
import { HologramDiagram } from './HologramDiagram'

describe('HologramDiagram', () => {
  it('未輸入生日時使用同一組全字筆劃且不顯示節點', () => {
    const { container } = render(<HologramDiagram />)

    expect(container.querySelectorAll('.diagram__glyph path')).toHaveLength(6)
    expect(screen.queryAllByRole('button')).toHaveLength(0)
    expect(screen.queryByText('待開啟')).not.toBeInTheDocument()
  })

  it('每個計算節點都是可開啟對應解析的按鈕', async () => {
    const user = userEvent.setup()
    const onNodeSelect = vi.fn()
    const result = parseBirthday('1990-06-05')
    render(<HologramDiagram nodes={result.nodes} onNodeSelect={onNodeSelect} />)

    expect(screen.getAllByRole('button')).toHaveLength(NODE_KEYS.length)
    await user.click(screen.getByRole('button', { name: '核心主性格，數字 3，查看解析' }))
    expect(onNodeSelect).toHaveBeenCalledWith('O')
  })
})
