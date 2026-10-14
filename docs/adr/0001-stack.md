# ADR-0001 — Default stack, hosting and observability

Status: Proposed
Date: [YYYY-MM-DD]
Deciders: [you]
Supersedes: none

## Context
Portfolio projects (3–5) built by one person with Claude Code. Needs: one language end to end so prompts, rules and gates are reused across projects; real staging and production environments; low monthly cost; mainstream tools a hiring manager recognises; strong typing so generated code is checked by the compiler, not just by review.

## Options considered
1. **TypeScript everywhere (Next.js + Node), Postgres, containers** — one language, huge ecosystem, strong types, first-class Playwright. Cons: Next.js complexity for API-heavy services.
2. **Python (FastAPI) backend + React front end** — great for ML-heavy work. Cons: two languages, two toolchains, double the rules and gates.
3. **Serverless-only (Vercel + managed DB)** — fastest start. Cons: less to show about containers, environments and deploy gates; vendor lock-in.

## Decision
Option 1, with these defaults (each can be overridden per project by a new ADR):

| Concern | Choice |
|---|---|
| Language / runtime | TypeScript (strict), Node 22 LTS, pnpm |
| Web app | Next.js (App Router), Tailwind v4 themed from `design/tokens.json` |
| Validation | Zod at every boundary |
| Database | PostgreSQL 16, Drizzle ORM + generated migrations |
| LLM access | Provider SDKs behind `src/agents/` interfaces; prompts as versioned files |
| Unit / integration tests | Vitest (+ Testcontainers for Postgres) |
| E2E + visual tests | Playwright |
| AI evals | Vitest-based eval runner, fixed datasets, cross-provider judge |
| Lint / format | ESLint (typescript-eslint strict, jsx-a11y), Prettier |
| CI/CD | GitHub Actions; image in GitHub Container Registry |
| Hosting | Fly.io: `<app>-staging` and `<app>-prod` apps, managed Postgres per env |
| Logs / traces / metrics | pino JSON logs + OpenTelemetry → Grafana Cloud (free tier) |
| Errors | Sentry (free tier), tagged with release SHA |
| Security scanning | `pnpm audit`, Gitleaks, CodeQL, Dependabot |

## Consequences
- Positive: one set of rules, prompts and pipeline for every project; production-like environments for a few dollars a month.
- Negative: Fly.io and Grafana Cloud accounts to set up; Next.js upgrade churn.
- Follow-ups: per-project ADR if a project needs Python (e.g. ML) or a different host (AWS/Kubernetes to show enterprise deployment).
