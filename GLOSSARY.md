# Glossary

Canonical vocabulary for the Cloudflare Auto Router project. Used across code, tickets, specs, and documentation.

### Auto Router
Cloudflare AI Gateway 的智慧路由功能，在邊緣端利用輕量分類器分析使用者的 Prompt 任務型態與複雜度，動態挑選最適合的模型。

### Candidate Pool (候選模型池)
Auto Router 在評估分流時所考慮的模型清單。取決於帳號權限（如免費方案 vs 付費方案）與已配置的 Provider 憑據。

### Fallback Protection (自動降級防護)
當 Auto Router 挑中帳號尚未開通的旗艦付費模型（如 Moonshot Kimi K3）導致權限遭拒（HTTP 403）時，系統在後端自動無縫切換至受支援的免費繁中模型（如 Llama 3.2 3B）的容錯機制。

### Pipeline Visualizer (路由流水線)
將一次 AI 請求分解為「任務請求 $\rightarrow$ AI Gateway 決策 $\rightarrow$ 命中推論模型 $\rightarrow$ 邊緣往返耗時」4 個連貫階段的視覺化介面組件。

### Access Assertion (Zero Trust 身分憑證)
Cloudflare Access 在驗證使用者身分後注入於請求標頭（`Cf-Access-Jwt-Assertion`）的 RS256 JWT，由 Worker 驗證其簽章、期限與 Audience Tag。

### Error Contract (統一錯誤契約)
前後端溝通錯誤時約定的標準結構，由標準錯誤代碼（`code`）、使用者友善訊息（`message`）與可選除錯細節（`details`）組成。
