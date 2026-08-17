# 生命密碼全息圖

以 React、TypeScript 與 HTML/SVG 製作的生日生命密碼解析頁。

## 開發指令

```bash
npm install
npm run dev
npm test -- --run
npm run build
```

## GitHub Pages

正式站由 `gh-pages` 分支提供。執行測試與 `npm run build` 後，將 `dist` 內容發布到該分支即可更新網站。
Vite 使用相對資源路徑，可直接部署在 GitHub Pages 的專案子路徑。

## 專案結構

- `src/lib/hologram.ts`：生日驗證、單一數字縮減與 A–X 節點純函式計算。
- `src/features/results/interpretations.ts`：0–9 數字特質文案。
- `src/features/results/AnalysisModal.tsx`：以「查看結構解析」彈窗逐一呈現 24 個位置的來源、功能與數字特質。
- `src/features/results/position-profiles.ts`：集中記錄所有節點的位置名稱、計算來源與解析角色。
- `src/features/results/AiPromptSection.tsx`：依目前結果產生整體、銷售吸引、合作、相處與衝突溝通等可一鍵複製的提示詞。
- `src/features/hologram/node-layout.ts`：節點座標、「全」字筆劃路徑與揭曉階段。
- `src/features/hologram/HologramDiagram.tsx`：SVG 字骨架加上 HTML 節點的全息圖。
- `src/styles/`：米白、淡紫、鼠尾草綠響應式視覺系統。

## 版面

首屏是單一焦點構圖：「全」字與數字居中，生日輸入與操作列直接在圖下方。`.stage` 以 `aspect-ratio` 與 `container-type: inline-size` 定尺寸；送出生日後約 1.5 秒依序揭曉生日八位數、推導位置與核心主性格，並在 `prefers-reduced-motion` 下立即顯示完整結果。

## 計算規則

每次相加都反覆縮減為單一數字。特殊規則：兩個加數皆為 0 時記為 **5**，例如西元 2000 年的年份後兩位 `00`，L 節點為 5 而非 0（見 `addNodes()`）。

## 座標系

`node-layout.ts` 以 970 × 930 的 viewBox 定義所有位置，節點再用 `toPercent()` 換算成容器百分比疊在 SVG 上。要調整卡位只需改 `NODE_LAYOUT` 或 `GLYPH_STROKES` 的座標，字骨架與節點會一起縮放。

節點位置對齊 `docs/assets/life-code-hologram-reference.png` 的結構：屋頂上方為 R、Q、P，屋頂內為 O（主性格），「王」字內為 M、N 與 I、J、K、L，最下一列為生日八位數 A–H，左右翼為 S、X、W 與 V、U、T。

## 內容限制

頁面沒有逐步導覽，輸入生日後會以約 1.5 秒依序揭曉生日數字、「全」字筆劃與核心主性格；點擊圖中數字可查看該位置解析，也可由按鈕開啟完整解析。目前解析由本地數字特質資料產生，不需網路或外部服務；頁面另提供多面向提示詞的一鍵複製功能。日後若改為站內串接人工智慧，服務金鑰不可放在前端程式碼中。
