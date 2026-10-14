# Observability

Status: Draft

## What we collect
| Signal | How | Where it goes |
|---|---|---|
| Logs | pino JSON to stdout, `requestId` + `traceId` on every line, secrets redacted | Grafana Cloud Loki (via OTLP) / host logs |
| Traces | OpenTelemetry SDK, auto-instrumented HTTP + DB, manual spans for LLM calls | Grafana Cloud Tempo |
| Metrics | OTel metrics: `http.server.duration`, request/error counters, `llm.tokens`, `llm.cost_usd`, `eval.score` | Grafana Cloud Prometheus |
| Errors | Sentry, tagged with release SHA and environment | Sentry |
| Health | `/api/healthz` (liveness), `/api/readyz` (DB + dependencies) | Fly.io checks, smoke tests, synthetic workflow |
| Uptime | `.github/workflows/synthetic.yml` every 15 minutes | GitHub issue on failure |

## Log event conventions
- `event` names are `domain.action` in past tense: `resume.tailored`, `job.scored`, `health.ready_failed`.
- Always include: `event`, `requestId`, `traceId`, `userId` (ID only), `durationMs` where relevant.
- Never include: secrets, tokens, raw prompts with user content, email addresses, resumes, free-text input.

## SLOs
Declared per feature in its design spec, recorded in `observability/slos.yaml`, alerted from `observability/alerts.yaml`.

Default for every user-facing endpoint until a story says otherwise:
- Availability: 99.5 % of requests succeed (non-5xx) over 28 days.
- Latency: 95 % of requests complete under 800 ms over 28 days (LLM endpoints: under 15 s).

Alerting uses error-budget burn rates: page when the 1-hour burn rate > 14.4 and 5-minute > 14.4; ticket when the 6-hour > 6 and 30-minute > 6.

## Dashboards
One per service in `observability/dashboards/`: golden signals, top errors, deploy markers, LLM tokens/cost and eval scores over time.

## Release health
Every deploy is annotated on dashboards with its SHA. After a production deploy, watch error rate and p95 latency for 30 minutes; roll back if either breaches the SLO alert threshold.
