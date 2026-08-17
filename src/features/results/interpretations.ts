export interface DigitProfile {
  title: string
  keywords: string
  description: string
  strength: string
  challenge: string
  development: string
}

export const DIGIT_PROFILES: Record<number, DigitProfile> = {
  0: {
    title: '開放潛能',
    keywords: '留白、彈性、可能性',
    description: '此數字不急於固定方向，會先保留空間、吸收環境訊息，再決定如何投入。',
    strength: '能容納多種可能，面對變化時具有較高的調整空間。',
    challenge: '方向尚未成形時，容易延後選擇或依賴外部條件。',
    development: '先設定一個可修正的短期界線，用行動逐步確認真正需要。',
  },
  1: {
    title: '自主開創',
    keywords: '獨立、決斷、啟動',
    description: '此數字重視自主權與行動效率，通常透過率先開始來建立方向。',
    strength: '能迅速辨識目標、承擔決定並推動事情進入執行。',
    challenge: '節奏過快時，可能忽略他人資訊或把協作理解為限制。',
    development: '在做出決定前加入一次資訊校準，讓主導力同時具備共識。',
  },
  2: {
    title: '關係協調',
    keywords: '同理、合作、敏感度',
    description: '此數字善於感受互動氣氛，會透過傾聽、回應與協調維持關係品質。',
    strength: '能捕捉細微需求、建立信任，並在差異之間找到可合作的位置。',
    challenge: '過度顧及關係時，可能壓低自己的需求或延後必要的界線。',
    development: '先說清楚自身立場，再進入協調，避免把配合等同於共識。',
  },
  3: {
    title: '創意表達',
    keywords: '溝通、想像、感染力',
    description: '此數字透過語言、創作與分享整理經驗，也容易以新觀點帶動氣氛。',
    strength: '擅長轉譯複雜內容、提出新點子，並讓資訊更容易被理解。',
    challenge: '刺激過多時，注意力可能分散，想法也可能快於實際完成。',
    development: '把靈感收斂成單一主題與明確交付，讓表達轉化為可累積成果。',
  },
  4: {
    title: '結構建構',
    keywords: '秩序、穩定、執行',
    description: '此數字重視規則、方法與可預測性，習慣透過步驟建立可靠成果。',
    strength: '能建立流程、維持品質，並在長期投入中形成穩定基礎。',
    challenge: '面對模糊或快速變動時，可能過度依賴既有方式而降低彈性。',
    development: '保留核心標準，同時預留可試驗區域，讓穩定與調整並存。',
  },
  5: {
    title: '彈性探索',
    keywords: '變化、自由、經驗',
    description: '此數字透過移動、嘗試與直接經驗取得資訊，需要適度變化維持投入。',
    strength: '適應速度快、敢於試驗，能在不確定中找到新的切入點。',
    challenge: '追求新鮮感時，可能過早轉向或低估持續投入的重要性。',
    development: '為探索設定時間與完成條件，讓自由轉化為有方向的選擇。',
  },
  6: {
    title: '責任照顧',
    keywords: '關懷、承諾、平衡',
    description: '此數字重視關係責任與整體品質，會主動維護人、事與環境的穩定。',
    strength: '具有照顧力、責任感與品質意識，能讓團體感到被承接。',
    challenge: '承擔過多時，容易把他人的需要置於自己之前，形成隱性壓力。',
    development: '明確區分支持、協助與代替承擔，將自我照顧納入責任範圍。',
  },
  7: {
    title: '分析洞察',
    keywords: '研究、內省、辨識',
    description: '此數字需要充分理解才願意投入，習慣透過觀察、分析與沉澱形成判斷。',
    strength: '能深入問題核心、辨識模式，並提出有根據的獨立觀點。',
    challenge: '資訊不足或缺乏信任時，可能退回觀察而延後溝通與行動。',
    development: '設定足夠而非完美的資訊門檻，並把思考過程轉譯給他人。',
  },
  8: {
    title: '資源實現',
    keywords: '管理、成果、影響力',
    description: '此數字關注資源配置與實際成果，傾向把目標、權責與效益組織起來。',
    strength: '能掌握全局、整合資源，並把抽象方向推進為可衡量成果。',
    challenge: '成果壓力偏高時，可能過度控制或用效率取代關係與價值評估。',
    development: '在成果指標之外加入影響品質，讓權力、責任與價值保持一致。',
  },
  9: {
    title: '宏觀整合',
    keywords: '包容、理想、完成',
    description: '此數字容易從較大範圍理解事件，重視意義、完整性與經驗的轉化。',
    strength: '能跨越局部差異看見共同方向，並把經驗整理成可分享的價值。',
    challenge: '理想與現實落差大時，可能承擔過廣或難以結束已不適合的投入。',
    development: '把理想拆成具體邊界與階段成果，完成必要的取捨與收尾。',
  },
}
