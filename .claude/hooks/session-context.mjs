// SessionStart: tell Claude where the work stands. Whatever this prints is added to Claude's context.
import { readdirSync, existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { loadGuard, planStatus, projectDir, APPROVED_RE } from "./_lib.mjs";

const guard = loadGuard();
const s = planStatus(guard);
const lines = ["## Work status (from .claude/hooks/session-context.mjs)"];

lines.push(`- Branch: ${s.branch || "(no git branch)"}${s.id ? ` · work item ${s.id}` : ""}`);
if (s.ok) lines.push(`- Plan ${s.planRel} is Approved. Build only what its task list says.`);
else lines.push(`- Code changes are blocked right now: ${s.reason}`);

// Drafts waiting on the user
const waiting = [];
for (const dir of ["docs/requirements/stories", "docs/requirements/changes", "docs/design", "docs/adr", "docs/plans"]) {
  const abs = path.join(projectDir, dir);
  if (!existsSync(abs)) continue;
  for (const f of readdirSync(abs)) {
    if (!f.endsWith(".md") || f.startsWith("_")) continue;
    const text = readFileSync(path.join(abs, f), "utf8");
    if (/^\s*Status\s*:\s*(Draft|In review|Proposed)/im.test(text) && !APPROVED_RE.test(text)) waiting.push(`${dir}/${f}`);
  }
}
if (waiting.length) lines.push(`- Waiting for the user's approval: ${waiting.slice(0, 12).join(", ")}${waiting.length > 12 ? " …" : ""}`);
lines.push("- Process: docs/sdlc/PLAYBOOK.md. Phase commands: /requirement /design /plan /implement /verify /release /observe.");

process.stdout.write(lines.join("\n") + "\n");
process.exit(0);
