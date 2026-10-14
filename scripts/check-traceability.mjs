#!/usr/bin/env node
// Traceability gate: every acceptance criterion (AC-###.#) in an approved story or change
// must be referenced by at least one test, or explicitly say "(verified by: …)".
// Usage: node scripts/check-traceability.mjs [--all]   (--all also checks Draft documents)
// Writes a Markdown matrix to stdout and to $GITHUB_STEP_SUMMARY when present.
import { readdirSync, readFileSync, statSync, existsSync, appendFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const includeDrafts = process.argv.includes("--all");
const APPROVED = /^\s*[*_]*Status[*_]*\s*:\s*[*_]*\s*(Approved|Accepted)\b/im;
const AC_LINE = /^\s*[-*]\s*\**(AC-\d{3,}\.\d+)\**(.*)$/gm;
const AC_REF = /\bAC-\d{3,}\.\d+(?!\d)/g;

function walk(dir, filter, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name.startsWith(".")) continue;
    const p = path.join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, filter, out);
    else if (filter(p)) out.push(p);
  }
  return out;
}

// 1. Acceptance criteria from requirement documents
const docs = walk(path.join(root, "docs/requirements"), (p) => p.endsWith(".md"));
const criteria = [];
for (const file of docs) {
  const text = readFileSync(file, "utf8");
  const approved = APPROVED.test(text);
  if (!approved && !includeDrafts) continue;
  for (const m of text.matchAll(AC_LINE)) {
    const verifiedBy = /\(verified by:\s*([^)]+)\)/i.exec(m[2]);
    criteria.push({ id: m[1], doc: path.relative(root, file), approved, verifiedBy: verifiedBy?.[1]?.trim() });
  }
}

// 2. References from tests
const isTest = (p) => /\.(test|spec)\.[cm]?[jt]sx?$/.test(p) || (/[\\/]tests[\\/]/.test(p) && /\.[cm]?[jt]sx?$/.test(p));
const testFiles = [...walk(path.join(root, "src"), isTest), ...walk(path.join(root, "tests"), isTest)];
const refs = new Map();
for (const file of testFiles) {
  const text = readFileSync(file, "utf8");
  for (const m of text.matchAll(AC_REF)) {
    const list = refs.get(m[0]) || new Set();
    list.add(path.relative(root, file));
    refs.set(m[0], list);
  }
}

// 3. Report
const rows = criteria.map((c) => {
  const files = [...(refs.get(c.id) || [])];
  const status = files.length ? "covered" : c.verifiedBy ? "verified elsewhere" : "MISSING";
  return { ...c, files, status };
});
const missing = rows.filter((r) => r.status === "MISSING");
const known = new Set(criteria.map((c) => c.id));
const orphans = [...refs.keys()].filter((id) => !known.has(id)).sort();

let md = `## Traceability\n\n${rows.length} acceptance criteria checked · ${missing.length} missing\n\n`;
md += "| AC | Document | Status | Evidence |\n|---|---|---|---|\n";
for (const r of rows) md += `| ${r.id} | ${r.doc} | ${r.status === "MISSING" ? "❌ MISSING" : r.status} | ${r.files.join("<br>") || r.verifiedBy || "—"} |\n`;
if (orphans.length) md += `\nTests reference IDs not found in ${includeDrafts ? "any" : "an approved"} document: ${orphans.join(", ")}\n`;

process.stdout.write(md);
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, md);

if (missing.length) {
  process.stderr.write(`\nTraceability gate failed: ${missing.map((m) => m.id).join(", ")} ha${missing.length === 1 ? "s" : "ve"} no test.\n`);
  process.exit(1);
}
