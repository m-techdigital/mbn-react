import fs from "node:fs";
const index = fs.readFileSync(
    new URL("../src/index.css", import.meta.url),
    "utf8",
);
const css = fs.readFileSync(
    new URL("../src/styles/experience-feedback.css", import.meta.url),
    "utf8",
);
const table = fs.readFileSync(
    new URL("../src/components/base/ResponsiveDataTable.jsx", import.meta.url),
    "utf8",
);
const staticPage = fs.readFileSync(
    new URL("../src/pages/StaticPage.jsx", import.meta.url),
    "utf8",
);
const deposit = fs.readFileSync(
    new URL("../src/pages/DepositPage.jsx", import.meta.url),
    "utf8",
);
const profile = fs.readFileSync(
    new URL("../src/pages/ProfilePage.jsx", import.meta.url),
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
            .trimEnd()
            .endsWith(
                '@import "./styles/interaction-responsive-disclosure.css";',
            ))
)
    failures.push(
        "Experience v55, architecture v56 và UI v62 phải được giữ; interaction v63 là owner cuối.",
    );
for (const token of [
    ".mbn-action-group",
    ".mbn-table-scroll::before",
    ".deposit-payment-grid",
    ".guide-box .mbn-page-section__body",
]) {
    if (!css.includes(token)) failures.push(`Thiếu experience owner: ${token}`);
}
if (
    !table.includes("ResizeObserver") ||
    !table.includes("is-at-start") ||
    !table.includes("is-at-end")
)
    failures.push("ResponsiveDataTable chưa có trạng thái cạnh cuộn.");
if (
    !staticPage.includes("PageSection") ||
    !staticPage.includes('width="reading"')
)
    failures.push("StaticPage chưa dùng base reading layout.");
if (!deposit.includes("PageColumns") || !deposit.includes("StatusBadge"))
    failures.push("DepositPage chưa dùng base layout/status canonical.");
if (!profile.includes('context="account"'))
    failures.push("Profile chưa dùng status context account.");
if (failures.length) {
    console.error(failures.join("\n"));
    process.exit(1);
}
console.log("Experience UI contract OK");
