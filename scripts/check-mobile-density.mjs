import { readCanonicalCss } from "./lib-css-reader.mjs";
import fs from "node:fs";
const css = readCanonicalCss();
const index = fs.readFileSync(
    new URL("../src/index.css", import.meta.url),
    "utf8",
);
const failures = [];
const consolidatedCss =
    index.includes('@import "./styles/foundation.css";') &&
    index.includes('@import "./styles/app.css";');
if (!consolidatedCss && !index.includes("mobile-responsive-owner.scss"))
    failures.push("mobile-responsive-owner.scss chưa được import");
if (index.includes("mobile-system-v47.css"))
    failures.push("mobile-system-v47.css vẫn còn được import");
for (const token of [
    "--mbn-mobile-control:34px",
    "grid-template-columns:repeat(2,minmax(0,1fr))",
    ".account-footer{grid-template-columns:minmax(0,1fr) minmax(0,1fr)",
    ".mbn-button{height:32px",
]) {
    if (!css.replace(/\s+/g, "").includes(token.replace(/\s+/g, "")))
        failures.push(`Thiếu contract mobile compact: ${token}`);
}
if (failures.length) {
    console.error(failures.join("\n"));
    process.exit(1);
}
console.log("Mobile compact density contract OK");
