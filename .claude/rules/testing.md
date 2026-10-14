---
paths:
  - "tests/**"
  - "src/**/*.test.ts"
  - "src/**/*.test.tsx"
---
# Testing rules

Strategy and pyramid: docs/test-strategy.md.

- Name every test that proves an acceptance criterion with its ID first: `test('AC-012.3 flags a bullet with no evidence', …)`. One AC may have several tests; every AC needs at least one.
- Write the test before the code. Show it failing for the right reason before making it pass.
- Arrange / act / assert, one behaviour per test. Assert on outcomes the user or caller sees, not on private internals.
- Unit tests (`src/**/*.test.ts`, Vitest): no network, no real DB, no real LLM. Fake I/O through the module's interface.
- Integration tests (`tests/integration/`): real Postgres (test container or CI service), real HTTP layer, fake external APIs.
- E2E (`tests/e2e/`, Playwright): user journeys from the stories. Select elements by role and accessible name (`getByRole`), never CSS classes or XPath. No fixed `waitForTimeout`; wait on visible state.
- Visual (`tests/visual/`): one screenshot per screen state in the design spec. Baselines change only when the user approves a design change.
- AI evals (`tests/evals/`): fixed dataset in `tests/evals/data/`, scored by code where possible, by a judge model from a *different* provider where not. Each eval has a pass threshold in its file.
- Test data: obviously fake (`jane.doe@example.com`, `ACME Test Corp`). No real people, companies' private data, or secrets. Factories in `tests/factories/`.
- Never `.skip`, `.only`, delete, or loosen an assertion to get green. If a test is wrong, say so and ask.
- Flaky test = bug. Quarantine only with the user's agreement and a `BUG-###` reference in the skip reason.
