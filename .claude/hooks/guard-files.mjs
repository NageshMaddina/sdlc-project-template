// PreToolUse (Edit|Write|MultiEdit|NotebookEdit): keeps file edits inside the process.
import path from "node:path";
import { readInput, loadGuard, relPath, startsWithAny, fileIsApproved, planStatus, block, APPROVED_RE } from "./_lib.mjs";

const HOOK = "guard-files";
const input = readInput();
const guard = loadGuard();
const ti = input.tool_input || {};
const rel = relPath(ti.file_path || ti.notebook_path);
if (!rel) process.exit(0); // outside the project: not our concern

// 1. Secrets
const base = path.posix.basename(rel);
if ((guard.secretPaths || [".env"]).includes(base)) {
  block(HOOK, `\`${rel}\` holds secrets. Never read or write it; add names with fake values to .env.example instead.`);
}

// 2. Protected configuration
const prot = startsWithAny(rel, guard.protectedPaths);
if (prot) {
  block(HOOK, `\`${rel}\` is protected (${prot}). Propose the change as a diff in chat; the user applies it.`);
}

// 3. Only humans approve
const newText = [ti.content, ti.new_string, ti.new_source, ...(ti.edits || []).map((e) => e.new_string)]
  .filter((s) => typeof s === "string")
  .join("\n");
if (APPROVED_RE.test(newText)) {
  block(HOOK, "Only the user sets `Status: Approved`. Leave the document as Draft or In review and ask them to approve it.");
}

// 4. Approved documents are frozen
if (startsWithAny(rel, guard.frozenWhenApprovedPaths) && fileIsApproved(rel)) {
  block(HOOK, `\`${rel}\` is approved and frozen. To change it, the user sets it back to Draft, or raise a new CHG-### draft.`);
}

// 5. No code without an approved plan for this branch
if (guard.requireApprovedPlan !== false && startsWithAny(rel, guard.codePaths)) {
  const s = planStatus(guard);
  if (!s.ok) block(HOOK, s.reason);
}

process.exit(0);
