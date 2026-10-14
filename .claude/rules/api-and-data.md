---
paths:
  - "src/app/api/**"
  - "src/server/**"
  - "src/db/**"
  - "drizzle/**"
---
# API and data rules

- The API contract in the approved design spec (`docs/design/`) is the source of truth. Don't add, rename or drop fields that aren't in it.
- Every handler: validate input with Zod → call a service function → map errors to the standard shape `{ error: { code, message, requestId } }`. No business logic in route files.
- Status codes: 400 validation, 401 unauthenticated, 403 forbidden, 404 not found, 409 conflict, 422 business-rule violation, 500 unexpected (never leak stack traces).
- Authorization is checked in the service layer on every call, not just in the UI.
- Database: Drizzle schema in `src/db/schema.ts`; changes only through generated migrations in `drizzle/`. Never edit a migration that has run anywhere. Destructive migrations (drop, rename, type change) need an expand → migrate → contract plan and the user's approval.
- Queries are parameterised (Drizzle does this; never build SQL with string concatenation). Paginate every list endpoint.
- Every external call (HTTP, LLM) has a timeout, retries with backoff only for idempotent operations, and is wrapped in a span (observability rule).
- LLM calls: prompts live in `src/agents/prompts/` as versioned files, output is parsed and validated with Zod, and token use and cost are logged.
