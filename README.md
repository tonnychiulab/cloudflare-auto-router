# Cloudflare Auto Router 實驗室 🚀

> ☁️ 用 Cloudflare 佛心免費方案玩轉 AI Gateway！自帶 **Zero Trust 零信任鑑權**、**踩坑 403 自動降級 (Auto-Fallback)** 與 **即時視覺化流水線**，打造不需要 GPU、不怕收到天價帳單的邊緣 AI 服務。

[![Deploy to Cloudflare Workers](https://github.com/tonnychiulab/cloudflare-auto-router/actions/workflows/deploy.yml/badge.svg)](https://github.com/tonnychiulab/cloudflare-auto-router/actions)
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
