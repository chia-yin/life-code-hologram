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

  it('有效生日顯示全息圖與基本分析', async () => {
    render(<App />)
    await submitBirthday('1984-12-25')

    expect(screen.getByTestId('diagram')).toHaveTextContent('主性格：5')
    expect(screen.getByRole('heading', { name: '基本分析' })).toBeInTheDocument()
    expect(screen.getByText('彈性探索')).toBeInTheDocument()
    expect(screen.getByText(/主性格落在 5「彈性探索」/)).toBeInTheDocument()
    expect(screen.getByText('多做想少')).toBeInTheDocument()
    expect(screen.getByText(/偏向先行動再校正/)).toBeInTheDocument()
    expect(screen.getByText('深海暗流')).toBeInTheDocument()
    expect(screen.getByText(/推導圖沒2、有7（不含生日八碼），落在「深海暗流」/)).toBeInTheDocument()
    expect(screen.getByText('閃電火花')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '完整解析' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '深入了解' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '開始「逐項讀懂」' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /逐項讀懂/ })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /串聯提醒/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '深入了解' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: '生命密碼結構解析' })).not.toBeInTheDocument()
    expect(screen.queryByRole('region', { name: '延伸提問' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /提示詞/ })).not.toBeInTheDocument()
  })

  it('結構解析逐一呈現位置、來源與數字特質並可關閉', async () => {
    render(<App />)
    const user = await submitBirthday('1984-12-25')

    await user.click(screen.getByRole('button', { name: '完整解析' }))
    expect(screen.getByRole('dialog', { name: '生命密碼結構解析' })).toBeInTheDocument()
    expect(screen.getByText('核心行為模式')).toBeInTheDocument()
    expect(screen.getByText('水火象限')).toBeInTheDocument()
    const dialog = screen.getByRole('dialog', { name: '生命密碼結構解析' })
    expect(dialog).toHaveTextContent(/推導圖沒2、有7（不含生日八碼），落在「深海暗流」/)
    expect(dialog).toHaveTextContent(/推導圖有3、沒8（不含生日八碼），落在「閃電火花」/)
    expect(screen.getByText('個人側翼')).toBeInTheDocument()
    expect(screen.getByText('社會側翼')).toBeInTheDocument()
    expect(dialog).toHaveTextContent(/在「核心主性格」這個位置/)
    expect(screen.getAllByText('優勢表現')).toHaveLength(24)
    expect(screen.queryByText('生命密碼沒有好壞之分')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '關閉結構解析' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('點擊圖中數字只開啟該位置解析', async () => {
    render(<App />)
    const user = await submitBirthday('1984-12-25')

    await user.click(screen.getByRole('button', { name: '核心主性格，數字 5，查看解析' }))

    const dialog = screen.getByRole('dialog', { name: '核心主性格解析' })
    expect(dialog).toBeInTheDocument()
    expect(dialog).toHaveTextContent('在「核心主性格」這個位置')
    expect(dialog).toHaveTextContent('判斷、選擇與自我定位的核心模式')
    expect(dialog).toHaveTextContent('數字 5「彈性探索」')
    expect(dialog).toHaveTextContent('思維節奏')
    expect(dialog).toHaveTextContent('多做想少')
    expect(screen.getAllByText('優勢表現')).toHaveLength(1)
    expect(screen.queryByText('個人側翼')).not.toBeInTheDocument()
  })

  it('可請求 AI 解析並以面向區塊呈現', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        analysis: '## 人格輪廓\n外放而敏銳。\n\n## 核心主性格\n數字偏向創意表達。',
      }),
    })
    vi.stubGlobal('fetch', fetchMock)

    render(<App />)
    const user = await submitBirthday('1984-12-25')
    await user.click(screen.getByRole('tab', { name: /串聯提醒/ }))
    await user.click(screen.getByRole('button', { name: '開始「串聯提醒」' }))

    expect(await screen.findByRole('heading', { name: '人格輪廓' })).toBeInTheDocument()
    expect(screen.getByText('外放而敏銳。')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '核心主性格' })).toBeInTheDocument()
    expect(screen.queryByText(/## /)).not.toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/analyze',
      expect.objectContaining({ method: 'POST' }),
    )
    const body = JSON.parse((fetchMock.mock.calls[0][1] as RequestInit).body as string)
    expect(body.prompt).toContain('頁面基本分析')
    expect(body.prompt).toContain('串成一幅可理解的圖')
    expect(body.prompt).toContain('西元生日：1984-12-25')
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
