export interface ModeReading {
  id: 'tempo' | 'work' | 'language' | 'money'
  label: string
  value: string
  summary: string
}

const TEMPO_SMALL = new Set([1, 2, 3, 4, 5])
const WORK_BOLD = new Set([1, 3, 5, 8, 9])
const LANGUAGE_RATIONAL = new Set([1, 4, 6, 7, 9])
const MONEY_HANDS_ON = new Set([1, 3, 4, 8])

/**
 * 依數字推導四種行為模式。
 * 規則來源：小數字／大數字、工作模式、語言模式、金錢模式對照表。
 */
export function getDigitModes(digit: number): ModeReading[] {
  if (!Number.isInteger(digit) || digit < 0 || digit > 9) {
    throw new Error('數字必須是 0–9 的整數')
  }

  if (digit === 0) {
    return [
      {
        id: 'tempo',
        label: '思維節奏',
        value: '彈性觀察',
        summary: '尚不固定為多做或多想，先保留空間再決定節奏。',
      },
      {
        id: 'work',
        label: '工作模式',
        value: '情境調整',
        summary: '會依環境與關係決定推進方式，不預設固定做法。',
      },
      {
        id: 'language',
        label: '語言模式',
        value: '可理可感',
        summary: '理性與感性都可切入，重點是先聽清楚對方需要什麼。',
      },
      {
        id: 'money',
        label: '金錢模式',
        value: '彈性調度',
        summary: '可親自處理，也可借助他人；先確認目標再選方法。',
      },
    ]
  }

  const tempoSmall = TEMPO_SMALL.has(digit)
  const workBold = WORK_BOLD.has(digit)
  const languageRational = LANGUAGE_RATIONAL.has(digit)
  const moneyHandsOn = MONEY_HANDS_ON.has(digit)

  return [
    {
      id: 'tempo',
      label: '思維節奏',
      value: tempoSmall ? '多做想少' : '少做多想',
      summary: tempoSmall
        ? '偏向先行動再校正，適合用實作累積判斷。'
        : '偏向先想清楚再行動，適合用規劃與評估提高品質。',
    },
    {
      id: 'work',
      label: '工作模式',
      value: workBold ? '先做再說，抓大放小' : '小心翼翼，重關係，顧品質',
      summary: workBold
        ? '先啟動、先推進主線，細節可之後再補。'
        : '重視關係與品質，習慣把風險與細節顧好再前進。',
    },
    {
      id: 'language',
      label: '語言模式',
      value: languageRational ? '理性' : '感性',
      summary: languageRational
        ? '較容易被邏輯、結構與明確依據說服。'
        : '較容易被感受、氛圍與關係連結打動。',
    },
    {
      id: 'money',
      label: '金錢模式',
      value: moneyHandsOn ? '親力親為' : '借力使力',
      summary: moneyHandsOn
        ? '偏向親自掌控流程與細節，才安心完成。'
        : '偏向整合資源與他人力量，放大成果而不必全部自己做。',
    },
  ]
}
