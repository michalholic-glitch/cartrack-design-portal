#!/usr/bin/env node
/**
 * Aggregates vibe-test results for one iteration.
 *
 * Usage: node aggregate.mjs <iteration>
 * Reads:  vibe-tests/results/<iteration>/results/*.json
 * Prints: pass rate overall + by category, plus any invented
 *         components/props/tokens and rule violations found across the run.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const iteration = process.argv[2];
if (!iteration) {
  console.error("Usage: node aggregate.mjs <iteration>");
  process.exit(1);
}

const resultsDir = join(import.meta.dirname, "results", iteration, "results");

let files;
try {
  files = readdirSync(resultsDir).filter((f) => f.endsWith(".json"));
} catch {
  console.error(`No results found at ${resultsDir}`);
  process.exit(1);
}

if (files.length === 0) {
  console.error(`No result JSON files in ${resultsDir}`);
  process.exit(1);
}

const results = files.map((f) => JSON.parse(readFileSync(join(resultsDir, f), "utf8")));

const byCategory = {};
let successCount = 0;
const invented = [];
const violations = [];
const gapsFlagged = [];

for (const r of results) {
  const cat = r.category ?? "uncategorized";
  byCategory[cat] ??= { total: 0, success: 0 };
  byCategory[cat].total += 1;

  const ev = r.evaluation ?? {};
  if (ev.success) {
    successCount += 1;
    byCategory[cat].success += 1;
  }
  if (ev.invented?.length) invented.push({ id: r.id ?? r.promptId, items: ev.invented });
  if (ev.violatedRules?.length) violations.push({ id: r.id ?? r.promptId, rules: ev.violatedRules });
  if (ev.flaggedGap) gapsFlagged.push(r.id ?? r.promptId);
}

console.log(`\nVibe-test results — iteration "${iteration}"`);
console.log(`${"=".repeat(40)}`);
console.log(`Overall: ${successCount}/${results.length} passed (${Math.round((successCount / results.length) * 100)}%)\n`);

console.log("By category:");
for (const [cat, { total, success }] of Object.entries(byCategory)) {
  console.log(`  ${cat.padEnd(20)} ${success}/${total}`);
}

if (invented.length) {
  console.log("\nInvented components/props/tokens (should be zero):");
  for (const i of invented) console.log(`  [${i.id}] ${i.items.join(", ")}`);
}

if (violations.length) {
  console.log("\nAGENTS.md rule violations:");
  for (const v of violations) console.log(`  [${v.id}] ${v.rules.join(", ")}`);
}

if (gapsFlagged.length) {
  console.log("\nCorrectly flagged a gap instead of fabricating:");
  for (const id of gapsFlagged) console.log(`  [${id}]`);
}

console.log("");
