/**
 * Cloudflare Worker 入口與 HTTP 路由派發器
 */

import { verifyAccess } from './auth.js';
import { dispatchPrompt } from './gateway.js';
import { renderHtml } from './ui/html.js';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (!await verifyAccess(request, env)) {
      if (url.pathname.startsWith('/api/')) {
        return Response.json(
          { error: { code: 'AUTH_REQUIRED', message: '需要有效的 Cloudflare Access 登入。' } },
          { status: 403, headers: { 'cache-control': 'no-store' } }
        );
      }
      return new Response(
        '<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><title>需要 Cloudflare Access 登入</title></head><body style="font-family:sans-serif;padding:40px;text-align:center"><h2>🔒 需要有效的 Cloudflare Access 登入</h2><p>請檢查 Cloudflare Access 權限與憑據配置。</p></body></html>',
        { status: 403, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' } }
      );
    }

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

    return Response.json(
      { error: { code: 'NOT_FOUND', message: '找不到此端點 (Not Found)。' } },
      { status: 404 }
    );
  }
};
