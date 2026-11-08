# ADR 0001: 模組化架構與統一錯誤契約 (Modular Architecture & Error Contract)

- **狀態**：Accepted
- **日期**：2026-11-08

## 上下文 (Context)

原專案為單一原型檔案（`src/index.js`，包含 HTML/CSS/JS 前端、Zero Trust JWT 驗證、AI Gateway 呼叫與自動降級邏輯）。隨著加入智慧降級容錯、語系字串抽離、模型選單與 Cloudflare Pipeline Visualizer，所有邏輯擠在單一檔案導致以下問題：
1. 錯誤訊息以中文散落於後端各分支，前端無法做多語系適配。
2. 模型清單與降級目標寫死在執行路徑中，模型棄用時難以維護。
3. 難以針對驗證邏輯與 Gateway 轉發進行單元測試。

## 決策 (Decision)

1. **模組解耦 (Deep Modules)**：
   - `src/auth.js`：純粹負責 Cloudflare Access JWT 的 RS256 JWKS 簽名與過期驗證。
   - `src/gateway.js`：封裝向 AI Gateway 發送請求與偵測 403 自動降級（Fallback Protection）的核心邏輯。
   - `src/config/models.js`：統一宣告支援的模型目錄與預設降級模型。
   - `src/ui/`：抽離前端 HTML 模板、CSS 樣式與語系字典。
   - `src/index.js`：僅作為 Worker 的極簡 HTTP 路由派發器（Dispatcher）。
2. **統一錯誤契約 (Error Contract)**：
   - 後端統一以 `{ error: { code: string, message: string, details?: any } }` 格式回應非 200 狀態。
   - 前端依據 `code` 查表對應本地語系訊息，消除硬編碼耦合。

## 影響 (Consequences)

- **優點**：架構分明，便於擴充新語系（如英文）、替換新模型，並能針對 `auth.js` 與 `gateway.js` 撰寫自動化測試。
- **取捨**：增加檔案數量與模組引用，但換取了生產級專案的可維護性與可讀性。
