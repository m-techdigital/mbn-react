import { readCanonicalCss } from "./lib-css-reader.mjs";
import fs from "node:fs";

const foundation = readCanonicalCss();
const shell = readCanonicalCss();
const loader = fs.readFileSync(
    new URL("../src/components/layout/FullScreenLoader.jsx", import.meta.url),
    "utf8",
);

const failures = [];
if (
    !foundation.includes("scrollbar-gutter:stable") ||
    !foundation.includes("overflow-y:scroll")
)
    failures.push(
        "The document must reserve a stable vertical scrollbar gutter.",
    );
if (
    !shell.includes(".page-shell--reading>.page-panel") ||
    !shell.includes(".page-shell--narrow>.page-panel")
)
    failures.push(
        "Reading and narrow variants must constrain the inner panel, not move the outer route frame.",
    );
if (
    !shell.includes(
        ".page-shell--wide,\n.page-shell--reading,\n.page-shell--narrow",
    )
)
    failures.push(
        "All PageShell variants must share the same outer width owner.",
    );
if (!/VITE_ROUTE_OVERLAY_DELAY_MS["']\s*,\s*260/.test(loader))
    failures.push(
        "Route overlay must not flash during fast route transitions.",
    );

if (failures.length) {
    console.error("Container stability contract failed:");
    failures.forEach((failure) => console.error(`- ${failure}`));
    process.exit(1);
}
console.log(
    "Container stability contract passed: route frames, scrollbars and fast transitions remain stable.",
);
