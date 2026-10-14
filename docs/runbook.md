# Runbook

Status: Draft

## Environments
| Env | URL | App | Deployed by | Data |
|---|---|---|---|---|
| local | http://localhost:3000 | — | developer | docker-compose Postgres |
| staging | https://[app]-staging.fly.dev | `[app]-staging` | merge to `main` (automatic) | staging DB, fake data |
| production | https://[app].fly.dev | `[app]-prod` | tag + approval in GitHub | production DB |

## Configuration
| Variable | Purpose | Where set |
|---|---|---|
| `DATABASE_URL` | Postgres connection | Fly secrets per env; `.env` locally |
| `LOG_LEVEL` | `info` in prod | Fly env |
| `SENTRY_DSN` | error tracking | Fly secrets |
| `OTEL_EXPORTER_OTLP_ENDPOINT`, `OTEL_EXPORTER_OTLP_HEADERS` | telemetry export | Fly secrets |

## Deploy
1. Merge to `main` → CI → staging deploy → smoke tests (automatic).
2. Tag `vX.Y.Z` on the commit that passed staging → production job waits for approval in GitHub → approve → smoke tests.

## Roll back
GitHub → Actions → **Deploy** → Run workflow → environment `production`, image tag = previous good SHA (from the last successful deploy's summary). Database migrations are expand/contract, so the previous image runs against the new schema.

## Alerts and responses
### [Alert name]
- Symptom: [ ]
- Likely causes: [ ]
- Checks: [exact query / command]
- Fix: [ ]
- Rollback: [ ]
