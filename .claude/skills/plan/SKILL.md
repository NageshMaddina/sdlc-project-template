---
description: Phase 3 — write the implementation plan for one approved story, bug or change. The plan must be approved by the user before any code is written.
disable-model-invocation: true
argument-hint: <US-### | BUG-### | CHG-###>
---

# /plan — agree the work before writing code

Work item: $ARGUMENTS

1. Read the work item, its approved design spec and relevant ADRs. If the story or design is not approved, stop and say so. For a `BUG-###`, read the issue, reproduce it in your head from the code, and state the root cause hypothesis.
2. Explore only the code you need (use the Explore agent for wide searches). Note existing patterns to follow.
3. Write `docs/plans/<ID>.md` from `docs/templates/plan.md`, `Status: Draft`:
   - **Scope**: in and out, linked ACs.
   - **Tasks**: numbered, each small (≤ ~1 hour), each naming the files it creates or changes and the test(s) it adds first. Order so every task leaves the build green.
   - **Test plan**: AC → test file and test name (`AC-###.# …`), plus unit/integration/e2e/visual/eval split.
   - **Dependencies to add** (each needs approval), migrations, env vars, feature flags.
   - **Risks and rollback**: what could break, how we'd notice (log/metric), how to undo.
   - **Branch**: `feat/US-###-short-name` (or `fix/` / `chore/`).
4. Create the branch: `git switch -c <branch>` (from an up-to-date main).
5. Reply with the task list and: "Review docs/plans/<ID>.md. When it's right, set `Status: Approved` and run `/implement <ID>`." The hooks will block code changes until then.
