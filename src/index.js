/**
 * Cloudflare Worker 入口與 HTTP 路由派發器
 */

import { verifyAccess } from './auth.js';
import { dispatchPrompt } from './gateway.js';
import { renderHtml } from './ui/html.js';

export default {
  async fetch(request, env) {
    if (!await verifyAccess(request, env)) {
      return new Response('需要有效的 Cloudflare Access 登入。', {
        status: 403,
        headers: { 'cache-control': 'no-store' }
      });
    }

    const url = new URL(request.url);

    if (url.pathname === '/' && request.method === 'GET') {
      return new Response(renderHtml(), {
        headers: {
          'content-type': 'text/html; charset=utf-8',
          'cache-control': 'no-store',
          'x-content-type-options': 'nosniff',
          'referrer-policy': 'no-referrer',
          'content-security-policy': "default-src 'self'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'"
        }
      });
    }

    if (url.pathname === '/api/test' && request.method === 'POST') {
      if (request.headers.get('Origin') !== url.origin) {
        return Response.json({ error: { code: 'ORIGIN_MISMATCH', message: '來源檢查不符' } }, { status: 403 });
      }

      try {
        const data = await request.json();
        if (typeof data.prompt !== 'string' || !data.prompt.trim() || data.prompt.length > 12000) {
          return Response.json({ error: { code: 'INVALID_PROMPT', message: '問題長度不正確' } }, { status: 400 });
        }

        const result = await dispatchPrompt(data.prompt, data.model, env);
        return Response.json(result, { headers: { 'cache-control': 'no-store' } });
      } catch (err) {
        const status = err.status || 500;
        const code = err.code || 'INTERNAL_ERROR';
        const message = err.message || '連線失敗，請稍後再試。';
        return Response.json({ error: { code, message, details: err.raw } }, { status });
      }
    }

    return new Response('Not found', { status: 404 });
  }
};
