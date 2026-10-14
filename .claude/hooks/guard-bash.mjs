// PreToolUse (Bash): blocks destructive, deploying, secret-reading and gate-bypassing commands.
import { readInput, loadGuard, currentBranch, block } from "./_lib.mjs";

const HOOK = "guard-bash";
const input = readInput();
const guard = loadGuard();
const cmd = String((input.tool_input || {}).command || "");
if (!cmd.trim()) process.exit(0);

const rules = [
  [/\bgit\s+push\b[^;&|]*(\s--force(-with-lease)?\b|\s-f\b)/, "Force-push rewrites shared history."],
  [/\bgit\s+push\b[^;&|]*\b(main|master)\b/, "Nothing is pushed to main directly; open a pull request."],
  [/\bgit\s+reset\s+--hard\b/, "`git reset --hard` discards work."],
  [/\bgit\s+clean\s+-[a-z]*f/, "`git clean -f` deletes untracked files."],
  [/\bgit\s+(checkout|restore)\s+(--\s+)?\.(\s|$)/, "Discarding all working-tree changes."],
  [/--no-verify\b/, "Skipping git hooks bypasses the local gates."],
  [/\bgh\s+pr\s+merge\b/, "Merging is the user's decision after review."],
  [/\bgh\s+workflow\s+run\b/, "Workflows (including deploys) are started by the user."],
  [/\b(curl|wget)\b[^|]*\|\s*(sudo\s+)?(ba|z)?sh\b/, "Piping a download into a shell runs unreviewed code."],
  [/\b(fly|flyctl)\s+(deploy|scale|secrets|apps\s+destroy|postgres|machine)\b/, "Deploys and infra changes go through the pipeline."],
  [/\bvercel\b.*(--prod|\bdeploy\b|\bpromote\b)/, "Deploys go through the pipeline."],
  [/\bkubectl\s+(apply|delete|rollout|scale|patch|edit)\b/, "Cluster changes go through the pipeline."],
  [/\bterraform\s+(apply|destroy|import)\b/, "Infrastructure changes go through the pipeline."],
  [/\bhelm\s+(install|upgrade|uninstall|rollback)\b/, "Cluster changes go through the pipeline."],
  [/\b(npm|pnpm|yarn)\s+publish\b/, "Publishing packages is a release step for the user."],
  [/\bdrizzle-kit\s+push\b|\bdb:push\b/, "Schema changes go through generated migrations, not push."],
  [/(^|[\s'"=<>/])\.env(\.(local|development|production|staging))?(?=$|[\s'";|&)])/, "`.env` files hold secrets; don't read, copy or print them."],
  [/\b(printenv|env)\s*($|\|)/, "Dumping the environment can print secrets."],
];

for (const [re, why] of rules) if (re.test(cmd)) block(HOOK, why);

// rm -rf only on known build/cache folders
const rm = cmd.match(/\brm\s+(-[a-zA-Z]*[rR][a-zA-Z]*|--recursive)\b([^;&|]*)/);
if (rm) {
  const safe = /^(\.\/)?(node_modules|dist|build|out|\.next|\.turbo|coverage|test-results|playwright-report|tmp|\.cache)(\/.*)?$/;
  const targets = rm[2].split(/\s+/).filter((t) => t && !t.startsWith("-"));
  const bad = targets.filter((t) => !safe.test(t.replace(/['"]/g, "")));
  if (bad.length) block(HOOK, `Recursive delete of ${bad.join(", ")}. Only build and cache folders may be removed without asking.`);
}

// Shell writes into protected or frozen locations
const writes = /(\bsed\s+-i|\bperl\s+-p?i|\btee\b|>>?|\bmv\b|\bcp\b|\brm\b|\btruncate\b|\bchmod\b|\bln\b)/;
const guarded = [...(guard.protectedPaths || []), "docs/plans/", "docs/requirements/", "docs/adr/", "docs/design/"];
if (writes.test(cmd)) {
  if (/Status\s*:\s*(Approved|Accepted)/i.test(cmd)) block(HOOK, "Only the user sets `Status: Approved`.");
  const hit = guarded.find((p) => cmd.includes(p.replace(/\/$/, "")));
  if (hit) block(HOOK, `Shell write touching \`${hit}\`. Use the Edit tool for docs (it checks approval), and propose protected-file changes to the user.`);
}

// Commits on a protected branch
if (/\bgit\s+(commit|merge|rebase|cherry-pick)\b/.test(cmd)) {
  const b = currentBranch();
  if (b && (guard.protectedBranches || ["main", "master"]).includes(b)) {
    block(HOOK, `You are on \`${b}\`. Create a work branch first: \`git switch -c feat/US-###-short-name\`.`);
  }
}

process.exit(0);
