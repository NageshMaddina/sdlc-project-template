# New project from the template

## You do first (5 minutes)
1. Create the repo from this template on GitHub, clone it, open it in Claude Code.
2. Replace `[PROJECT NAME]` in `CLAUDE.md` and README; set your GitHub username in `.github/CODEOWNERS`.
3. Turn on branch protection for `main`: require PR, 1 approval, and status checks `Static`, `Unit tests + coverage`, `Traceability`, `Security`, `CodeQL`, `E2E + accessibility + visual`, `Build container image`.
4. Read `docs/adr/0001-stack.md`; change anything you disagree with, then set `Status: Approved`.

## Prompt 1 — product brief
```
/requirement [Product name]: [2–4 sentences: who it's for, the problem, what success looks like].
Constraints: [budget, deadline, data sources, privacy].
Out of scope for v1: [list].
```

## Prompt 2 — bootstrap (after you approve CHG-000 and its plan)
```
git switch -c chore/CHG-000-bootstrap
/bootstrap
```
Approve each dependency install as it's asked. Finish when `pnpm verify`, `pnpm build`, and `pnpm test:e2e` are green; open the PR with `/verify`.
