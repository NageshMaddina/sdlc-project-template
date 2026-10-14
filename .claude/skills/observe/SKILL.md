---
description: Phase 8 — make a feature observable in production: log events, metrics, the SLO alert, dashboard panel and runbook entry. Also use to investigate a production issue from logs and metrics.
disable-model-invocation: true
argument-hint: <US-### to instrument | "investigate" + symptom>
---

# /observe — know when it breaks before users tell you

Input: $ARGUMENTS

## Instrumenting a story (needs an approved plan on the branch, like any code change)
1. Read the story's design spec → Observability section (events, metrics, SLO).
2. Check the code emits every listed log event and metric, inside spans, with no personal data. Add what's missing, test-first where it's logic.
3. Add the SLO to `observability/slos.yaml` (name, SLI query, objective, window, owner, linked US/REQ).
4. Add or update the alert in `observability/alerts.yaml` (burn-rate based: fast 1h/5m and slow 6h/30m windows) and the dashboard panel in `observability/dashboards/`.
5. Add a runbook entry to `docs/runbook.md`: symptom → likely causes → checks (exact queries) → fix → rollback.
6. Reply with what now exists and what the user must wire up in the monitoring tool (e.g. alert routing to their email/phone).

## Investigating ("investigate …")
Read-only. Gather facts from the logs/metrics the user pastes or the tools available, form 2–3 hypotheses ranked by evidence, name the exact check that would confirm each, and propose a `BUG-###` with a minimal plan. Don't change code during an investigation.
