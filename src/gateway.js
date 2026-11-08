/**
 * Cloudflare AI Gateway 調度與自動降級防護模組
 */

import { DEFAULT_FALLBACK_MODEL, SUPPORTED_MODELS } from './config/models.js';

/**
 * 封裝向 Cloudflare AI Gateway 發送 chat completions 請求
 */
async function callGateway(gatewayUrl, headers, model, prompt) {
  const response = await fetch(gatewayUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }]
    })
  });

  let data;
  try {
    data = await response.json();
  } catch {
    throw {
      code: 'UPSTREAM_PARSE_FAILED',
      message: `Cloudflare 回應無法解析 (HTTP ${response.status})`,
      status: 502
    };
  }

  return { response, data };
}

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

  // SEC-01: 嚴格白名單比對，防止透過未受支援模型消耗其他付費 Provider 額度
  const isAllowedModel = typeof requestedModel === 'string' &&
    SUPPORTED_MODELS.some(m => m.id === requestedModel.trim());
  const targetModel = isAllowedModel ? requestedModel.trim() : 'cloudflare/auto';

  const gatewayUrl = `https://gateway.ai.cloudflare.com/v1/${accountId}/${gatewayId}/compat/chat/completions`;
  const headers = {
    'content-type': 'application/json',
    'cf-aig-authorization': 'Bearer ' + apiToken,
    'authorization': 'Bearer ' + apiToken
  };

  // 初次向指定模型發起請求
  let { response: currentRes, data: currentData } = await callGateway(gatewayUrl, headers, targetModel, prompt);

  let isFallback = false;
  let fallbackReason = '';
  const fallbackModel = env.DEFAULT_FALLBACK_MODEL || DEFAULT_FALLBACK_MODEL;

  // 智慧降級容錯邏輯：若 auto 挑中付費旗艦模型遭拒 (403)，自動降級至免費受支援模型
  if (!currentRes.ok && targetModel === 'cloudflare/auto' && currentRes.status === 403) {
    const errorText = [
      currentData?.error?.message,
      currentData?.errors?.[0]?.message,
      typeof currentData?.error === 'string' ? currentData.error : '',
      JSON.stringify(currentData || '')
    ].join(' ').toLowerCase();

    if (
      errorText.includes('not allowed to access') ||
      errorText.includes('kimi-k3') ||
      errorText.includes('denied') ||
      errorText.includes('aierror')
    ) {
      try {
        const { response: fallbackRes, data: fallbackData } = await callGateway(gatewayUrl, headers, fallbackModel, prompt);
        if (fallbackRes.ok) {
          currentRes = fallbackRes;
          currentData = fallbackData;
          isFallback = true;
          fallbackReason = `Auto Router 挑中旗艦付費模型 (Kimi K3)，已自動為您降級至免費模型 (${fallbackModel}) 順利回答！`;
        }
      } catch {
        // 若降級請求異常，保留原錯誤處理流程
      }
    }
  }

  if (!currentRes.ok) {
    const detail = currentData?.error?.message || currentData?.errors?.[0]?.message || '';
    throw {
      code: 'GATEWAY_ERROR',
      message: `Cloudflare 回傳 HTTP ${currentRes.status}${detail ? '：' + detail : ''}`,
      status: 502,
      details: detail || undefined
    };
  }

  return {
    answer: currentData.choices?.[0]?.message?.content || '',
    model: isFallback ? fallbackModel : (currentRes.headers.get('cf-aig-routed-model') || targetModel),
    reason: isFallback ? fallbackReason : currentRes.headers.get('cf-aig-routing-reason'),
    decision: currentRes.headers.get('cf-aig-routing-decision-id'),
    isFallback
  };
}
