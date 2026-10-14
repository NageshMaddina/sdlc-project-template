// Shared helpers for the project's Claude Code hooks.
// Hooks read one JSON object on stdin and signal "block" with exit code 2 + a message on stderr.
import { readFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";

export const projectDir = process.env.CLAUDE_PROJECT_DIR || process.cwd();

export function readInput() {
  try {
    const raw = readFileSync(0, "utf8");
    return raw.trim() ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function loadGuard() {
  const file = path.join(projectDir, ".claude", "guard.json");
  try {
    return JSON.parse(readFileSync(file, "utf8"));
  } catch {
    return {};
  }
}

// Repo-relative POSIX path, or null when the file is outside the project.
export function relPath(filePath) {
  if (!filePath) return null;
  const abs = path.resolve(projectDir, filePath);
  const rel = path.relative(projectDir, abs);
  if (rel.startsWith("..") || path.isAbsolute(rel)) return null;
  return rel.split(path.sep).join("/");
}

export function startsWithAny(rel, prefixes = []) {
  return prefixes.find((p) => rel === p.replace(/\/$/, "") || rel.startsWith(p)) || null;
}

export function git(args) {
  try {
    return execFileSync("git", args, { cwd: projectDir, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return null;
  }
}

export function currentBranch() {
  return git(["rev-parse", "--abbrev-ref", "HEAD"]);
}

export const APPROVED_RE = /^\s*[*_]*Status[*_]*\s*:\s*[*_]*\s*(Approved|Accepted)\b/im;

export function fileIsApproved(rel) {
  const abs = path.join(projectDir, rel);
  if (!existsSync(abs)) return false;
  try {
    return APPROVED_RE.test(readFileSync(abs, "utf8"));
  } catch {
    return false;
  }
}

// Plan check for the current branch. Returns { ok, reason, id, planRel }.
export function planStatus(guard) {
  const branch = currentBranch();
  if (!branch) return { ok: false, reason: "This folder is not a git repository yet. Ask the user to run `git init` and create a work branch." };
  if ((guard.protectedBranches || ["main", "master"]).includes(branch)) {
    return { ok: false, branch, reason: `You are on the protected branch \`${branch}\`. Code changes happen on a work branch such as \`feat/US-001-short-name\`.` };
  }
  const re = new RegExp(guard.workIdPattern || "(US|BUG|CHG)-\\d{3,}");
  const m = branch.match(re);
  if (!m) return { ok: false, branch, reason: `Branch \`${branch}\` has no work ID. Use \`feat/US-###-…\`, \`fix/BUG-###-…\` or \`chore/CHG-###-…\`.` };
  const id = m[0];
  const planRel = `${guard.planDir || "docs/plans"}/${id}.md`;
  if (!existsSync(path.join(projectDir, planRel))) {
    return { ok: false, branch, id, planRel, reason: `No plan for ${id}. Run \`/plan ${id}\` and have the user approve ${planRel} first.` };
  }
  if (!fileIsApproved(planRel)) {
    return { ok: false, branch, id, planRel, reason: `${planRel} is not approved yet. Ask the user to review it and set \`Status: Approved\` themselves.` };
  }
  return { ok: true, branch, id, planRel };
}

export function block(hook, message) {
  process.stderr.write(`[${hook}] Blocked: ${message}\nIf this is genuinely needed, explain why and ask the user to do it or to change .claude/guard.json.\n`);
  process.exit(2);
}
