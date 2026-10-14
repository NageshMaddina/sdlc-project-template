// PostToolUse (Edit|Write|MultiEdit): format, lint, and check design-token use on the file just changed.
// Exit 2 sends the problems back to Claude to fix immediately.
import { existsSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { readInput, relPath, projectDir } from "./_lib.mjs";

const input = readInput();
const ti = input.tool_input || {};
const rel = relPath(ti.file_path);
if (!rel || !existsSync(path.join(projectDir, rel))) process.exit(0);

const bin = (name) => {
  const p = path.join(projectDir, "node_modules", ".bin", process.platform === "win32" ? `${name}.cmd` : name);
  return existsSync(p) ? p : null;
};
const run = (exe, args) => {
  try {
    execFileSync(exe, args, { cwd: projectDir, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], timeout: 60000 });
    return null;
  } catch (e) {
    return `${e.stdout || ""}${e.stderr || ""}`.trim() || String(e.message);
  }
};

const problems = [];
const ext = path.extname(rel);

// 1. Format (silently)
const prettier = bin("prettier");
if (prettier && /\.(ts|tsx|js|jsx|mjs|cjs|json|css|md|yml|yaml)$/.test(rel)) run(prettier, ["--write", "--log-level", "warn", rel]);

// 2. Lint code files
const eslint = bin("eslint");
if (eslint && /\.(ts|tsx|js|jsx|mjs|cjs)$/.test(rel) && !rel.startsWith(".claude/")) {
  const out = run(eslint, ["--max-warnings=0", rel]);
  if (out) problems.push(`ESLint:\n${out.split("\n").slice(0, 40).join("\n")}`);
}

// 3. Design tokens: no raw hex colours in UI code (tokens.css is generated and exempt)
if (/^src\//.test(rel) && /\.(tsx|jsx|css|scss)$/.test(ext) && !rel.endsWith("tokens.css")) {
  const lines = readFileSync(path.join(projectDir, rel), "utf8").split("\n");
  const hits = [];
  lines.forEach((line, i) => {
    if (/(color|background|border|fill|stroke|shadow|style|className|bg-|text-)[^\n]*#[0-9a-fA-F]{3,8}\b/.test(line)) hits.push(`  line ${i + 1}: ${line.trim().slice(0, 120)}`);
  });
  if (hits.length) problems.push(`Raw hex colours in ${rel} (use design tokens, see .claude/rules/ui.md):\n${hits.slice(0, 10).join("\n")}`);
}

// 4. Focused or skipped tests
if (/\.(test|spec)\.(ts|tsx|js)$/.test(rel) || rel.startsWith("tests/")) {
  const src = readFileSync(path.join(projectDir, rel), "utf8");
  if (/\b(it|test|describe)\.(only|skip)\s*\(|\bx(it|describe)\s*\(/.test(src)) problems.push(`${rel} contains .only/.skip. Tests are never focused or skipped to get green (rules/testing.md).`);
}

if (problems.length) {
  process.stderr.write(`[post-edit] Fix before continuing:\n${problems.join("\n\n")}\n`);
  process.exit(2);
}
process.exit(0);
