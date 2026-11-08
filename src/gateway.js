/**
 * Cloudflare AI Gateway 調度與自動降級防護模組
 */

import { DEFAULT_FALLBACK_MODEL } from './config/models.js';

export async function dispatchPrompt(prompt, requestedModel, env) {
  const accountId = env.CLOUDFLARE_ACCOUNT_ID;
  const gatewayId = env.CLOUDFLARE_GATEWAY_ID;
  const apiToken = env.CLOUDFLARE_API_TOKEN;

  if (
    !/^[a-f0-9]{32}$/i.test(accountId || '') ||
    !/^[a-zA-Z0-9_-]{1,100}$/.test(gatewayId || '') ||
    !apiToken
  ) {
    throw { code: 'CONFIG_INCOMPLETE', message: 'Worker 尚未完成 Gateway 或 Token 設定。', status: 500 };
  }

  const targetModel = (typeof requestedModel === 'string' && requestedModel.trim())
    ? requestedModel.trim()
    : 'cloudflare/auto';

  const gatewayUrl = `https://gateway.ai.cloudflare.com/v1/${accountId}/${gatewayId}/compat/chat/completions`;
  const headers = {
    'content-type': 'application/json',
    'cf-aig-authorization': 'Bearer ' + apiToken,
    'authorization': 'Bearer ' + apiToken
  };

  // 初次向指定模型發起請求
  let r = await fetch(gatewayUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: targetModel,
      messages: [{ role: 'user', content: prompt }]
    })
  });

  let j;
  try {
    j = await r.json();
  } catch {
    throw { code: 'UPSTREAM_PARSE_FAILED', message: `Cloudflare 回應無法解析 (HTTP ${r.status})`, status: 502 };
  }

  let isFallback = false;
  let fallbackReason = '';

  // 智慧降級容錯邏輯：若 auto 挑中付費旗艦模型遭拒 (403)，自動降級至免費繁中模型
  if (!r.ok && targetModel === 'cloudflare/auto' && r.status === 403) {
    const errMsg = j?.error?.message || '';
    if (
      errMsg.includes('not allowed to access') ||
      errMsg.includes('kimi-k3') ||
      errMsg.includes('denied')
    ) {
      const fallbackTarget = env.DEFAULT_FALLBACK_MODEL || DEFAULT_FALLBACK_MODEL;
      const r2 = await fetch(gatewayUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model: fallbackTarget,
          messages: [{ role: 'user', content: prompt }]
        })
      });

      try {
        const j2 = await r2.json();
        if (r2.ok) {
          r = r2;
          j = j2;
          isFallback = true;
          fallbackReason = 'Auto Router 挑中旗艦付費模型 (Kimi K3)，已自動為您降級至免費的 Llama 3.2 順利回答！';
        }
      } catch {
        // 若降級請求異常，保留原錯誤處理
      }
    }
  }

  if (!r.ok) {
    const detail = j?.error?.message || j?.errors?.[0]?.message || (typeof j === 'object' ? JSON.stringify(j) : '');
    throw {
      code: 'GATEWAY_ERROR',
      message: `Cloudflare 回傳 HTTP ${r.status}${detail ? '：' + detail : ''}`,
      status: 502,
      raw: j
    };
  }

  return {
    answer: j.choices?.[0]?.message?.content || '',
    model: isFallback ? `${DEFAULT_FALLBACK_MODEL} (自動降級)` : (r.headers.get('cf-aig-routed-model') || targetModel),
    reason: isFallback ? fallbackReason : r.headers.get('cf-aig-routing-reason'),
    decision: r.headers.get('cf-aig-routing-decision-id'),
    isFallback
  };
}
