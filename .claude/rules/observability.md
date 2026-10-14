---
paths:
  - "src/**"
---
# Observability rules

Full model: docs/observability.md.

- Log with the shared logger (`src/lib/logger.ts`, pino), never `console.*`. One JSON line per event with `event` (dot.case name), `requestId`, `traceId`, and relevant IDs. Never log secrets, tokens, request bodies with personal data, or full LLM prompts containing user content.
- Levels: `error` = needs a human; `warn` = degraded but handled; `info` = business events (one per meaningful action); `debug` = off in production.
- Every request handler and job runs inside an OpenTelemetry span; external calls (DB, HTTP, LLM) get child spans with useful attributes (`llm.model`, `llm.tokens.input`, `llm.tokens.output`, `db.operation`).
- Metrics for each user-facing endpoint: request count, error count, latency histogram. LLM features also record tokens, cost and eval score.
- Errors go to the error tracker with the release version; don't catch-and-log-and-continue for errors that leave the system in a bad state.
- Keep `/healthz` (liveness, no dependencies) and `/readyz` (checks DB and required external services) working; the deploy smoke tests depend on them.
- A story whose design declares an SLO isn't done until `/observe` has added its alert and runbook entry.
