import { readCanonicalCss } from "./lib-css-reader.mjs";
import fs from "node:fs";

const css = readCanonicalCss();
const compactCss = css.replace(/\s+/g, "");
const header = fs.readFileSync(
    new URL("../src/components/layout/Header.jsx", import.meta.url),
    "utf8",
);
const shell = fs.readFileSync(
    new URL("../src/components/base/PageShell.jsx", import.meta.url),
    "utf8",
);

const required = [
    "--mbn-shell-max:1280px",
    "--mbn-shell-gutter:16px",
    ".header-brand-row,.desktop-nav",
    ".page-shell--compact,",
    ".page-shell--reading,",
    ".page-shell--standard,",
    ".page-shell--wide,",
    ".page-shell--full{",
    "width:min(var(--mbn-shell-max)",
    "page-shell>.page-panel",
];

const missing = required.filter((token) => !compactCss.includes(token));
if (
    !header.includes('className="header-brand-row"') ||
    !header.includes('className="desktop-nav"')
) {
    missing.push("canonical header/nav wrappers");
}
if (!shell.includes("page-shell--${normalizedWidth}")) {
    missing.push("canonical PageShell width class");
}
if (missing.length) {
    console.error(`Shell alignment contract failed: ${missing.join(", ")}`);
    process.exit(1);
}
console.log(
    "Shell alignment contract passed: header, navigation and all page widths share one horizontal frame.",
);
