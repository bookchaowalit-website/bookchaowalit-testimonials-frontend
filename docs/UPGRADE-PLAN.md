# Upgrade plan

## Current state

Score: 7/10 (was 5/10) — full local CRUD with featured ordering, validated storage, tests and CI; no public embed yet.

## Backlog

- P1: "Copy embed" output (HTML/JSON of featured quotes) so the curated set can be reused on a site.
- P1: Edit quote text in place.
- P2: Playwright smoke test for add / re-state / remove.
- P2: Correct `public/sitemap.xml` host.

## Done in this pass

- CI (`.github/workflows/ci.yml`): `npm ci`, lint, typecheck, vitest, `next build` on every push and PR.
- `/api/mcp` uses a typed JSON-RPC handler (`lib/mcp.ts`, tested) with proper error codes and an honest `get_app_info` tool; this fixed the template's lint errors.
- `/more-projects` renders from `lib/related-projects.ts` (was ~980 lines of unrolled links plus an unused data copy) and no longer links to itself; removed the stale `app/page.tsx.backup`.
- Quote rules moved to `lib/testimonials.ts` (tested): featured-first ordering, trimming/length limits, stored-data validation; hydration via `lib/use-stored-state.ts` fixes the set-state-in-effect lint error.
- Each proof's state can now be changed (the README's CRUD claim lacked update); the add tray is a real form with required fields and an announced status message.
