# Upgrade plan

## Current state

Score: 8/10 (was 7/10) — full local CRUD with featured ordering, validated storage, tests and CI, copyable static embed of featured quotes; no in-place editing yet.

## Backlog

- P1: Edit quote text in place.
- P2: Playwright smoke test for add / re-state / remove.

## Done in this pass

- CI (`.github/workflows/ci.yml`): `npm ci`, lint, typecheck, vitest, `next build` on every push and PR.
- `/api/mcp` uses a typed JSON-RPC handler (`lib/mcp.ts`, tested) with proper error codes and an honest `get_app_info` tool; this fixed the template's lint errors.
- `/more-projects` renders from `lib/related-projects.ts` (was ~980 lines of unrolled links plus an unused data copy) and no longer links to itself; removed the stale `app/page.tsx.backup`.
- Quote rules moved to `lib/testimonials.ts` (tested): featured-first ordering, trimming/length limits, stored-data validation; hydration via `lib/use-stored-state.ts` fixes the set-state-in-effect lint error.
- Each proof's state can now be changed (the README's CRUD claim lacked update); the add tray is a real form with required fields and an announced status message.

## Done in this pass (pass 2)

- Canonical host is config-driven: `lib/site.ts` resolves `NEXT_PUBLIC_SITE_URL` (validated, clear error on a non-http(s) value) and feeds `metadataBase`, generated `app/sitemap.ts` / `app/robots.ts` and the MCP `get_app_info` URL; removed the stale template `public/sitemap.xml` / `robots.txt` (they pointed at `bookchaowalit.com` and a `*.vercel.app` name that differs from the project URL). Tested in `lib/site.test.ts`.
- "Embed the featured quotes": static, HTML-escaped `<figure>` markup of every Featured proof in display order (`featuredEmbedHtml` in `lib/testimonials.ts`, tested incl. script-injection escaping), shown read-only with a Copy button and a visible status line.
