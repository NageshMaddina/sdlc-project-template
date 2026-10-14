# [PROJECT NAME]

[One sentence: what this product does and for whom.]
Process: docs/sdlc/PLAYBOOK.md. Stack and why: docs/adr/0001-stack.md.

## Commands
- Install: `pnpm install`
- Dev server: `pnpm dev`
- All local gates: `pnpm verify` (format, lint, typecheck, unit, traceability)
- Unit tests: `pnpm test:unit`  ·  E2E: `pnpm test:e2e`  ·  Visual: `pnpm test:visual`  ·  AI evals: `pnpm test:evals`
- DB migrations: `pnpm db:generate` then `pnpm db:migrate` (never edit an applied migration)

## Layout
- `docs/requirements/` PRD, stories (US-###), changes (CHG-###)
- `docs/design/` design specs  ·  `docs/adr/` decisions  ·  `docs/plans/` one approved plan per work item
- `design/` design tokens and screen specs (source of truth for UI)
- `src/` app code  ·  `tests/` unit, e2e, visual, evals  ·  `scripts/` repo tooling

## How we work (summary of .claude/rules/00-control.md)
1. No code without an approved plan for the current branch's work ID. The hooks enforce this.
2. Only humans approve. Never write `Status: Approved`, never edit an approved doc.
3. Test first. Every acceptance criterion gets a test named with its AC ID.
4. Stay in scope: build only what the approved plan lists. Anything else → write it down as a proposed CHG, don't build it.
5. Ask before adding a dependency, changing CI, settings or hooks, or anything touching auth, payments or data deletion.
6. Never deploy, push to `main`, force-push, or read `.env` files.

## Gotchas
- [Add project-specific traps here as you hit them.]
