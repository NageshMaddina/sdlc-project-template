# Generation rules (always loaded)

These rules apply to every change in this repository. Hooks enforce the starred ones;
the rest are on you. If a rule blocks the user's request, say which rule and ask.

## Work only from approved artifacts
- ★ Code and tests change only on a branch named with a work ID
  (`feat/US-012-…`, `fix/BUG-021-…`, `chore/CHG-003-…`) whose plan
  `docs/plans/<ID>.md` has `Status: Approved`.
- ★ Never write `Status: Approved` and never edit a document that is already approved.
  Propose changes in chat or in a new `CHG-###` draft.
- Build exactly what the plan's task list says. If you discover needed work outside it,
  stop and tell the user; draft it as a `CHG-###` if they agree. No drive-by refactors.
- If the plan is wrong or impossible, stop and explain; don't improvise a different design.

## Test first, with traceability
- For each task: write the failing test, then the code, then make it pass.
- Tests that prove an acceptance criterion carry its ID in the test name: `AC-012.3 …`.
- Never weaken, skip (`.skip`, `.only`), or delete a test to make the suite pass.
  Never lower coverage thresholds or edit visual baselines without the user saying so.

## Ask first (do not just do)
- Adding, removing or upgrading a dependency.
- ★ Changing `.claude/settings.json`, `.claude/hooks/`, `.claude/guard.json`, `.github/workflows/`.
- Database migrations that drop or rewrite data; anything touching auth, payments,
  personal data, or deletion.
- New environment variables (also add them to `.env.example` and `docs/runbook.md`).

## Never
- ★ Read or print `.env` files or secrets; never put secrets in code, logs or tests.
- ★ Deploy from the terminal, push to `main`, force-push, `reset --hard`, or `--no-verify`.
- Invent requirements, metrics, API fields or test data that look real. Use clearly fake fixtures.

## Finish every task the same way
1. `pnpm verify` passes (the Stop hook runs type-check and unit tests and will send you back if they fail).
2. Summarize: what changed, which ACs are now covered, anything left undone, any risk.
3. Commit with a Conventional Commit message ending in the work ID, e.g. `feat(tailor): flag untraceable bullets [US-012]`.
