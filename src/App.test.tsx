import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import App from './App'
import type { HologramNode, NodeKey } from './lib/hologram'

vi.mock('./features/hologram/HologramDiagram', () => ({
  HologramDiagram: ({
    nodes,
    onNodeSelect,
  }: {
    nodes?: HologramNode
    onNodeSelect?: (node: NodeKey) => void
  }) => (
    <div data-testid="diagram">
      <span>全</span>
      {nodes && (
        <button
          type="button"
          aria-label={`核心主性格，數字 ${nodes.O}，查看解析`}
          onClick={() => onNodeSelect?.('O')}
        >
          主性格：{nodes.O}
        </button>
      )}
    </div>
  ),
}))

async function submitBirthday(value: string) {
  const user = userEvent.setup()
  await user.clear(screen.getByLabelText('西元生日'))
  await user.type(screen.getByLabelText('西元生日'), value)
  await user.click(screen.getByRole('button', { name: '啟動解析' }))
  return user
}

describe('生命密碼全息解析頁', () => {
  it('首屏直接顯示生日輸入，不顯示大型標題', () => {
    render(<App />)
    expect(screen.getByLabelText('西元生日')).toBeInTheDocument()
    expect(screen.getByTestId('diagram')).toHaveTextContent('全')
    expect(screen.queryByText('待開啟')).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: /從出生座標/ })).not.toBeInTheDocument()
  })

  it('阻擋無效生日並顯示行內錯誤', async () => {
    render(<App />)
    await submitBirthday('1984-02-30')
    expect(screen.getByRole('alert')).toHaveTextContent('請輸入有效的生日')
    expect(screen.getByTestId('diagram')).toHaveTextContent('全')
    expect(screen.queryByRole('heading', { name: '生命密碼結構解析' })).not.toBeInTheDocument()
  })

  it('有效生日顯示全息圖、結構解析入口與延伸提問', async () => {
    render(<App />)
    await submitBirthday('1984-12-25')

    expect(screen.getByTestId('diagram')).toHaveTextContent('主性格：5')
    expect(screen.getByRole('button', { name: '查看完整解析' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: '生命密碼結構解析' })).not.toBeInTheDocument()
    expect(screen.getByRole('region', { name: '延伸提問' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '複製「整體解析」提示詞' })).toBeInTheDocument()
  })

  it('結構解析逐一呈現位置、來源與數字特質並可關閉', async () => {
    render(<App />)
    const user = await submitBirthday('1984-12-25')

    await user.click(screen.getByRole('button', { name: '查看完整解析' }))
    expect(screen.getByRole('dialog', { name: '生命密碼結構解析' })).toBeInTheDocument()
    expect(screen.getByText('核心主性格')).toBeInTheDocument()
    expect(screen.getByText('個人側翼')).toBeInTheDocument()
    expect(screen.getByText('社會側翼')).toBeInTheDocument()
    expect(screen.getByText('位置功能：判斷、選擇與自我定位的核心模式')).toBeInTheDocument()
    expect(screen.getAllByText('優勢表現')).toHaveLength(24)
    expect(screen.queryByText('生命密碼沒有好壞之分')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '關閉結構解析' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('點擊圖中數字只開啟該位置解析', async () => {
    render(<App />)
    const user = await submitBirthday('1984-12-25')

    await user.click(screen.getByRole('button', { name: '核心主性格，數字 5，查看解析' }))

    expect(screen.getByRole('dialog', { name: '核心主性格解析' })).toBeInTheDocument()
    expect(screen.getByText('位置功能：判斷、選擇與自我定位的核心模式')).toBeInTheDocument()
    expect(screen.getAllByText('優勢表現')).toHaveLength(1)
    expect(screen.queryByText('個人側翼')).not.toBeInTheDocument()
  })

  it('可切換解析面向並複製對應提示詞', async () => {
    render(<App />)
    const user = await submitBirthday('2000-01-01')
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    })

    expect(screen.queryByLabelText('人工智慧解析提示詞')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '銷售與吸引' }))
    await user.click(screen.getByRole('button', { name: '複製「銷售與吸引」提示詞' }))
    const copiedPrompt = writeText.mock.calls[0][0] as string
    expect(copiedPrompt).toContain('西元生日：2000-01-01')
    expect(copiedPrompt).toContain('核心主性格（O＝M＋N）：9')
    expect(copiedPrompt).toContain('年份後段（L＝G＋H）：5')
    expect(copiedPrompt).toContain('若兩個加數都是 0，特殊記為 5')
    expect(copiedPrompt).toContain('如何向這個人銷售，以及如何吸引他的注意與信任')
    expect(screen.getByRole('button', { name: '已複製，可以貼上了' })).toBeInTheDocument()
  })

  it('沒有逐步導覽按鈕', async () => {
    render(<App />)
    await submitBirthday('1984-12-25')

    expect(screen.queryByRole('button', { name: '下一步' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '上一步' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '重新導覽' })).not.toBeInTheDocument()
  })

  it('更換生日後重新計算', async () => {
    render(<App />)
    const user = await submitBirthday('1984-12-25')
    expect(screen.getByTestId('diagram')).toHaveTextContent('主性格：5')

    await user.clear(screen.getByLabelText('西元生日'))
    await user.type(screen.getByLabelText('西元生日'), '2000-01-01')
    await user.click(screen.getByRole('button', { name: '啟動解析' }))

    expect(screen.getByTestId('diagram')).toHaveTextContent('主性格：9')
  })
})
