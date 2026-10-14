---
paths:
  - "src/**"
  - "scripts/**"
---
# Code style

- TypeScript strict mode. No `any`; use `unknown` and narrow. No non-null `!` without a comment saying why it is safe.
- Validate every external input at the boundary with Zod (HTTP bodies, query params, env vars, LLM output, third-party API responses). Inside the boundary, trust the types.
- Named exports only. One module = one responsibility; files over ~300 lines are a smell, split by responsibility.
- Errors: throw typed errors (`AppError` with a `code`), never strings. Catch only where you can handle or add context; never swallow.
- No `console.log` in `src/`; use the logger (see observability rule).
- Config comes from `src/lib/env.ts` (validated once at startup), never `process.env` scattered through the code.
- Pure functions for business logic; I/O (DB, HTTP, LLM) behind small interfaces so it can be faked in unit tests.
- Comments explain *why*, not *what*. Reference the work ID for non-obvious decisions: `// US-012: …`.
- Formatting and lint are owned by Prettier and ESLint; don't hand-format or disable rules inline without a reason in the same line.
