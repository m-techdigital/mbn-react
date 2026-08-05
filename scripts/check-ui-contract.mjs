import { readCanonicalCss } from "./lib-css-reader.mjs";
import fs from "node:fs";
const app = fs.readFileSync(
    new URL("../src/components/layout/AppLayout.jsx", import.meta.url),
    "utf8",
);
const css = readCanonicalCss();
const index = fs.readFileSync(
    new URL("../src/index.css", import.meta.url),
    "utf8",
);
const failures = [];
const consolidatedCss =
    index.includes('@import "./styles/foundation.css";') &&
    index.includes('@import "./styles/app.css";');
for (const token of ["site-frame--workspace", "isAccountWorkspace"])
    if (!app.includes(token)) failures.push(`Thiếu layout contract: ${token}`);
if (app.includes("site-frame--public") || app.includes("site-frame--account"))
    failures.push("Không được tách shell sidebar theo route public/account");
for (const token of [
    "--marketplace-shell-width: 1280px",
    ".site-frame--workspace",
    ".account-grid{grid-template-columns:repeat(3",
    ".detail-card{position:sticky",
])
    if (!css.includes(token)) failures.push(`Thiếu UI contract: ${token}`);
if (
    !consolidatedCss &&
    (!index.includes(
        '@import "./styles/marketplace-account-presentation.css";',
    ) ||
        !index
            .trim()
            .endsWith(
                '@import "./styles/interaction-disclosure-owner.css";',
            ))
)
    failures.push("semantic UI system phải được giữ trước interaction owner");
if (failures.length) {
    console.error(failures.join("\n"));
    process.exit(1);
}
console.log("MBN UI contract OK");
