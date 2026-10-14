---
description: Phase 5 — run every local quality gate and the four independent reviewers on the current branch, then prepare the pull request. Use when a story's implementation is complete.
disable-model-invocation: true
argument-hint: "[US-### | BUG-### | CHG-###]"
---

# /verify — prove it before anyone reviews it

Changes on this branch:
!`git diff --stat main...HEAD 2>/dev/null | tail -20`

1. Run the gates in order and stop at the first failure (fix it, then restart):
   `pnpm verify` (format, lint, typecheck, unit + coverage, traceability) → `pnpm build` → `pnpm test:e2e` → `pnpm test:visual` → `pnpm test:evals` (if the project has LLM features).
2. Launch these subagents **in parallel**, each with the work ID, plan path and `git diff main...HEAD`:
   `code-reviewer`, `qa-reviewer`, `security-reviewer`, and `design-reviewer` if UI files changed.
3. Merge their findings into one table: severity (blocking / should fix / note) · file:line · finding · fix. Fix blocking items (they are within the approved plan; if a fix isn't, raise it), re-run gates, re-run only the reviewers that had blocking findings.
4. Draft the PR body from `.github/pull_request_template.md`: summary, work ID, AC → test table, gate results, reviewer summary, screenshots for UI, risks and rollback.
5. Reply with the results and the PR body. Ask before running `git push` / `gh pr create`.
