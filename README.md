# Testimonials

Collect and feature quotes.

## Features
- Add, re-state (Featured / Review / Archive) and remove quotes
- Featured quotes sort first; search by author, quote or state
- localStorage persistence (validated on load)

## Limitations
- Local only

## Run
```bash
npm install
npm run dev
```

## Honesty
Portfolio demo. Not multi-tenant SaaS. Prefer local-only state over fake production claims.

## Checks

```bash
npm ci
npm run lint
npm run typecheck
npm test
npm run build
```

CI runs the same checks on every push (`.github/workflows/ci.yml`).

## Configuration

- `NEXT_PUBLIC_SITE_URL` (optional): canonical origin used for metadata, `/sitemap.xml`, `/robots.txt` and the MCP app info. Defaults to `https://bookchaowalit-testimonials-frontend.vercel.app`; must be an absolute http(s) URL.
