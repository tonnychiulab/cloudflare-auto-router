/**
 * 繁體中文語系字典 (zh-TW)
 */
export const zhTW = {
  headerTitle: 'CLOUDFLARE <b>AI GATEWAY</b>',
  headerSub: 'Auto Router 智慧路由流水線',
  cfFreeBtn: '☁️ CF 免費好物',
  eyebrow: 'Cloudflare Zero Trust & AI Gateway',
  pageTitle: 'Auto Router 即時路由決策管線',
  pageIntro: '觀察 Cloudflare Edge 邊緣分類器如何分析 Prompt，動態決策並路由至最佳 LLM 模型。支援即時免費容錯自動降級（Automatic Fallback）。',

  sec1Title: '01 / 存取防護',
  sec1Tag: 'Zero Trust Access',
  sec1Desc: '透過 Cloudflare Access RS256 JWT 驗證，僅授權使用者可存取此 Worker；Token 儲存於 Worker Secret，客戶端不洩漏任何憑據。',
  sec1Status: 'Access JWT 驗證通過 · 安全連線中',

  sec2Title: '02 / 任務提交',
  samples: {
    q1: '簡單問答',
    q2: '資安概念',
    q3: '架構分析',
    q4: '程式任務'
  },
  modelLabel: '指定路由策略 / 模型',
  promptLabel: '提問 Prompt',
  promptPlaceholder: '輸入你想讓 AI 解決的任務…',
  btnSubmit: '開始測試管線 →',
  btnRunning: '正在路由執行中…',

  sec3Title: '03 / 路由流水線 (Pipeline Visualizer)',
  statusStandby: '待命 (Standby)',
  statusRunning: '路由處理中…',
  statusComplete: '管線完成 (200 OK)',
  statusError: '處理失敗',

  p1Title: '任務請求',
  p1Idle: '待輸入',
  p2Title: 'AI Gateway 決策',
  p2Auto: 'Auto Router (智慧分析)',
  p2Direct: 'Direct (指定模型)',
  p3Title: '命中的推論模型',
  p4Title: '邊緣往返耗時',

  responseTitle: 'AI MODEL RESPONSE',
  btnCopy: '📋 複製回答',
  btnCopied: '✓ 已複製！',
  waitResponse: '送出提問後，此處將即時呈現模型生成內容。',

  telModel: '實際模型 (Routed Model)',
  telReason: '路由原因 (Routing Reason)',
  telLatency: '耗時 (Edge Latency)',
  telDecision: '決策序號 (Decision ID)',

  modalBadge: 'CLOUDFLARE FREE TIER ECOSYSTEM',
  modalTitle: '☁️ 探索 Cloudflare 免費邊緣神器',
  modalSubtitle: '你知道嗎？本實驗室運行的所有核心架構，在 Cloudflare 上全部「永久免費」！',
  m1Title: 'Zero Trust Access',
  m1Tag: '永久免費 50 位使用者',
  m1Desc: '企業級身分防護，免密碼 Email / GitHub 一鍵登入，徹底告別傳統 VPN。',
  m2Title: 'Cloudflare Workers',
  m2Tag: '每日 100,000 次免費請求',
  m2Desc: '全球 300+ 城市 0ms 冷啟動，本實驗室後端 API 就是跑在 Workers 上。',
  m3Title: 'Workers AI & Gateway',
  m3Tag: '每日 10,000 Neurons 免費算力',
  m3Desc: '免自建 GPU，0.5 秒直接在邊緣推論 Llama 3.2 等最新 AI 模型。',
  m4Title: 'R2 物件儲存 & D1 資料庫',
  m4Tag: '0 出口流量費 (Zero Egress)',
  m4Desc: '每月 10GB 免費儲存 + 每日 500 萬次讀取，徹底告別雲端帳單刺客。',
  btnExplore: '前往 Cloudflare 探索 ↗',
  btnDismiss: '我知道了，關閉',

  errors: {
    CONFIG_INCOMPLETE: 'Worker 尚未完成 Gateway 或 Token 設定。',
    INVALID_PROMPT: '問題長度不正確。',
    ORIGIN_MISMATCH: '來源檢查不符 (Origin Mismatch)',
    AUTH_REQUIRED: '需要有效的 Cloudflare Access 登入。請檢查 Access 設定。'
  }
};
