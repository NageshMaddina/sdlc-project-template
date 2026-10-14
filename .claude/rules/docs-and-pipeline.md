---
paths:
  - "docs/**"
  - ".github/**"
  - "design/**"
---
# Docs and pipeline rules

- Use the templates in `docs/templates/`. Keep every ID, `Status:` line and section heading; fill placeholders, don't delete sections (write "N/A — reason" instead).
- New documents start as `Status: Draft`. Only the user moves them to `Approved`. Approved documents are frozen; the hooks enforce this.
- Requirements describe the need and the acceptance criteria, never the implementation. Acceptance criteria are testable: Given / When / Then, with concrete values.
- ADRs record one decision each: context, options considered (at least two), decision, consequences. Never rewrite an accepted ADR; supersede it with a new one.
- `.github/workflows/` is protected: propose pipeline changes as a diff in chat or in the plan, and the user applies them. Never remove or weaken a gate (`continue-on-error`, lower thresholds, skipped jobs).
- `design/tokens.json` changes come from the design system, not from code tasks.
