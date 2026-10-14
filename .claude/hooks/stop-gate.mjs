// Stop: before Claude finishes a turn that changed code, run type-check and unit tests.
// On failure, exit 2 so Claude keeps working on the fix instead of reporting "done".
import { existsSync, readFileSync } from "node:fs";
import { execSync } from "node:child_process";
import path from "node:path";
import { readInput, loadGuard, git, startsWithAny, projectDir } from "./_lib.mjs";

const input = readInput();
if (input.stop_hook_active) process.exit(0); // already sent back once; don't loop forever

const guard = loadGuard();
const gate = guard.stopGate || {};
if (gate.enabled === false) process.exit(0);

const pkgPath = path.join(projectDir, "package.json");
if (!existsSync(pkgPath) || !existsSync(path.join(projectDir, "node_modules"))) process.exit(0);

const status = git(["status", "--porcelain"]);
if (!status) process.exit(0);
const changed = status
  .split("\n")
  .map((l) => l.slice(3).trim().replace(/^"|"$/g, ""))
  .filter((f) => startsWithAny(f, guard.codePaths || ["src/", "tests/"]));
if (!changed.length) process.exit(0);

let scripts = {};
try {
  scripts = JSON.parse(readFileSync(pkgPath, "utf8")).scripts || {};
} catch {}

for (const command of gate.commands || ["pnpm -s typecheck", "pnpm -s test:unit"]) {
  const script = command.split(/\s+/).filter((w) => !w.startsWith("-")).pop();
  if (script && !scripts[script]) continue; // not set up yet
  try {
    execSync(command, { cwd: projectDir, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], timeout: 300000 });
  } catch (e) {
    const out = `${e.stdout || ""}${e.stderr || ""}`.trim().split("\n").slice(-60).join("\n");
    process.stderr.write(`[stop-gate] \`${command}\` failed. The task is not done until it passes. Fix the cause (never skip or weaken tests):\n${out}\n`);
    process.exit(2);
  }
}
process.exit(0);
