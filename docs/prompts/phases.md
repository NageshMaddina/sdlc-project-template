# Phase prompts (01–08)

Each phase ends with you reviewing and approving. Claude cannot approve for you.

## 01 — Requirement
```
/requirement [feature or REQ-###]. Primary user: [persona]. Success metric: [number].
Must handle: [edge cases you already know]. Not in this story: [exclusions].
```
You then: read every AC. Is each one testable with concrete values? Approve the stories.

## 02 — Design
```
/design US-### US-###. Reuse existing components and ADRs where possible.
Constraints: [latency, cost per call, privacy]. Propose ADRs for any real choice.
```
You then: check states, API contract, threats and the SLO. Approve spec + ADRs.

## 03 — Plan
```
/plan US-###
```
You then: is every task small, does each start with a named test, are dependencies justified, is rollback clear? Approve the plan.

## 04 — Implement
```
/implement US-###
```
or one task at a time when the change is risky: `/implement US-### 3`.
You then: skim each commit; stop Claude early if it drifts.

## 05 — Verify
```
/verify US-###
```
You then: read the reviewers' blocking findings and how they were resolved. Push and open the PR when satisfied.

## 06 — Integrate
Review the PR on GitHub as you would a team member's. Merge when CI is green.

## 07 — Release
```
/release [optional version]
```
You then: merge the release PR, tag `vX.Y.Z`, approve the production deployment in GitHub Actions.

## 08 — Observe
```
/observe US-###
```
You then: connect alert routing in Grafana/Sentry to your phone/email; confirm the synthetic check is green.
