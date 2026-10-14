---
description: Phase 7 — prepare a release: version, changelog, release notes and the go/no-go checklist. The user triggers the production deploy.
disable-model-invocation: true
argument-hint: "[version, e.g. 1.4.0]"
---

# /release — package what's on main for production

Merged since the last tag:
!`git log --oneline $(git describe --tags --abbrev=0 2>/dev/null || git rev-list --max-parents=0 HEAD)..HEAD 2>/dev/null | head -50`

1. Work on a `chore/CHG-###-release-x.y.z` branch (ask the user for the CHG ID if none exists).
2. Pick the version with SemVer from the commits above (feat → minor, fix → patch, `!`/BREAKING → major) unless the user gave one: $ARGUMENTS
3. Update `CHANGELOG.md` (Keep a Changelog format), grouped Added / Changed / Fixed / Security, each line ending with its work ID.
4. Write `docs/releases/<version>.md`: highlights in user language, work items included, migrations and their order, new env vars and flags, known issues, rollback steps (previous image tag), and who must approve.
5. Go/no-go checklist in the same file: CI green on main; staging deployed from this exact commit and smoke tests green; migrations are backward-compatible; dashboards and alerts exist for new SLOs; runbook updated.
6. Reply with the checklist status and the next steps for the user: merge the release PR, tag `v<version>`, then approve the production deployment in GitHub. You never deploy.
