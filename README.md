# [PROJECT NAME]

[One-paragraph description: who it's for, what it does, why it's interesting.]

**Live:** [production URL] · **Staging:** [staging URL] · **Status:** ![CI](https://github.com/[you]/[repo]/actions/workflows/ci.yml/badge.svg)

## How this project is built
Every change follows a gated SDLC — requirement → design → plan → build → verify → release → observe — with AI (Claude Code) doing the implementation inside enforced guardrails and a human approving each phase. See [docs/sdlc/PLAYBOOK.md](docs/sdlc/PLAYBOOK.md).

| Evidence | Where |
|---|---|
| Requirements with testable acceptance criteria | [docs/requirements/](docs/requirements/) |
| Design specs and architecture decisions | [docs/design/](docs/design/), [docs/adr/](docs/adr/) |
| Approved plans for every change | [docs/plans/](docs/plans/) |
| Test strategy and traceability (every AC → a test) | [docs/test-strategy.md](docs/test-strategy.md), CI job "Traceability" |
| Pipeline gates and promotion | [.github/workflows/](.github/workflows/) |
| SLOs, alerts, runbook | [observability/](observability/), [docs/runbook.md](docs/runbook.md) |
| AI guardrails (rules, skills, hooks, reviewer agents) | [.claude/](.claude/) |
| Prompts used to direct the AI | [docs/prompts/](docs/prompts/) |

## Architecture
[Diagram + 3–5 sentences, filled in after the first design.]

## Run locally
```bash
cp .env.example .env          # fill in local values
docker compose up -d          # Postgres
pnpm install
pnpm db:migrate
pnpm dev                      # http://localhost:3000
pnpm verify                   # all local gates
```

## Quality at a glance
[Filled per release: AC coverage, unit coverage, e2e count, eval scores, DORA metrics.]
