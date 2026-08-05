import { readCanonicalCss } from "./lib-css-reader.mjs";
import fs from "node:fs";
import path from "node:path";

const root = new URL("../", import.meta.url);
const index = fs.readFileSync(
    new URL("../src/index.css", import.meta.url),
    "utf8",
);
const css = readCanonicalCss();
const pageShell = fs.readFileSync(
    new URL("../src/components/base/PageShell.jsx", import.meta.url),
    "utf8",
);
const table = fs.readFileSync(
    new URL("../src/components/base/ResponsiveDataTable.jsx", import.meta.url),
    "utf8",
);
const failures = [];
const consolidatedCss =
    index.includes('@import "./styles/foundation.css";') &&
    index.includes('@import "./styles/app.css";');

if (
    !consolidatedCss &&
    (!index.includes('@import "./styles/experience-feedback.css";') ||
        !index.includes(
            '@import "./styles/accessibility-route-experience.css";',
        ) ||
        !index.includes(
            '@import "./styles/marketplace-account-presentation.css";',
        ) ||
        !index
            .trim()
            .endsWith(
                '@import "./styles/interaction-disclosure-owner.css";',
            ))
)
    failures.push(
        "Experience, architecture và UI semantic owners phải tồn tại; interaction owner là lớp cuối",
    );
for (const token of [
    "--control-height: 38px",
    ".mbn-table-scroll-hint",
    "@media(max-width:768px)",
    ".profile-page .mbn-page-columns--profile",
]) {
    if (!css.includes(token))
        failures.push(`Thiếu presentation contract: ${token}`);
}
if (!/const resolvedWidth = wide \? ["']wide["'] : width/.test(pageShell))
    failures.push("PageShell chưa tương thích legacy wide prop");
if (!table.includes("Vuốt ngang để xem đầy đủ bảng"))
    failures.push("Bảng chưa có hướng dẫn cuộn ngang trên mobile");

const pagesDir = new URL("../src/pages/", import.meta.url);
for (const name of fs.readdirSync(pagesDir)) {
    if (!name.endsWith(".jsx")) continue;
    const source = fs.readFileSync(new URL(name, pagesDir), "utf8");
    if (/<PageShell[^>]*\swide(?:\s|>)/.test(source))
        failures.push(`${name}: còn dùng wide prop thay vì width=\"wide\"`);
}

if (failures.length) {
    console.error(failures.join("\n"));
    process.exit(1);
}
console.log(
    "Presentation UI contract OK: desktop/mobile owners, page widths and horizontal tables are canonical.",
);
