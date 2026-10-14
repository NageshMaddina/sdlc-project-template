---
description: One-time setup — scaffold the application stack from the accepted ADR-0001 so every gate in the pipeline can run. Use once per new project under CHG-000.
disable-model-invocation: true
argument-hint: "(no arguments)"
---

# /bootstrap — make the empty template a running, gated project

Preconditions (stop and tell the user if any fails):
- `docs/adr/0001-stack.md` is `Status: Accepted`/Approved.
- Branch is `chore/CHG-000-bootstrap` and `docs/plans/CHG-000.md` is Approved (the plan in `docs/requirements/changes/CHG-000.md` describes this work).

Then build exactly what CHG-000's plan lists. The target end state:
1. `package.json` scripts with these exact names (the hooks, CI and docs use them):
   `dev`, `build`, `start`, `lint`, `format`, `format:check`, `typecheck`, `test:unit`, `test:coverage`, `test:e2e`, `test:visual`, `test:evals`, `traceability`, `verify`, `db:generate`, `db:migrate`, `design:tokens`.
   `verify` = `format:check && lint && typecheck && test:coverage && traceability`.
2. Next.js (App Router, TypeScript strict), Tailwind v4 theme generated from `design/tokens.json` by `scripts/build-tokens.mjs` → `src/design/tokens.css`.
3. `src/lib/env.ts` (Zod-validated env), `src/lib/logger.ts` (pino, redaction of secret fields), `src/instrumentation.ts` (OpenTelemetry), error tracker init, `/api/healthz` and `/api/readyz`.
4. Drizzle + Postgres with an empty first migration; `docker-compose.yml` for local Postgres.
5. Vitest with coverage thresholds 80 % lines/branches; Playwright projects `e2e` and `visual`; `tests/evals/` runner skeleton; one example test per layer named `AC-000.1 …` mapping to CHG-000's ACs.
6. ESLint (typescript-eslint strict, jsx-a11y), Prettier, `Dockerfile` (multi-stage, non-root user, healthcheck).
7. Every dependency is listed in the plan; the user approves each `pnpm add`.
8. Finish with `pnpm verify && pnpm build && pnpm test:e2e` green and report.

Do not touch `.github/workflows/` (protected); if the scripts above exist with these names, the shipped pipeline works unchanged.
