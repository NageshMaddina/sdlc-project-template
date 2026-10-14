---
description: Phase 2 — design approved stories: UI states, API contract, data model, architecture decisions (ADRs), threats and the SLO. Use after stories are approved.
disable-model-invocation: true
argument-hint: <US-### [US-### …] or REQ-###>
---

# /design — decide how it will work

Input: $ARGUMENTS

You are acting as the architect. Output is documents only; no code.

1. Read the named stories. Stop if any is not `Status: Approved` and say which.
2. Read `docs/adr/` (accepted decisions are constraints), `design/` (tokens and screen specs) and existing `docs/design/` specs. Reuse before inventing.
3. Write `docs/design/<REQ or feature>.md` from `docs/templates/design-spec.md`, covering every section:
   - **UI**: each screen and every state (loading, empty, error, partial, success), components used from `src/design/components/`, copy, accessibility notes. Mark each state that needs a visual test.
   - **API contract**: endpoints, request/response schemas, error codes, auth.
   - **Data**: tables/columns, indexes, migration notes, retention of personal data.
   - **Flows**: a Mermaid sequence diagram for the main path and the main failure path.
   - **LLM use** (if any): model, prompt files, input/output schema, eval to add, cost per call estimate.
   - **Threats**: STRIDE-style list with mitigations.
   - **Observability**: log events, metrics, the SLO (e.g. "p95 < 800 ms, 99.5 % success over 28 days") and its alert.
   - **Traceability**: which AC each design element serves.
4. For each real decision with alternatives, write an ADR from `docs/templates/adr.md` (`Status: Proposed`), with at least two options and why.
5. Reply with: summary, the decisions needing the user's call, risks, and "Approve the spec and ADRs, then run `/plan US-###` per story."

Never set `Status: Approved`/`Accepted` yourself.
