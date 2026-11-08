const html = `<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Cloudflare Auto Router 實驗室</title><style>
:root{--cf-orange:#f6821f;--cf-orange-hover:#e06d12;--cf-dark:#151b28;--cf-navy:#1e293b;--cf-bg:#f8fafc;--cf-border:#e2e8f0;--cf-text:#0f172a;--cf-muted:#64748b;--cf-green:#10b981;--cf-amber:#f59e0b;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;color:var(--cf-text);background:var(--cf-bg)}
*{box-sizing:border-box}body{margin:0;line-height:1.6}
header{background:var(--cf-dark);color:white;padding:18px max(6vw,24px);display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid var(--cf-orange)}
header .brand{display:flex;align-items:center;gap:12px;font-size:18px;font-weight:700;letter-spacing:-.02em}
header .brand svg{width:26px;height:26px;fill:var(--cf-orange)}
header .sub{color:#94a3b8;font-size:13px;font-weight:500}
main{max-width:1200px;margin:auto;padding:36px 20px}
.eyebrow{color:var(--cf-orange);font-weight:700;letter-spacing:.12em;font-size:11px;text-transform:uppercase}
h1{font-size:clamp(28px,4vw,42px);letter-spacing:-.03em;margin:6px 0 10px;font-weight:800}
.intro{max-width:760px;color:var(--cf-muted);font-size:15px;margin-bottom:28px}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}
.card{background:#fff;border:1px solid var(--cf-border);border-radius:12px;padding:22px;box-shadow:0 4px 12px rgba(15,23,42,.03)}
.wide{grid-column:1/-1}
.row{display:flex;justify-content:space-between;align-items:center;gap:10px}
.tag{background:#fff7ed;color:var(--cf-orange);border:1px solid #fed7aa;border-radius:20px;padding:4px 10px;font-size:12px;font-weight:700}
label{display:block;font-size:13px;font-weight:700;margin:14px 0 6px;color:#334155}
input,select,textarea{width:100%;border:1px solid #cbd5e1;border-radius:8px;padding:10px 12px;font:inherit;background:#fff;color:inherit}
textarea{resize:vertical;min-height:115px}
input:focus,select:focus,textarea:focus{outline:2px solid var(--cf-orange);border-color:transparent}
button.primary{border:0;border-radius:8px;padding:12px 20px;cursor:pointer;font:inherit;font-weight:700;background:var(--cf-orange);color:white;transition:background .15s}
button.primary:hover{background:var(--cf-orange-hover)}
button.primary:disabled{opacity:.5;cursor:wait}
.samples{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px}
.samples button{background:#f1f5f9;color:#475569;font-size:12px;padding:6px 10px;border:1px solid #e2e8f0;border-radius:6px;cursor:pointer}
.samples button:hover{background:#e2e8f0}
.hint{font-size:12px;margin:8px 0;color:var(--cf-muted)}

/* Pipeline Visualizer (方案 1) */
.pipeline-box{background:linear-gradient(180deg,#fff 0%,#f8fafc 100%);border:1px solid var(--cf-border);border-radius:12px;padding:20px;margin-bottom:20px}
.pipeline-bar{display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;border-bottom:1px solid var(--cf-border);padding-bottom:12px}
.pipeline-bar .status-pill{display:inline-flex;align-items:center;gap:8px;font-size:13px;font-weight:700;padding:4px 12px;border-radius:20px}
.pill-idle{background:#f1f5f9;color:#64748b}
.pill-running{background:#fef3c7;color:#b45309}
.pill-success{background:#ecfdf5;color:#047857;border:1px solid #a7f3d0}
.pill-fallback{background:#fff7ed;color:#c2410c;border:1px solid #ffedd5}
.pulsing-dot{width:8px;height:8px;border-radius:50%;background:#10b981;box-shadow:0 0 0 rgba(16,185,129,.5);animation:pulse 2s infinite}
@keyframes pulse{0%{box-shadow:0 0 0 0 rgba(16,185,129,.7)}70%{box-shadow:0 0 0 8px rgba(16,185,129,0)}100%{box-shadow:0 0 0 0 rgba(16,185,129,0)}}

.pipeline-flow{display:grid;grid-template-columns:1fr auto 1.2fr auto 1.5fr auto 1fr;align-items:center;gap:10px}
.pipe-step{background:#fff;border:1px solid #cbd5e1;border-radius:10px;padding:12px 14px;box-shadow:0 2px 4px rgba(15,23,42,.04);position:relative}
.pipe-step.active{border-color:var(--cf-orange);box-shadow:0 0 0 2px rgba(246,130,31,.2)}
.pipe-step.fallback{border-color:var(--cf-amber);box-shadow:0 0 0 2px rgba(245,158,11,.2)}
.pipe-step .step-num{font-size:10px;font-weight:800;letter-spacing:.08em;color:var(--cf-muted);display:block;margin-bottom:2px}
.pipe-step .step-title{font-size:13px;font-weight:700;display:block;color:#0f172a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pipe-step .step-badge{font-size:11px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;display:inline-block;padding:2px 6px;border-radius:4px;margin-top:4px;background:#f1f5f9;color:#475569}
.pipe-step.active .step-badge{background:#fff7ed;color:var(--cf-orange);font-weight:700}
.pipe-step.fallback .step-badge{background:#fffbeb;color:#b45309;font-weight:700}
.pipe-arrow{color:#94a3b8;font-size:16px;display:flex;align-items:center;justify-content:center}

/* Response Section */
.response-box{border:1px solid #cbd5e1;border-radius:10px;overflow:hidden;background:#fff;margin-top:16px}
.response-head{background:#f8fafc;padding:10px 16px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #e2e8f0;font-size:12px;font-weight:700;color:#475569}
.response-body{padding:18px 20px;white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.75;font-size:15px;color:#1e293b;min-height:90px}
.btn-copy{background:#fff;border:1px solid #cbd5e1;border-radius:6px;padding:4px 8px;font-size:11px;cursor:pointer;font-weight:600;color:#475569}
.btn-copy:hover{background:#f1f5f9}

/* Telemetry Grid */
.telemetry-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:16px}
.tel-item{background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:10px 12px}
.tel-item small{font-size:11px;color:var(--cf-muted);display:block}
.tel-item strong{font-size:13px;color:#1e293b;word-break:break-all}
.footer{font-size:12px;color:var(--cf-muted);margin-top:32px;text-align:center}

/* Cloudflare Ecosystem Modal */
.modal-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(15,23,42,.68);backdrop-filter:blur(5px);display:flex;align-items:center;justify-content:center;z-index:9999;padding:16px}
.modal-card{background:#fff;border:1px solid var(--cf-border);border-radius:16px;max-width:680px;width:100%;padding:28px;box-shadow:0 20px 40px rgba(0,0,0,.2);position:relative;animation:modalIn .25s ease-out}
@keyframes modalIn{from{opacity:0;transform:scale(.95) translateY(12px)}to{opacity:1;transform:scale(1) translateY(0)}}
.modal-close{position:absolute;top:16px;right:16px;background:none;border:none;font-size:18px;color:#94a3b8;cursor:pointer;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center}
.modal-close:hover{background:#f1f5f9;color:#0f172a}
.modal-badge{font-size:11px;font-weight:800;letter-spacing:.1em;color:var(--cf-orange);text-transform:uppercase;margin-bottom:6px}
.modal-title{font-size:22px;font-weight:800;margin:0 0 8px;letter-spacing:-.02em}
.modal-subtitle{font-size:14px;color:var(--cf-muted);margin:0 0 20px;line-height:1.5}
.modal-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:24px}
.m-card{background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:14px;display:flex;gap:12px;align-items:flex-start}
.m-icon{font-size:22px;flex-shrink:0;margin-top:2px}
.m-card strong{font-size:13px;display:block;color:#0f172a}
.m-tag{display:inline-block;background:#ecfdf5;color:#059669;border:1px solid #a7f3d0;font-size:10px;font-weight:700;padding:2px 6px;border-radius:4px;margin:2px 0 4px}
.m-card p{font-size:12px;color:var(--cf-muted);margin:0;line-height:1.5}
.modal-actions{display:flex;justify-content:flex-end;gap:10px;align-items:center;border-top:1px solid var(--cf-border);padding-top:16px}
.btn-cf-dash{background:var(--cf-orange);color:white;font-size:13px;font-weight:700;text-decoration:none;padding:10px 18px;border-radius:8px;transition:background .15s}
.btn-cf-dash:hover{background:var(--cf-orange-hover)}
.btn-cf-dismiss{background:#f1f5f9;color:#475569;border:1px solid #cbd5e1;font-size:13px;font-weight:600;padding:10px 16px;border-radius:8px;cursor:pointer}
.btn-cf-dismiss:hover{background:#e2e8f0}
.header-btn{background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);color:#fff;border-radius:20px;padding:5px 12px;font-size:12px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:6px;transition:all .15s}
.header-btn:hover{background:var(--cf-orange);border-color:var(--cf-orange)}

@media(max-width:860px){
  .grid{grid-template-columns:1fr}
  .pipeline-flow{grid-template-columns:1fr;gap:8px}
  .pipe-arrow{transform:rotate(90deg);padding:4px 0}
  .telemetry-grid{grid-template-columns:1fr 1fr}
  .modal-grid{grid-template-columns:1fr}
}
</style></head><body>
<header>
  <div class="brand">
    <svg viewBox="0 0 24 24"><path d="M18.8 9.5C18.2 6.4 15.4 4 12 4 9.3 4 7 5.5 6 7.8 3.7 8.3 2 10.4 2 12.9c0 2.8 2.2 5.1 5 5.1h11.5c2.5 0 4.5-2 4.5-4.5 0-2.3-1.8-4.2-4.2-4z"/></svg>
    <span>CLOUDFLARE <b>AI GATEWAY</b></span>
  </div>
  <div style="display:flex;align-items:center;gap:12px">
    <button type="button" class="header-btn" id="btn-open-modal">☁️ CF 免費好物</button>
    <span class="sub">Auto Router 智慧路由流水線</span>
  </div>
</header>
<main>
  <div class="eyebrow">Cloudflare Zero Trust & AI Gateway</div>
  <h1>Auto Router 即時路由決策管線</h1>
  <p class="intro">觀察 Cloudflare Edge 邊緣分類器如何分析 Prompt，動態決策並路由至最佳 LLM 模型。支援即時免費容錯自動降級（Automatic Fallback）。</p>

  <div class="grid">
    <!-- Section 01 -->
    <section class="card">
      <div class="row">
        <h2>01 / 存取防護</h2>
        <span class="tag">Zero Trust Access</span>
      </div>
      <p class="hint">透過 Cloudflare Access RS256 JWT 驗證，僅授權使用者可存取此 Worker；Token 儲存於 Worker Secret，客戶端不洩漏任何憑據。</p>
      <div style="margin-top:12px;display:flex;align-items:center;gap:8px;font-size:13px;color:#047857;background:#ecfdf5;padding:8px 12px;border-radius:6px;border:1px solid #a7f3d0">
        <span class="pulsing-dot"></span> <b>Access JWT 驗證通過 · 安全連線中</b>
      </div>
    </section>

    <!-- Section 02 -->
    <section class="card">
      <div class="row">
        <h2>02 / 任務提交</h2>
        <span class="tag">cloudflare/auto</span>
      </div>
      <div class="samples">
        <button type="button" data-prompt="請用一句話解釋什麼是 DNS。">簡單問答</button>
        <button type="button" data-prompt="請用一句話解釋什麼是 DDoS。">資安概念</button>
        <button type="button" data-prompt="請比較邊緣運算 (Edge) 與傳統雲端伺服器的優缺點。">架構分析</button>
        <button type="button" data-prompt="請用 JavaScript 寫一個 debounce 函式，附上說明。">程式任務</button>
      </div>
      <label for="target-model">指定路由策略 / 模型</label>
      <select id="target-model">
        <option value="cloudflare/auto">cloudflare/auto (Auto Router 智慧路由 · 支援免費自動降級)</option>
        <option value="@cf/meta/llama-3.2-3b-instruct">@cf/meta/llama-3.2-3b-instruct (Meta 3.2 3B · 免費秒回)</option>
        <option value="@cf/meta/llama-3.2-1b-instruct">@cf/meta/llama-3.2-1b-instruct (Meta 3.2 1B · 極速輕量)</option>
        <option value="@cf/qwen/qwen3-30b-a3b-fp8">@cf/qwen/qwen3-30b-a3b-fp8 (Qwen 3 30B MoE · 中文開源)</option>
      </select>
      <label for="prompt">提問 Prompt</label>
      <textarea id="prompt" placeholder="輸入你想讓 AI 解決的任務…">請用一句話解釋什麼是 DNS。</textarea>
      <div style="margin-top:14px">
        <button class="primary" id="send">開始測試管線 →</button>
      </div>
    </section>

    <!-- Section 03: Hero Pipeline (方案 1) -->
    <section class="card wide" id="section-result">
      <div class="row" style="margin-bottom:12px">
        <h2>03 / 路由流水線 (Pipeline Visualizer)</h2>
        <span class="tag" id="status-tag">待命 (Standby)</span>
      </div>

      <div class="pipeline-box">
        <div class="pipeline-bar">
          <div style="display:flex;align-items:center;gap:10px">
            <span class="pulsing-dot" id="live-dot" style="background:#94a3b8"></span>
            <span style="font-size:12px;font-weight:800;letter-spacing:.08em;color:#475569">EDGE ROUTING PIPELINE</span>
          </div>
          <div class="status-pill pill-idle" id="pipeline-pill">READY</div>
        </div>

        <div class="pipeline-flow">
          <!-- Stage 1 -->
          <div class="pipe-step" id="step-prompt">
            <span class="step-num">STAGE 01</span>
            <strong class="step-title">任務請求</strong>
            <span class="step-badge" id="val-prompt-stat">待輸入</span>
          </div>

          <div class="pipe-arrow">▶</div>

          <!-- Stage 2 -->
          <div class="pipe-step" id="step-router">
            <span class="step-num">STAGE 02</span>
            <strong class="step-title">AI Gateway 決策</strong>
            <span class="step-badge" id="val-router-mode">cloudflare/auto</span>
          </div>

          <div class="pipe-arrow">▶</div>

          <!-- Stage 3 -->
          <div class="pipe-step" id="step-model">
            <span class="step-num">STAGE 03</span>
            <strong class="step-title">命中的推論模型</strong>
            <span class="step-badge" id="val-model-name">—</span>
          </div>

          <div class="pipe-arrow">▶</div>

          <!-- Stage 4 -->
          <div class="pipe-step" id="step-latency">
            <span class="step-num">STAGE 04</span>
            <strong class="step-title">邊緣往返耗時</strong>
            <span class="step-badge" id="val-latency">—</span>
          </div>
        </div>
      </div>

      <!-- Response Card -->
      <div class="response-box">
        <div class="response-head">
          <span>AI MODEL RESPONSE</span>
          <button type="button" class="btn-copy" id="btn-copy">📋 複製回答</button>
        </div>
        <div class="response-body" id="answer">送出提問後，此處將即時呈現模型生成內容。</div>
      </div>

      <!-- Telemetry Inspector -->
      <div class="telemetry-grid">
        <div class="tel-item"><small>實際模型 (Routed Model)</small><strong id="metric-model">—</strong></div>
        <div class="tel-item"><small>路由原因 (Routing Reason)</small><strong id="metric-reason">—</strong></div>
        <div class="tel-item"><small>耗時 (Edge Latency)</small><strong id="metric-time">—</strong></div>
        <div class="tel-item"><small>決策序號 (Decision ID)</small><strong id="metric-decision" style="font-family:monospace;font-size:11px">—</strong></div>
      </div>
    </section>
  </div>

  <p class="footer">Cloudflare AI Gateway · Auto Router Lab · <a href="https://developers.cloudflare.com/ai-gateway/features/routing/auto-router/" target="_blank" rel="noopener" style="color:var(--cf-orange);text-decoration:none">官方文件 ↗</a></p>

  <!-- Modal Popup: Cloudflare Free Ecosystem -->
  <div id="cf-modal" class="modal-overlay" style="display:none">
    <div class="modal-card">
      <button type="button" class="modal-close" id="modal-close">✕</button>
      <div class="modal-badge">CLOUDFLARE FREE TIER ECOSYSTEM</div>
      <h2 class="modal-title">☁️ 探索 Cloudflare 免費邊緣神器</h2>
      <p class="modal-subtitle">你知道嗎？本實驗室運行的所有核心架構，在 Cloudflare 上全部「永久免費」！</p>
      
      <div class="modal-grid">
        <div class="m-card">
          <div class="m-icon">🛡️</div>
          <div>
            <strong>Zero Trust Access</strong>
            <span class="m-tag">永久免費 50 位使用者</span>
            <p>企業級身分防護，免密碼 Email / GitHub 一鍵登入，徹底告別傳統 VPN。</p>
          </div>
        </div>

        <div class="m-card">
          <div class="m-icon">⚡</div>
          <div>
            <strong>Cloudflare Workers</strong>
            <span class="m-tag">每日 100,000 次免費請求</span>
            <p>全球 300+ 城市 0ms 冷啟動，本實驗室後端 API 就是跑在 Workers 上。</p>
          </div>
        </div>

        <div class="m-card">
          <div class="m-icon">🧠</div>
          <div>
            <strong>Workers AI & Gateway</strong>
            <span class="m-tag">每日 10,000 Neurons 免費算力</span>
            <p>免自建 GPU，0.5 秒直接在邊緣推論 Llama 3.2 等最新 AI 模型。</p>
          </div>
        </div>

        <div class="m-card">
          <div class="m-icon">💾</div>
          <div>
            <strong>R2 物件儲存 & D1 資料庫</strong>
            <span class="m-tag">0 出口流量費 (Zero Egress)</span>
            <p>每月 10GB 免費儲存 + 每日 500 萬次讀取，徹底告別雲端帳單刺客。</p>
          </div>
        </div>
      </div>

      <div class="modal-actions">
        <a href="https://dash.cloudflare.com/" target="_blank" rel="noopener" class="btn-cf-dash">前往 Cloudflare 探索 ↗</a>
        <button type="button" class="btn-cf-dismiss" id="modal-dismiss">我知道了，關閉</button>
      </div>
    </div>
  </div>
</main>

<script>
const $=id=>document.getElementById(id);
document.querySelectorAll('[data-prompt]').forEach(b=>b.onclick=()=>{$('prompt').value=b.dataset.prompt});

$('btn-copy').onclick=()=>{
  const text=$('answer').textContent;
  if(!text||text.includes('送出提問後'))return;
  navigator.clipboard.writeText(text);
  $('btn-copy').textContent='✓ 已複製！';
  setTimeout(()=>{$('btn-copy').textContent='📋 複製回答'},2000);
};

const openModal=()=>{$('cf-modal').style.display='flex'};
const closeModal=()=>{$('cf-modal').style.display='none'};
$('btn-open-modal').onclick=openModal;
$('modal-close').onclick=closeModal;
$('modal-dismiss').onclick=closeModal;
$('cf-modal').onclick=e=>{if(e.target===$('cf-modal'))closeModal()};

$('send').onclick=async()=>{
  const prompt=$('prompt').value.trim();
  if(!prompt){
    $('status-tag').textContent='請先輸入問題';
    $('answer').textContent='請輸入想提問的內容。';
    return;
  }
  const btn=$('send');
  btn.disabled=true;
  
  // Update Pipeline to Running state
  $('status-tag').textContent='路由處理中…';
  $('pipeline-pill').className='status-pill pill-running';
  $('pipeline-pill').textContent='ROUTING IN PROGRESS';
  $('live-dot').style.background='#f59e0b';
  $('step-prompt').className='pipe-step active';
  $('val-prompt-stat').textContent=prompt.length+' 字元 (已接收)';
  $('val-router-mode').textContent=$('target-model').value==='cloudflare/auto'?'Auto Router (智慧分析)':'Direct (指定模型)';
  $('val-model-name').textContent='匹配模型中…';
  $('val-latency').textContent='計時中…';
  ['metric-model','metric-reason','metric-time','metric-decision'].forEach(k=>$(k).textContent='—');
  $('answer').textContent='正在等待 Cloudflare AI Gateway 邊緣路由回應…';

  const start=performance.now();
  try{
    const res=await fetch('/api/test',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({prompt,model:$('target-model').value})
    });
    const data=await res.json();
    const duration=((performance.now()-start)/1000).toFixed(2);
    $('val-latency').textContent=duration+' 秒';
    $('metric-time').textContent=duration+' 秒';

    if(!res.ok)throw new Error(data.error||'請求失敗');

    // Success State
    $('status-tag').textContent='管線完成 (200 OK)';
    $('answer').textContent=data.answer||'已收到回應，但無文字內容。';
    
    const isFallback=data.model&&data.model.includes('(自動降級)');
    if(isFallback){
      $('pipeline-pill').className='status-pill pill-fallback';
      $('pipeline-pill').textContent='AUTO-FALLBACK ⚠️';
      $('step-model').className='pipe-step fallback';
      $('val-model-name').textContent='Llama 3.2 3B (降級保護)';
      $('live-dot').style.background='#ea580c';
    }else{
      $('pipeline-pill').className='status-pill pill-success';
      $('pipeline-pill').textContent='ROUTED ✓';
      $('step-model').className='pipe-step active';
      $('val-model-name').textContent=data.model?data.model.replace('@cf/',''):'未提供';
      $('live-dot').style.background='#10b981';
    }

    $('metric-model').textContent=data.model||'未提供';
    $('metric-reason').textContent=data.reason||'未提供';
    $('metric-decision').textContent=data.decision||'未提供';

    // 成功回傳後，平滑捲動至下方 03 / 路由流水線
    setTimeout(()=>{
      $('section-result')?.scrollIntoView({behavior:'smooth',block:'start'});
    },100);

    // 首次成功測試後，延遲 1.8 秒貼心彈出生態系好物 (不打擾第一眼看回答)
    if(!localStorage.getItem('cf_modal_seen')){
      setTimeout(()=>{
        openModal();
        localStorage.setItem('cf_modal_seen','true');
      },1800);
    }

  }catch(e){
    $('status-tag').textContent='處理失敗';
    $('pipeline-pill').className='status-pill pill-running';
    $('pipeline-pill').textContent='ERROR ✗';
    $('live-dot').style.background='#ef4444';
    $('answer').textContent=e.message+'\\n請檢查 Access、Worker Secret、Gateway 設定及模型計費。';
  }finally{
    btn.disabled=false;
  }
};
</script></body></html>`;

const decode = s => Uint8Array.from(atob(s.replace(/-/g,'+').replace(/_/g,'/').padEnd(Math.ceil(s.length/4)*4,'=')), c=>c.charCodeAt(0));
async function verifyAccess(request, env) {
  const team=env.CF_ACCESS_TEAM_DOMAIN, aud=env.CF_ACCESS_AUD;
  if (!team || !/^[a-z0-9-]+\.cloudflareaccess\.com$/i.test(team) || !aud) return false;
  const token=request.headers.get('Cf-Access-Jwt-Assertion'); if(!token || token.length>16000) return false;
  try {
    const parts=token.split('.'); if(parts.length!==3) return false;
    const h=JSON.parse(new TextDecoder().decode(decode(parts[0]))), p=JSON.parse(new TextDecoder().decode(decode(parts[1])));
    const now=Math.floor(Date.now()/1000);
    if(h.alg!=='RS256'||!h.kid||p.iss!=='https://'+team||!Array.isArray(p.aud)||!p.aud.includes(aud)||!Number.isFinite(p.exp)||p.exp<=now||(p.nbf&&p.nbf>now))return false;
    const response=await fetch('https://'+team+'/cdn-cgi/access/certs'); if(!response.ok)return false;
    const keys=await response.json(), jwk=keys.keys?.find(k=>k.kid===h.kid&&k.kty==='RSA');if(!jwk)return false;
    const key=await crypto.subtle.importKey('jwk',jwk,{name:'RSASSA-PKCS1-v1_5',hash:'SHA-256'},false,['verify']);
    return await crypto.subtle.verify('RSASSA-PKCS1-v1_5',key,decode(parts[2]),new TextEncoder().encode(parts[0]+'.'+parts[1]));
  } catch{return false}
}

export default {async fetch(request,env){
  if(!await verifyAccess(request,env))return new Response('需要有效的 Cloudflare Access 登入。請檢查 Access 設定。',{status:403,headers:{'cache-control':'no-store'}});
  const url=new URL(request.url);
  if(url.pathname==='/'&&request.method==='GET')return new Response(html,{headers:{'content-type':'text/html; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff','referrer-policy':'no-referrer','content-security-policy':"default-src 'self'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'"}});
  if(url.pathname!=='/api/test'||request.method!=='POST')return new Response('Not found',{status:404});
  if(request.headers.get('Origin')!==url.origin)return Response.json({error:'來源不符'}, {status:403});
  try {
    if(!/^[a-f0-9]{32}$/i.test(env.CLOUDFLARE_ACCOUNT_ID||'')||!/^[a-zA-Z0-9_-]{1,100}$/.test(env.CLOUDFLARE_GATEWAY_ID||'')||!env.CLOUDFLARE_API_TOKEN)return Response.json({error:'Worker 尚未完成 Gateway 或 Token 設定。'},{status:500});
    const data=await request.json();if(typeof data.prompt!=='string'||!data.prompt.trim()||data.prompt.length>12000)return Response.json({error:'問題長度不正確。'},{status:400});
    const targetModel=(typeof data.model==='string'&&data.model.trim())?data.model.trim():'cloudflare/auto';
    let r=await fetch('https://gateway.ai.cloudflare.com/v1/'+env.CLOUDFLARE_ACCOUNT_ID+'/'+env.CLOUDFLARE_GATEWAY_ID+'/compat/chat/completions',{method:'POST',headers:{'content-type':'application/json','cf-aig-authorization':'Bearer '+env.CLOUDFLARE_API_TOKEN,'authorization':'Bearer '+env.CLOUDFLARE_API_TOKEN},body:JSON.stringify({model:targetModel,messages:[{role:'user',content:data.prompt}]})});
    let j;try{j=await r.json()}catch{return Response.json({error:'Cloudflare 回應無法解析（HTTP '+r.status+'）。'},{status:502})}
    let isFallback=false,fallbackReason='';
    if(!r.ok&&targetModel==='cloudflare/auto'&&r.status===403){
      const errMsg=j?.error?.message||'';
      if(errMsg.includes('not allowed to access')||errMsg.includes('kimi-k3')||errMsg.includes('denied')){
        const fallbackModel='@cf/meta/llama-3.2-3b-instruct';
        const r2=await fetch('https://gateway.ai.cloudflare.com/v1/'+env.CLOUDFLARE_ACCOUNT_ID+'/'+env.CLOUDFLARE_GATEWAY_ID+'/compat/chat/completions',{method:'POST',headers:{'content-type':'application/json','cf-aig-authorization':'Bearer '+env.CLOUDFLARE_API_TOKEN,'authorization':'Bearer '+env.CLOUDFLARE_API_TOKEN},body:JSON.stringify({model:fallbackModel,messages:[{role:'user',content:data.prompt}]})});
        try{const j2=await r2.json();if(r2.ok){r=r2;j=j2;isFallback=true;fallbackReason='Auto Router 挑中旗艦付費模型 (Kimi K3)，已自動為您降級至免費的 Llama 3.2 順利回答！';}}catch{}
      }
    }
    if(!r.ok){const detail=j?.error?.message||j?.errors?.[0]?.message||(typeof j==='object'?JSON.stringify(j):'');return Response.json({error:'Cloudflare 回傳 HTTP '+r.status+(detail?'：'+detail:'')},{status:502});}
    return Response.json({answer:j.choices?.[0]?.message?.content,model:isFallback?'@cf/meta/llama-3.2-3b-instruct (自動降級)':(r.headers.get('cf-aig-routed-model')||targetModel),reason:isFallback?fallbackReason:r.headers.get('cf-aig-routing-reason'),decision:r.headers.get('cf-aig-routing-decision-id')},{headers:{'cache-control':'no-store'}});
  }catch{return Response.json({error:'連線失敗，請稍後再試。'},{status:502})}
}};
