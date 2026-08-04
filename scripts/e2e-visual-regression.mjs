import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const output = path.resolve(process.env.MBN_VISUAL_OUTPUT || "artifacts/visual-mbn");
fs.mkdirSync(output, { recursive: true });
const result = spawnSync(process.execPath, ["scripts/e2e-browser-core.mjs"], {
    stdio: "inherit",
    env: { ...process.env, MBN_E2E_CAPTURE_DIR: output, MBN_E2E_REQUIRE_RESPONSIVE: "1" },
});
if (result.status !== 0) process.exit(result.status || 1);
console.log(`MBN visual regression PASS: ${output}`);
