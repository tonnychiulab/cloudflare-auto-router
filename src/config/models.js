/**
 * Cloudflare Workers AI & Auto Router 模型設定檔
 */

export const DEFAULT_FALLBACK_MODEL = '@cf/meta/llama-3.2-3b-instruct';

export const SUPPORTED_MODELS = [
  {
    id: '@cf/meta/llama-3.2-3b-instruct',
    name: 'Meta Llama 3.2 3B',
    badge: '推薦 / 免費',
    tier: 'free',
    isFallbackDefault: true,
    desc: '繁中能力優良、0.5秒秒回的官方標準模型'
  },
  {
    id: '@cf/meta/llama-3.2-1b-instruct',
    name: 'Meta Llama 3.2 1B',
    badge: '極速 / 免費',
    tier: 'free',
    desc: '極度輕量、超低延遲的邊緣推論模型'
  },
  {
    id: '@cf/qwen/qwen3-30b-a3b-fp8',
    name: 'Qwen 3 30B MoE',
    badge: '中文旗艦 / 免費',
    tier: 'free',
    desc: '阿里通義千問最新 MoE 繁中與代碼頂級模型'
  },
  {
    id: 'cloudflare/auto',
    name: 'cloudflare/auto (Auto Router)',
    badge: '智慧路由 · 免費自動降級',
    tier: 'hybrid',
    isAutoRouter: true,
    desc: 'Cloudflare 邊緣分類器動態分流；若挑中付費模型自動降級至免費保護'
  }
];
