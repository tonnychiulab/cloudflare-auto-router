# Auto Router 實驗室：部署到自己的 Cloudflare Worker

這個專案把網頁與 API 部署到你自己的 Cloudflare 帳號。瀏覽器不輸入 Gateway Token；Token 由 Worker Secret 提供。Worker 會驗證 Cloudflare Access JWT 的簽章、發行者、Audience 和有效期限；缺少或驗證失敗時拒絕所有請求。請自行設定 Access 政策，並確認只有指定的人可以登入。

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

## 🛠 自動化 CI/CD 架構 (GitHub Actions)

本專案支援開源友善的自動化部署：
- 敏感金鑰（`CLOUDFLARE_API_TOKEN`）與環境變數（`CLOUDFLARE_ACCOUNT_ID`、`CF_ACCESS_AUD` 等）均由 GitHub Secrets & Variables 注入，**不會洩漏至 Git 倉庫**。
- 每次推送至 `main` 分支時，GitHub Actions 會自動執行語法檢查並透過 `cloudflare/wrangler-action` 部署 Worker。

---

## 需要準備

- Cloudflare 帳號、已建立的 AI Gateway、Account ID 和 Gateway ID。
- 一組專用、最小權限的 Cloudflare API Token（依官方 AI Gateway 文件與你的帳號設定授權）；不要把 Token 寫進程式、`wrangler.jsonc`、Git 或聊天。
- Cloudflare Zero Trust，啟用 Access 並設定登入方式。
- 電腦安裝 Node.js（建議使用 Wrangler 所支援的目前 LTS 版本）及 npm。
- GitHub CLI (`gh`)（用於自動化建立遠端倉庫與同步 Secrets）。

## 手動部署流程 (Manual Setup)

若偏好手動設定，可參考以下步驟：

1. 在終端機進入 `cloudflare-auto-router` 目錄，執行：

   ```bash
   npm install
   npx wrangler login
   ```

2. 複製本地開發設定範本：

   ```bash
   cp .dev.vars.example .dev.vars
   ```

   填入你的 `CLOUDFLARE_ACCOUNT_ID`、`CLOUDFLARE_GATEWAY_ID`、`CF_ACCESS_AUD`、`CF_ACCESS_TEAM_DOMAIN` 與 `CLOUDFLARE_API_TOKEN`。

3. 到 Cloudflare 儀表板的 **Workers & Pages → auto-router-lab → Access → Protect this Worker behind Access**，選擇 **All traffic**；建立或選擇只允許你指定電子郵件登入的政策。

4. 將專用 Token 放到 Worker Secret：

   ```bash
   npx wrangler secret put CLOUDFLARE_API_TOKEN
   npx wrangler deploy
   ```

5. 開啟 Worker 網址，完成 Access 登入，輸入問題測試。

## 注意事項與安全性

- **費用控管**：請求可能有費用，建議在 AI Gateway 設定 spend limits、rate limiting 並定期查看用量。此範例沒有自行實作帳號額度或速率限制。
- **日誌政策**：記錄內容取決於 Cloudflare Gateway 的日誌設定；請勿輸入敏感資料，除非你已確認適用的日誌和資料政策。
- **Token 安全**：請使用自己的測試 Token，定期輪替；若疑似外洩，立刻撤銷並更新 Secret。
