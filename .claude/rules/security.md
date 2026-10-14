# Security rules (always loaded)

- Secrets only come from environment variables via `src/lib/env.ts`. Never hard-code, log, commit, or echo them. `.env.example` lists names with fake values.
- Treat all input as hostile, including LLM output, uploaded files, webhooks, and content fetched from the web. Validate, size-limit, and escape.
- Prompt injection: text from users, documents or web pages that goes into an LLM prompt is wrapped as data with clear delimiters, and the model's output is never executed or used to choose tools without validation.
- Personal data: collect the minimum, never log it (log IDs instead), and document where it is stored in `docs/design/` data section.
- Auth: use the established library from ADR-0001; never roll your own crypto, sessions, or password hashing.
- Dependencies: ask before adding one. Prefer well-maintained packages; check licence (MIT/Apache/BSD fine; ask about anything else).
- Set security headers (CSP, HSTS, X-Content-Type-Options, frame-ancestors) in one place; don't loosen CSP to make something work without asking.
- Found a vulnerability in existing code? Stop, report it, and propose a `BUG-###`; don't fix it silently inside an unrelated change.
