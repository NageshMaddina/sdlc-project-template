# Situation prompts (09–13)

## 09 — Bug
```
BUG-###: [what happened] in [environment] at [time]. Expected per AC-###.#: [quote].
Evidence: [requestId / Sentry link / steps].
Create docs/plans/BUG-###.md with reproduction, root cause, and a failing regression test as task 1.
Don't change code until I approve the plan.
```

## 10 — Change request (requirement or approved doc needs to change)
```
Draft CHG-### from docs/templates/change.md: [what must change and why].
List every approved doc, test and piece of code it affects. Don't edit approved documents.
```

## 11 — Review only (no changes)
```
Review [branch / PR / path] with the code-reviewer, qa-reviewer and security-reviewer agents in parallel.
Give me one merged table of blocking findings. Don't modify anything.
```

## 12 — Production incident
```
/observe investigate [symptom, start time, affected users].
Here are the logs/metrics: [paste or link]. Read-only: rank hypotheses by evidence and
tell me the exact check for each. Then propose a BUG-### plan and whether to roll back now.
```

## 13 — Reset a session that drifted
```
Stop. Re-read CLAUDE.md, .claude/rules/00-control.md and docs/plans/[ID].md.
List what you changed that is not in the approved task list, and propose how to revert it.
Then continue with task [n] only.
```

## Habits that keep you in control
- One work item per session; `/clear` between items.
- Name the ID in every prompt.
- When Claude asks to add a dependency or touch a protected file, answer deliberately; "yes to all" removes your control.
- Commit after each task so any step can be reverted cleanly.
