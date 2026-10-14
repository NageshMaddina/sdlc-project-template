# Test strategy

Status: Draft
Owner: [you]

## Principles
1. **Requirements drive tests.** Every acceptance criterion has at least one automated test named with its ID; the pipeline enforces it.
2. **Test at the lowest level that can prove the behaviour.** Logic → unit; wiring → integration; user journeys → e2e; appearance → visual; LLM behaviour → evals.
3. **Fast feedback first.** Local: unit + typecheck on every Claude turn (Stop hook). PR: the full suite. Production: synthetic checks and SLO alerts.
4. **No flaky tests.** A flaky test is a bug with a BUG-### and an owner, never an ignored red.
5. **AI is tested like any other dependency** — with fixed datasets, measurable scores, thresholds, and a judge from a different provider than the generator.

## Pyramid and tooling

| Level | Tool | Location | Runs | Target |
|---|---|---|---|---|
| Static | TypeScript, ESLint (+ jsx-a11y), Prettier | everywhere | every edit (hook), PR | zero errors, zero warnings |
| Unit | Vitest | `src/**/*.test.ts` | every Claude turn, PR | ≥ 80 % lines and branches |
| Integration | Vitest + Testcontainers (Postgres) | `tests/integration/` | PR | every endpoint: happy + main error paths |
| Contract | Zod schemas shared by API and tests | `src/**/schema.ts` | PR | every response validated in integration tests |
| E2E | Playwright | `tests/e2e/` | PR, post-deploy smoke | every story's main journey |
| Accessibility | @axe-core/playwright | inside e2e | PR | zero serious/critical violations |
| Visual | Playwright screenshots | `tests/visual/` | PR | every ★ state in design specs |
| AI evals | Vitest eval runner | `tests/evals/` | PR (label `evals`) + nightly | per-eval threshold (e.g. fabrication rate 0 %, groundedness ≥ 0.9) |
| Performance | k6 (when NFRs demand) | `tests/perf/` | nightly / pre-release | NFR targets |
| Security | pnpm audit, Gitleaks, CodeQL | CI | PR + weekly | no high/critical |
| Synthetic | GitHub Actions cron | `.github/workflows/synthetic.yml` | every 15 min in prod | 2 consecutive failures → issue |

## Quality gates (summary — authoritative list in docs/sdlc/PLAYBOOK.md)
PR cannot merge unless static, unit + coverage, traceability, security, build, e2e and visual are green. Production deploy needs green staging smoke tests plus human approval.

## Test data
- Factories in `tests/factories/` produce obviously fake data.
- Eval datasets in `tests/evals/data/` are versioned; changing them needs a CHG with a reason.
- No production data in any test environment.

## Metrics we report (per release)
Escaped defects, change failure rate, mean time to restore, lead time for changes, deployment frequency (DORA); flaky test count; AC coverage %; eval scores trend.
