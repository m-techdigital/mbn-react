import { readCanonicalCss } from "./lib-css-reader.mjs";
import fs from "node:fs";

const requiredFiles = [
    "src/styles/mobile-responsive-owner.scss",
    "src/components/layout/Header.jsx",
    "src/components/base/PageShell.jsx",
    "src/components/base/BaseFilter.jsx",
    "src/components/base/ResponsiveDataTable.jsx",
    "src/components/base/GamingModal.jsx",
];

const errors = [];
for (const file of requiredFiles) {
    if (!fs.existsSync(file))
        errors.push(`Thiếu tệp mobile canonical: ${file}`);
}

const indexCss = fs.readFileSync("src/index.css", "utf8");
if (
    !indexCss.includes('@import "./styles/app.css";') &&
    !indexCss.includes('@import "./styles/mobile-responsive-owner.scss";')
) {
    errors.push("mobile-responsive-owner.scss chưa được tải.");
}
if (
    !indexCss.includes('@import "./styles/app.css";') &&
    (!indexCss.includes('@import "./styles/experience-feedback.css";') ||
        !indexCss.includes(
            '@import "./styles/accessibility-route-experience.css";',
        ) ||
        !indexCss.includes(
            '@import "./styles/marketplace-account-presentation.css";',
        ) ||
        !indexCss
            .trimEnd()
            .endsWith(
                '@import "./styles/interaction-disclosure-owner.css";',
            ))
) {
    errors.push(
        "Experience, architecture và UI semantic owners phải tồn tại; interaction owner là lớp cuối.",
    );
}

const mobileCss = readCanonicalCss();
const requiredSelectors = [
    ".mobile-menu-panel",
    ".bottom-nav",
    ".mbn-page-header",
    ".mbn-page-section",
    ".mbn-filter-panel__fields",
    ".mbn-table__row",
    ".gaming-modal",
    ".account-grid",
    ".detail-layout",
    ".transaction-documents__list article",
];
for (const selector of requiredSelectors) {
    if (!mobileCss.includes(selector))
        errors.push(`Thiếu quy tắc mobile cho ${selector}`);
}
if (!mobileCss.includes("font-size:16px!important")) {
    errors.push(
        "Control mobile phải dùng cỡ chữ 16px để tránh iOS tự phóng to.",
    );
}
if (!mobileCss.includes("repeat(4,minmax(0,1fr))")) {
    errors.push("Bottom navigation phải chia đúng 4 cột.");
}

const header = fs.readFileSync("src/components/layout/Header.jsx", "utf8");
const navigation = fs.readFileSync("src/config/navigation.js", "utf8");
for (const label of [
    "Biến động số dư",
    "Hướng dẫn và an toàn",
    "Điều khoản và chính sách",
]) {
    if (!navigation.includes(label))
        errors.push(`Navigation owner thiếu mục: ${label}`);
}
if (!header.includes("Đăng xuất")) errors.push("Menu mobile thiếu Đăng xuất");

if (errors.length) {
    console.error(errors.join("\n"));
    process.exit(1);
}
console.log(
    "Mobile UI contract OK: breakpoints, drawer, forms, tables, modal and navigation are canonical.",
);
