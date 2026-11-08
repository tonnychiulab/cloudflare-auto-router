# Cloudflare Auto Router 實驗室 (Auto Router Lab)

> ☁️ 部署於 Cloudflare Worker 的邊緣 AI 智慧路由流水線：結合 **Zero Trust Access 身分防護**、**AI Gateway 動態模型調度**、**自動降級容錯 (Fallback Protection)** 與 **免費額度即時儀表盤**。

[![Deploy to Cloudflare Workers](https://github.com/tonnychiulab/cloudflare-auto-router/actions/workflows/deploy.yml/badge.svg)](https://github.com/tonnychiulab/cloudflare-auto-router/actions)
[![Zero Trust Protected](https://img.shields.io/badge/Security-Zero%20Trust%20Access-orange.svg)](https://www.cloudflare.com/zero-trust/)

---

## 📸 介面與功能展示 (Screenshots)

### 1. 現有模型與任務提交 (Model Selection & Zero Trust)
支援 `cloudflare/auto` 智慧動態分析分流，或直接指定受支援的免費繁中模型（Meta Llama 3.2 3B/1B、Qwen 3 MoE），全程受 Cloudflare Access RS256 JWT 鑑權保護。

![現有模型選單與任務提交](docs/images/model-selection.jpg)

### 2. 成功推論與路由流水線 (Successful Inference & Visualizer)
測試成功後，系統自動捲動至 03 路由流水線，即時呈現邊緣分類決策序號、命中的推論模型與往返毫秒延遲，並提供一鍵複製回答功能。

![成功推論與路由結果](docs/images/success-result.jpg)

### 3. 錯誤與自動降級防護情境 (Automatic Fallback Protection)
在 Cloudflare 免費方案中，若 `cloudflare/auto` 挑中帳號未開通的付費模型（如 Moonshot Kimi K3）時會遭遇 HTTP 403。本實驗室實作後端自動降級機制，無縫切換至受支援的免費 Llama 3.2 模型順利回答，化解報錯。

![付費模型遭遇 403 報錯情境](docs/images/failure-paid-403.jpg)

---

## ✨ 核心特色 (Key Features)

- **邊緣免費額度儀表盤 (Free Quota Dashboard)**：開箱即用展示每日 100,000 次 Worker 請求、10,000 Neurons 免費算力與會話即時統計。
- **Zero Trust 零信任身分驗證**：Worker 於邊緣直接校驗 RS256 JWKS 簽名、期限與 Audience Tag，無憑證直接攔截。
- **智慧自動降級 (Auto-Fallback)**：解決 Auto Router 免費方案挑中付費 Kimi K3 報錯的痛點。
- **嚴格模型白名單**：後端嚴格校驗請求模型，防止惡意消耗外部第三方 Provider 額度。
- **完整 i18n 雙語系切換**：繁體中文（zh-TW）與英文（en-US）動態切換，瀏覽器 `<title>` 動態聯動。
- **開源友善 CI/CD**：內建互動式導引精靈腳本與 GitHub Actions 自動化部署。

---

## 🚀 快速開始：一鍵互動式部署精靈 (Wizard)

專案內建互動式導引精靈腳本，能一步一步引導你完成 GitHub 倉庫關聯、Cloudflare 憑據收集、自動寫入 GitHub Actions Secrets/Variables，並觸發 CI/CD 自動部署：

```bash
# 執行互動式部署導引精靈
npm run wizard
# 或是直接以 bash 執行
bash scripts/setup-cicd-wizard.sh
```

---

## 🛠 手動部署流程 (Manual Setup)

1. 在終端機進入 `cloudflare-auto-router` 目錄，安裝相依套件並登入 Cloudflare：
   ```bash
   npm install
   npx wrangler login
   ```

2. 複製本地開發設定範本：
   ```bash
   cp .dev.vars.example .dev.vars
   ```
   填入你的 `CLOUDFLARE_ACCOUNT_ID`、`CLOUDFLARE_GATEWAY_ID`、`CF_ACCESS_AUD`、`CF_ACCESS_TEAM_DOMAIN` 與 `CLOUDFLARE_API_TOKEN`。

3. 到 Cloudflare 儀表板的 **Workers & Pages → auto-router-lab → Access → Protect this Worker behind Access**，保護該 Worker 路由。

4. 將專用 Token 放到 Worker Secret 並部署：
   ```bash
   npx wrangler secret put CLOUDFLARE_API_TOKEN
   npx wrangler deploy
   ```
