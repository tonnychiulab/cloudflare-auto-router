# Frontend Standards

## Browser Experience & Terminology Standards

Every frontend or HTML change in this repository must satisfy the following checklist before merging:

1. **Favicon**:
   - `<link rel="icon" type="image/svg+xml" href="...">` must be present in `<head>`.
   - Uses embedded Cloudflare Orange (`#F6821F`) SVG Data URI for instant loading without external assets.
   - Verified in both browser tab and bookmark modal.

2. **Browser Title & i18n Synchronization**:
   - `<title>` is defined as `Cloudflare Auto Router 實驗室｜AI 智慧路由流水線` (zh-TW) and `Cloudflare Auto Router Lab | Smart AI Routing Pipeline` (en-US).
   - Dynamic `document.title` update is wired inside `applyLocale()`.

3. **Terminology Consistency**:
   - All references to "Pipeline" must strictly use **「流水線」** across the codebase and UI:
     - Header: `Auto Router 智慧路由流水線`
     - Main H1: `Auto Router 智慧路由流水線`
     - Submit Button: `開始測試流水線 →`
     - Status: `流水線完成 (200 OK)`
     - Section 03: `03 / 路由流水線 (Pipeline Visualizer)`
