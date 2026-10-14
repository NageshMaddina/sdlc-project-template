# Design source of truth

- `tokens.json` — colours, type, spacing, radii, shadows. Exported from the project's design system (e.g. the Career Crew design system artifact). `pnpm design:tokens` generates `src/design/tokens.css` and the Tailwind theme from it.
- `screens/` — one Markdown spec (or exported image) per screen, referenced from `docs/design/` specs.
- Reserved meanings: [document any colour with a fixed meaning here, e.g. "accent = needs the user's action"]. The design-reviewer agent checks these.

Changes here come from the design system, through a CHG, never from a code task.
