---
description: Phase 4 — build an approved plan task by task, test first, on the work branch. Use only after docs/plans/<ID>.md is Approved.
disable-model-invocation: true
argument-hint: <US-### | BUG-### | CHG-###> [task number]
---

# /implement — build exactly the approved plan

Work item: $ARGUMENTS

Current branch and plan status:
!`git rev-parse --abbrev-ref HEAD 2>/dev/null; grep -m1 -i '^Status' docs/plans/$0.md 2>/dev/null || echo "no plan file docs/plans/$0.md"`

1. Confirm the branch carries the work ID and the plan is Approved (above). If not, stop and tell the user what's missing.
2. Read the plan, design spec, and the rules that apply to the files you'll touch. Use the TodoWrite/task list to mirror the plan's tasks.
3. For each task, in order (or only the task number given):
   a. Write the failing test(s) named in the plan, AC ID first. Run them; confirm they fail for the right reason.
   b. Write the smallest code that makes them pass, following the design spec and rules.
   c. Run the relevant tests, then `pnpm typecheck` and `pnpm lint`.
   d. Commit: `type(scope): what [ID]`, e.g. `feat(tailor): flag untraceable bullets [US-012]`.
4. If a task turns out wrong, too big, or needs something not in the plan (new dependency, schema change, extra endpoint): stop, explain, and propose a plan amendment. Don't improvise.
5. When all tasks are done: run `pnpm verify`, then reply with tasks done, ACs covered (ID → test), anything deferred, risks, and "Run `/verify` next."
