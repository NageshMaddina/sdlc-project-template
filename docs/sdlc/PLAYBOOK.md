# SDLC playbook

How every project built from this template moves from idea to production, and how
Claude is kept inside that process. This file is the source of truth; `CLAUDE.md`,
`.claude/rules/`, the skills and the hooks all implement what is written here.

## The control contract (one paragraph)

Humans decide **what** and **whether**; Claude does the **how**, inside guardrails.
Nothing is built without an approved requirement, nothing is coded without an approved
plan, nothing merges without passing every pipeline gate and a human review, and nothing
reaches production except through the pipeline with a human approval. Every artifact
carries an ID, so any line of code can be traced back to the requirement that asked for it.

## IDs and traceability

| ID | Artifact | Lives in | Example |
|---|---|---|---|
| `REQ-###` | Requirement (the need) | `docs/requirements/PRD.md` | REQ-004 Resume tailoring |
| `US-###` | User story | `docs/requirements/stories/US-###.md` | US-012 Tailor bullets to a job |
| `AC-###.#` | Acceptance criterion (story number . criterion) | inside the story | AC-012.3 Untraceable bullets are flagged |
| `ADR-####` | Architecture decision | `docs/adr/` | ADR-0003 Use Postgres |
| `CHG-###` | Change request / chore / infra work | `docs/requirements/changes/` | CHG-000 Bootstrap the stack |
| `BUG-###` | Defect | GitHub issue + `docs/plans/BUG-###.md` | BUG-021 Score shows NaN |

Rules:
- Every test that proves an acceptance criterion has the AC ID in its name:
  `test('AC-012.3 flags a bullet with no evidence', …)`.
- The pipeline's traceability gate fails if any AC of an **approved** story has no test.
- Branches carry the work ID: `feat/US-012-tailor-bullets`, `fix/BUG-021-nan-score`,
  `chore/CHG-000-bootstrap`. Commits use Conventional Commits with the ID:
  `feat(tailor): rewrite bullets from evidence [US-012]`.

## Status lifecycle

Every requirement, story, ADR and plan has a `Status:` line:
`Draft` → `In review` → `Approved` (→ `Superseded`).

- Only a human sets `Status: Approved`. The hooks block Claude from writing it.
- An approved document is frozen. The hooks block Claude from editing it. To change it,
  a human sets it back to `Draft`, or a new `CHG-###` is raised.

## The phases

Each phase has a skill (a slash command), an output, and an exit gate.

| # | Phase | Command | Output | Exit gate (who) |
|---|---|---|---|---|
| 0 | Bootstrap (once per project) | `/bootstrap` under CHG-000 | Running app with every gate wired | CI green on the CHG-000 PR |
| 1 | Requirement | `/requirement` | PRD entries, stories with ACs, NFRs | You approve the stories |
| 2 | Design | `/design` | Design spec (UI + API + data), ADRs, threat notes | You approve design + ADRs |
| 3 | Plan | `/plan US-012` | `docs/plans/US-012.md`: tasks, files, tests, risks | You set the plan to Approved |
| 4 | Build | `/implement US-012` | Code + tests on the story branch, test-first | Local gates pass (Stop hook) |
| 5 | Verify | `/verify` | Full local gate run + 4 reviewer agents' findings | No blocking findings |
| 6 | Integrate | open PR | PR with checklist + traceability | CI gates green + your review |
| 7 | Release | `/release` | Version, changelog, release notes | Staging smoke green, you approve prod |
| 8 | Operate | `/observe US-012` | SLOs, dashboards, alerts, runbook entries | Alerts route to you, synthetic check live |

Small fixes still follow the flow, just faster: a `BUG-###` gets a short plan
(often five lines) that you approve before code changes.

## Pipeline gates (CI on every pull request)

All required; branch protection makes `main` unmergeable until every one is green.

1. **Static**: format check, lint, type-check.
2. **Unit tests**: Vitest, coverage ≥ 80 % lines and branches on changed packages.
3. **Traceability**: every AC of every approved story has at least one test.
4. **Security**: dependency audit (high/critical fails), secret scan, CodeQL.
5. **Build**: production build and container image.
6. **End-to-end**: Playwright against the built app with a real database.
7. **Visual**: Playwright screenshot comparison against approved baselines.
8. **AI evals** (projects with LLM features): grounding / fabrication / scoring
   checks against a fixed dataset; pass-rate threshold set per eval.

## Environments and deployment

- `local` → `staging` → `production`. Same container image is promoted; never rebuilt.
- Merge to `main` deploys to staging automatically, then runs smoke tests.
- Production deploy waits for a human approval in the GitHub `production` environment.
- Rollback = run the deploy workflow manually with the previous image tag.
- Claude never deploys from a terminal; the hooks block deploy CLIs.

## Observability (built in, not bolted on)

- **Logs**: structured JSON (pino), one line per event, `requestId` + `traceId` on every line, no PII or secrets.
- **Traces**: OpenTelemetry, propagated across HTTP calls and LLM calls.
- **Metrics**: the four golden signals (latency, traffic, errors, saturation) per endpoint, plus LLM tokens, cost and eval scores.
- **Errors**: Sentry (or equivalent) with release tagging.
- **Health**: `/healthz` (process up) and `/readyz` (dependencies up).
- **SLOs**: each user-facing story declares one in its design; `/observe` turns it into an alert.
- **Synthetic check**: a scheduled workflow probes production every 15 minutes and opens an issue on failure.

## How Claude is kept in control

| Layer | Mechanism | Strength |
|---|---|---|
| Guidance | `CLAUDE.md`, `.claude/rules/*.md` | Claude reads and follows; not enforced |
| Process | Phase skills (`/plan`, `/implement`…) | Same steps every time |
| Independent review | Reviewer subagents (code, QA, security, design) | Second opinion, no self-grading |
| Enforcement | Hooks: plan gate, frozen docs, protected files, bash guard, stop gate | Blocks the action |
| Permissions | `settings.json` deny/ask lists (secrets, dependency installs, pushes) | Blocks or asks you |
| Backstop | CI gates + branch protection + PR review + prod approval | Nothing ships without passing |

Hooks are heuristics; CI + branch protection + your review are the guarantee.

## Definition of done (a story)

- [ ] Every AC has a passing test named with its ID
- [ ] CI is green, including e2e and visual
- [ ] Reviewer agents report no blocking findings
- [ ] Logs, metrics and the story's SLO alert exist
- [ ] Docs updated (API reference, runbook entry if operational)
- [ ] Deployed to staging and smoke-tested
