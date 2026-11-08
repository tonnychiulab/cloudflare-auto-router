/**
 * Cloudflare Access RS256 JWT 身分驗證模組
 */

const decode = s => Uint8Array.from(
  atob(s.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(s.length / 4) * 4, '=')),
  c => c.charCodeAt(0)
);

export async function verifyAccess(request, env) {
  const team = env.CF_ACCESS_TEAM_DOMAIN;
  const aud = env.CF_ACCESS_AUD;

  if (!team || !/^[a-z0-9-]+\.cloudflareaccess\.com$/i.test(team) || !aud) {
    return false;
  }

  const token = request.headers.get('Cf-Access-Jwt-Assertion');
  if (!token || token.length > 16000) {
    return false;
  }

  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;

    const h = JSON.parse(new TextDecoder().decode(decode(parts[0])));
    const p = JSON.parse(new TextDecoder().decode(decode(parts[1])));
    const now = Math.floor(Date.now() / 1000);

    // 驗證演算法、簽發者、Audience、過期時間
    if (
      h.alg !== 'RS256' ||
      !h.kid ||
      p.iss !== 'https://' + team ||
      !Array.isArray(p.aud) ||
      !p.aud.includes(aud) ||
      !Number.isFinite(p.exp) ||
      p.exp <= now ||
      (p.nbf && p.nbf > now)
    ) {
      return false;
    }

    // 取得 Cloudflare 公鑰證書
    const response = await fetch('https://' + team + '/cdn-cgi/access/certs');
    if (!response.ok) return false;

    const keys = await response.json();
    const jwk = keys.keys?.find(k => k.kid === h.kid && k.kty === 'RSA');
    if (!jwk) return false;

    const key = await crypto.subtle.importKey(
      'jwk',
      jwk,
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false,
      ['verify']
    );

    return await crypto.subtle.verify(
      'RSASSA-PKCS1-v1_5',
      key,
      decode(parts[2]),
      new TextEncoder().encode(parts[0] + '.' + parts[1])
    );
  } catch {
    return false;
  }
}
