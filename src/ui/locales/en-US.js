/**
 * English Locale Dictionary (en-US)
 */
export const enUS = {
  browserTitle: 'Cloudflare Auto Router Lab | Smart AI Routing Pipeline',
  headerTitle: 'CLOUDFLARE <b>AI GATEWAY</b>',
  headerSub: 'Auto Router Smart Routing Pipeline',
  cfFreeBtn: '☁️ Free Ecosystem',
  eyebrow: 'Cloudflare Zero Trust & AI Gateway',
  pageTitle: 'Auto Router Smart Routing Pipeline',
  pageIntro: 'Observe how Cloudflare Edge classifier analyzes prompts and dynamically routes to the optimal LLM. Features instant automatic fallback protection.',

  quotaTitle: 'Cloudflare Edge Free Tier Quota Dashboard',
  quotaBadge: '100% Free Forever · Zero Egress Fees',
  q1Label: 'Daily Free AI Compute',
  q1Chip: 'Workers AI',
  q1Sub: 'Equivalent to ~700 - 1,200 free LLM completions/day',
  q2Label: 'Daily Worker Requests',
  q2Chip: 'Cloudflare Workers',
  q3Label: 'Single Task Specs & Cost',
  q3Chip: 'Zero Egress',
  q3Unit: 'Free / run',
  q3Spec1: '12,000 Chars Max',
  q3Spec2: '0ms Cold Start',
  q3Spec3: 'Serverless GPUs',
  q3Sub: 'Inference across 300+ cities with zero egress bills',

  sec1Title: '01 / Access Security',
  sec1Tag: 'Zero Trust Access',
  sec1Desc: 'Protected by Cloudflare Access RS256 JWT validation. Only authorized users can access. API tokens remain secure in Worker Secrets.',
  sec1Status: 'Access JWT Verified · Connection Secure',

  sec2Title: '02 / Submit Task',
  samples: {
    q1: 'Quick Q&A',
    q2: 'Security Concept',
    q3: 'Architecture',
    q4: 'Code Task'
  },
  modelLabel: 'Routing Policy / Model Selection',
  promptLabel: 'User Prompt',
  promptPlaceholder: 'Enter any task or question for the AI…',
  btnSubmit: 'Run Pipeline →',
  btnRunning: 'Routing in progress…',

  sec3Title: '03 / Pipeline Visualizer',
  statusStandby: 'Standby',
  statusRunning: 'Routing in progress…',
  statusComplete: 'Pipeline Completed (200 OK)',
  statusError: 'Execution Failed',
  fallbackBadge: ' (Auto-Fallback)',

  p1Title: 'Task Ingestion',
  p1Idle: 'Awaiting Input',
  p2Title: 'Gateway Decision',
  p2Auto: 'Auto Router (Smart)',
  p2Direct: 'Direct Dispatch',
  p3Title: 'Selected Inference Model',
  p4Title: 'Edge Latency',

  responseTitle: 'AI MODEL RESPONSE',
  btnCopy: '📋 Copy Answer',
  btnCopied: '✓ Copied!',
  waitResponse: 'Submit a prompt to view the real-time model output here.',

  telModel: 'Routed Model',
  telReason: 'Routing Reason',
  telLatency: 'Edge Latency',
  telDecision: 'Decision ID',

  modalBadge: 'CLOUDFLARE FREE TIER ECOSYSTEM',
  modalTitle: '☁️ Explore Cloudflare Free Superpowers',
  modalSubtitle: 'Did you know? Every single infrastructure component in this lab runs on Cloudflare completely free!',
  m1Title: 'Zero Trust Access',
  m1Tag: 'Free up to 50 Users Forever',
  m1Desc: 'Enterprise identity security without VPNs. Passwordless email or GitHub single-sign-on.',
  m2Title: 'Cloudflare Workers',
  m2Tag: '100,000 Free Requests / Day',
  m2Desc: 'Serverless execution across 300+ cities with 0ms cold starts.',
  m3Title: 'Workers AI & Gateway',
  m3Tag: '10,000 Free Neurons / Day',
  m3Desc: 'Serverless GPU inference for Llama 3.2 and more in 0.5s without hardware setup.',
  m4Title: 'R2 Storage & D1 Database',
  m4Tag: 'Zero Egress Fees',
  m4Desc: '10GB free storage and 5M reads/day with no bandwidth bills.',
  btnExplore: 'Explore Cloudflare ↗',
  btnDismiss: 'Got it, Close',

  errors: {
    CONFIG_INCOMPLETE: 'Worker is missing Gateway or Token configuration.',
    INVALID_PROMPT: 'Prompt length is invalid.',
    ORIGIN_MISMATCH: 'Origin check mismatch.',
    AUTH_REQUIRED: 'Valid Cloudflare Access login is required.',
    GATEWAY_ERROR: 'Cloudflare AI Gateway encountered an error. Please try again.',
    UPSTREAM_PARSE_FAILED: 'Failed to parse upstream AI Gateway response.',
    NOT_FOUND: 'Requested API route was not found.',
    INTERNAL_ERROR: 'An unexpected internal error occurred.'
  }
};
