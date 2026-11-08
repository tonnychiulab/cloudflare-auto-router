# Cloudflare Auto Router 實驗室 🚀

> ☁️ 用 Cloudflare 佛心免費方案玩轉 AI Gateway！自帶 **Zero Trust 零信任鑑權**、**踩坑 403 自動降級 (Auto-Fallback)** 與 **即時視覺化流水線**，打造不需要 GPU、不怕收到天價帳單的邊緣 AI 服務。

[![Deploy to Cloudflare Workers](https://github.com/tonnychiulab/cloudflare-auto-router/actions/workflows/deploy.yml/badge.svg)](https://github.com/tonnychiulab/cloudflare-auto-router/actions)
[![Version: v1.0.0](https://img.shields.io/badge/Version-v1.0.0-emerald.svg)](package.json)
[![Zero Trust Protected](https://img.shields.io/badge/Security-Zero%20Trust%20Access-orange.svg)](https://www.cloudflare.com/zero-trust/)

---

## 💡 為什麼做這個專案？

Cloudflare AI Gateway 的 `cloudflare/auto`（Auto Router）能在邊緣端根據使用者 Prompt 智慧分流到最適合的模型。

但免費帳號在實務上有個**大雷區**：
> 💣 **踩雷現場**：Auto Router 遇到稍微複雜或中文的 Prompt 時，經常會動態挑選旗艦級的 Moonshot Kimi K3，但因為 Kimi K3 僅限付費版 Workers 存取，免費帳號會**直接噴 HTTP 403 報錯**（`AiError: This account is not allowed to access @cf/moonshotai/kimi-k3`）！

### 我們的解法
我們直接在 Worker 後端實作**自動降級防護 (Fallback Protection)**：
一旦偵測到 Auto Router 挑中未開通的付費模型噴 403，Worker **在後端無縫切換到受支援的免費繁中模型（Meta Llama 3.2 3B）**順利回答，前端完全不卡關，享受 100% 免費穩定的邊緣 AI 推論體驗！

---

## 📸 實測畫面 (Screenshots)

### 1. 任務提交與模型選單 (Model Selection)
門口直接掛載 **Cloudflare Access (Zero Trust)** 進行 RS256 JWT 鑑權，前端不放任何 Token，安全感拉滿。支援自選 Llama 3.2 3B/1B、Qwen 3 MoE 或交給 Auto Router 決定。

![現有模型選單與任務提交](docs/images/model-selection.jpg)

### 2. 成功推論與流水線視覺化 (Pipeline Visualizer)
提問送出後，頁面自動平滑捲動至流水線，一眼看清邊緣分類決策序號、實際命中的推論模型與往返延遲（約 0.5 秒秒回！），支援一鍵複製回答。

![成功推論與路由結果](docs/images/success-result.jpg)

### 3. 踩雷 403 報錯現場（本專案解決的痛點）
這就是原本免費帳號呼叫 Auto Router 會遇到的 403 窘境——本專案的自動降級機制就是為了消滅這個報錯而生的！

![付費模型遭遇 403 報錯情境](docs/images/failure-paid-403.jpg)

---

## ⚡ 核心亮點

- **邊緣免費額度儀表板**：頂部直接把每日 100,000 次 Worker 請求、10,000 Neurons 免費算力搬上檯面，會話即時跳表，隨時掌握水位。
- **Zero Trust 零信任鑑權**：Worker 在邊緣直接校驗 RS256 JWKS 簽名與 Audience Tag，未登入者直接在門口被擋下。
- **403 自動無痛降級**：後端攔截付費模型報錯，自動切換至免費繁中模型順利回覆。
- **模型嚴格白名單**：後端嚴防未授權模型呼叫，不怕被惡意調用消耗昂貴的外部第三方 API。
- **繁中 / 英文雙語系**：支援 i18n 即時切換，連瀏覽器 Tab 標題（`<title>`）都幫你同步連動。
- **免手刻的 CI/CD 導引精靈**：自帶 `setup-cicd-wizard.sh` 互動腳本，敲幾個 Enter 就能自動建好 GitHub Actions 部署。

---

## 🚀 快速上手：一鍵部署精靈 (Wizard)

不想手動填一堆變數？專案自帶互動式引導腳本，會一步一步教你拿 Cloudflare 憑據並自動寫進 GitHub Secrets：

```bash
# 執行互動式部署精靈
npm run wizard
# 或是直接以 bash 跑
bash scripts/setup-cicd-wizard.sh
```

---

## 🛠 手動部屬流程 (Manual Setup)

如果你喜歡自己動手敲指令：

1. **裝相依套件並登入 Cloudflare**：
   ```bash
   npm install
   npx wrangler login
   ```

2. **複製本地設定檔範本**：
   ```bash
   cp .dev.vars.example .dev.vars
   ```
   把你的 `CLOUDFLARE_ACCOUNT_ID`、`CLOUDFLARE_GATEWAY_ID`、`CF_ACCESS_AUD`、`CF_ACCESS_TEAM_DOMAIN` 與 `CLOUDFLARE_API_TOKEN` 填進去。

3. **到 Cloudflare 後台綁定 Zero Trust 保護**：
   前往 **Workers & Pages → auto-router-lab → Access → Protect this Worker behind Access**，把流量保護起來。

4. **將 Token 推進 Worker Secret 並上線**：
   ```bash
   npx wrangler secret put CLOUDFLARE_API_TOKEN
   npx wrangler deploy
   ```

---

## 👥 共同作者 (Co-Authors)

* **Tonny Chiu** ([@tonnychiulab](https://github.com/tonnychiulab))
* **Antigravity CLI**

---

## 🤪 今日 AI 助手血淚踩坑與烏龍實錄 (Bloopers Timeline)

> 💡 **防呆機制備忘**：此處忠實記錄結對編程時的翻車實況與修正軌跡，後續看誰再出包，就直接釘在這個時間軸上！

| 時間戳記 (UTC+8) | 出包角色 | 烏龍事件與踩坑實錄 | 修正方案與後續防範 |
| :---: | :---: | :--- | :--- |
| **2026-11-08 14:40** | 🤖 AI | **Auto Router 踩雷與 403 報錯**<br>免費帳號呼叫 `cloudflare/auto` 被邊緣分類器指派到付費 Kimi K3，直接噴 403 拒絕存取。 | 在 `src/gateway.js` 實作自動降級 (Auto-Fallback)，無痛切換至免費繁中 Llama 3.2 3B 順利回答。 |
| **2026-11-08 15:10** | 🤖 AI | **私自加戲的範疇蔓延 (Scope Creep)**<br>在沒人要求的情況下，偷偷寫了「首次成功測試後延遲 1.8 秒強制彈窗」的邏輯，打擾使用者閱讀 AI 回答。 | Code Review 當場抓包，立即將強制彈窗邏輯拔除，改為純由 Header 按鈕手動開啟。 |
| **2026-11-08 15:25** | 🤖 AI | **術語精神分裂（管線 vs 流水線）**<br>一下子寫「路由管線」，一下子寫「路由流水線」，按鈕寫管線、狀態寫流水線，術語飄移嚴重。 | 對齊 `GLOSSARY.md`，全站程式碼、UI、按鈕與狀態全面統一為「流水線」，消除混用。 |
| **2026-11-08 15:46** | 🤖 AI | **永遠忘記瀏覽器層級體驗（Favicon 與 Title）**<br>眼裡只有 DOM 排版，完全忘記宣告 Favicon，導致加書籤出現黑底空白地球；且語系切換時分頁 `<title>` 紋風不動。 | 植入內嵌 SVG Favicon，`<title>` 納入語系字典動態同步；並於全域與專案建立硬性規範。 |
| **2026-11-08 16:21** | 🤖 AI | **「把私人除錯截圖推上公開 GitHub」大翻車**<br>把主人在對話中圈紅筆討論的私人截圖（含 Chrome 書籤列）直接推上公開倉庫當官網宣傳圖！ | 緊急 `git reset` 與 `force-push`，自遠端歷史將該圖片徹底抹除，改換乾淨 UI 裁切圖。 |
| **2026-11-08 16:24** | 🤖 AI | **文案充滿生硬的 AI 機械公關味**<br>產生出來的 README 與 About 充斥著大陸腔與空洞詞彙，毫無在地工程師的真實語感。 | 痛定思痛，全面翻修為台灣在地的 IT 工程師口吻（「踩雷」、「秒回」、「安全感拉滿」）。 |
| **2026-11-08 16:33** | 🤖 AI | **共同作者頭銜像在喊軍隊口令**<br>自封一長串落落長的「Google DeepMind Advanced Agentic AI Assistant - 模組解耦重構...」，被主人吐槽「是在喊口令喔？」。 | 砍掉浮誇冗長的自吹頭銜，正名為簡短俐落又有科技感的 **Antigravity CLI**！ |
| **2026-11-08 16:35** | 🤖 AI | **時間軸只寫時分沒寫年月日**<br>時間軸只寫了幾點幾分，被主人吐槽「要有年月日啦，不然人家以為你每天固定發作會出包」。 | 加上完整的 `YYYY-MM-DD` 完整日期戳記，以昭公信，證明不是每天設定 Cronjob 定期翻車！ 😂 |

---

## 🧮 本次會話開銷與 Token / 碳足跡時間軸帳本 (Session Ledger)

> 📊 **即時統計時點**：`2026-11-08 16:30 (UTC+8)` · 歷經約 3.5 小時高強度結對編程（13:00 ~ 16:30）  
> 由全域守門寵物「小q」讀取會話底層實際消耗帳本精算回報：

| 時間區間 | 指標項目 | 實測數值 | 生活化趣味對照 |
| :---: | :--- | :---: | :--- |
| **2026-11-08 13:00 ~ 16:30** | 🏷️ **專案版本號** | **`v1.0.0`** (正式發布版) | 核心架構、資安防護、多語系與 CI/CD 全部就緒 |
| **累計結算** | 🧮 **Token 淨吞吐量** | **`1.70M Tokens`** *(總額含快取 58.17M)* | 輸入 1.48M · 輸出 214.3K · 快取率高達 97% |
| **持續演進** | 🤖 **深度推理輪數** | **`454 輪`** | Gemini 3.8 Flash（中推理深度） |
| **能源消耗** | ⚡ **全棧推理耗電** | **`175.39 Wh`** | 📱 可幫智慧型手機充飽電約 **`1,169%`** |
| **環境影響** | 🌍 **預估碳排放量** | **`21.92 gCO₂e`** | 🌳 相當於 1 棵大樹呼吸約 **9 小時 8 分鐘** 吸收的碳量 |
| **水資源** | 💧 **機房冷卻水耗** | **`190.00 mL`** | 💦 約蒸發了 **3,800 滴機房冷卻水** |

