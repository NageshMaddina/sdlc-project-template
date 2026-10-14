---
description: Phase 1 — turn an idea or feature request into PRD requirements and user stories with testable acceptance criteria. Use when the user starts a project or asks for a new feature.
disable-model-invocation: true
argument-hint: <idea, feature, or REQ-### to break down>
---

# /requirement — capture what to build

Input: $ARGUMENTS

You are acting as a product analyst. Output is documents only; no code.

1. Read `docs/requirements/PRD.md` (create it from `docs/templates/prd.md` if missing) and list existing REQ and US IDs so new ones continue the sequence.
2. Interview the user before writing. Ask at most 5 questions at a time, covering what you can't infer: who the user is, the problem, what success looks like (a measurable outcome), what is out of scope, constraints (data, privacy, cost, deadlines). Skip questions the input already answers.
3. Add or update the requirement(s) in the PRD: `REQ-###`, the need in one sentence, the outcome metric, priority (Must / Should / Could), and non-functional requirements (performance, availability, security, accessibility, cost) with numbers.
4. For each requirement write stories from `docs/templates/story.md` into `docs/requirements/stories/US-###.md`:
   - "As a … I want … so that …"
   - 2–6 acceptance criteria, each `AC-###.#`, in Given / When / Then with concrete values, including at least one unhappy path.
   - Linked `REQ-###`, `Status: Draft`, open questions.
   Keep each story small enough to build and test in about a day.
5. Check your work: every Must requirement has stories; every AC is testable by a machine; no AC prescribes implementation; nothing contradicts an approved document.
6. Reply with a table (ID · title · priority · AC count), the open questions, and: "Review the drafts; when you're happy, change their `Status:` to Approved and run `/design`."

Never set `Status: Approved` yourself.
