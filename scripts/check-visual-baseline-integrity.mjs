import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = path.join(root, "scripts", "visual-baseline-manifest.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const failures = [];
for (const [relativePath, expected] of Object.entries(manifest)) {
  const absolutePath = path.join(root, relativePath);
  if (!fs.existsSync(absolutePath)) {
    failures.push(`${relativePath}: missing`);
    continue;
  }
  const actual = crypto.createHash("sha256").update(fs.readFileSync(absolutePath)).digest("hex");
  if (actual !== expected) failures.push(`${relativePath}: visual baseline changed`);
}
if (failures.length) {
  console.error("Visual baseline integrity FAILED");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log(`Visual baseline integrity PASS (${Object.keys(manifest).length} render-critical files)`);
