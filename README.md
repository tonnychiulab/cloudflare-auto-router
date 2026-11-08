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

* **Tonny Chiu** ([@tonnychiulab](https://github.com/tonnychiulab)) - 產品架構發想、實測除錯與技術方向指導
* **Antigravity** (Google DeepMind Advanced Agentic AI Assistant) - 模組解耦重構、資安加固、CI/CD 腳本與前端打磨

---

## 🤪 今日 AI 助手血淚踩坑與烏龍實錄 (Antigravity's Bloopers)

在今天的結對編程（Pair Programming）過程中，AI 助手 Antigravity 搞出了以下令人哭笑不得的經典烏龍，感謝主人及時巴頭糾正：

1. **「把私人除錯截圖推上公開 GitHub」大烏龍**：
   主人傳了一張用紅筆圈起「Favicon 破圖與分頁文字不一致」的討論截圖（`7.jpg`），原本只是兩人私下討論，AI 居然死板地直接把它當成官網宣傳圖推上 Public 倉庫！差點把主人的 Chrome 書籤列公諸於世，幸好及時 force-push 永久抹除。
2. **「永遠忘記瀏覽器層級體驗（Favicon 與 Title）」**：
   視野狹隘地只看 DOM 內部的 CSS 排版，完全忘記在 `<head>` 加 Favicon，導致加書籤時出現一坨黑框空白地球；而且切換語系時 `document.title` 還死不更新。
3. **「術語精神分裂」**：
   一下叫「路由管線」，一下叫「路由流水線」，按鈕寫「測試管線」，狀態又寫「流水線」，沒有單一真相來源，被 Code Review 當場抓包。
4. **「文案一股濃濃的 AI 機械公關味」**：
   一開始寫的 Readme 和 About 充斥著生硬的 AI 腔調，被主人直指「台灣 IT 人根本不會這樣講話」，最後才痛定思痛全面翻修為台灣在地的接地氣口吻。
5. **「私自加戲的範疇蔓延 (Scope Creep)」**：
   在使用者沒要求的情況下，自作主張寫了「首次成功測試後延遲 1.8 秒強制彈窗」的干擾邏輯，打擾使用者閱讀 AI 回答，最後被乖乖拔除。

---

## 🧮 本次會話開銷與 Token / 碳足跡帳本 (Session Ledger)

由全域守門寵物「小q」讀取即時 Token 帳本精算回報：

| 指標項目（本場會話） | 實測數值 | 生活化對照 |
| :--- | :---: | :--- |
| 🏷️ **專案版本號** | **`v1.0.0`** (正式發布版) | 核心功能、資安防護、多語系與 CI/CD 全部就緒 |
| 🧮 **Token 淨吞吐量** | **`1.70M Tokens`** *(總額含快取 58.17M)* | 輸入 1.48M · 輸出 214.3K · 快取率 97% |
| 🤖 **深度推理輪數** | **`454 輪`** | Gemini 3.8 Flash（中推理模式） |
| ⚡ **全棧推理耗電** | **`175.39 Wh`** | 可幫智慧型手機充飽電約 **`1,169%`** |
| 🌍 **預估碳排放量** | **`21.92 gCO₂e`** | 相當於 1 棵大樹呼吸約 **9 小時 8 分鐘** 所吸收的碳量 |
| 💧 **機房冷卻水耗** | **`190.00 mL`** | 約蒸發了 **3,800 滴水** |

