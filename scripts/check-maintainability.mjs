import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const failures = [];
const tracked = execSync("git ls-files", { encoding: "utf8" })
    .trim()
    .split(/\r?\n/)
    .filter(Boolean);

for (const file of tracked) {
    if (/(^|[-_])v\d{2,}([-_.]|$)/i.test(path.basename(file))) {
        failures.push(
            `${file}: không dùng tên file đánh dấu V55/V66 hoặc version marker tạm.`,
        );
    }
}

for (const file of tracked.filter((entry) => entry.startsWith("src/"))) {
    if (!/\.(js|jsx|ts|tsx|json)$/.test(file)) continue;
    const source = fs.readFileSync(file, "utf8");
    if (
        /\b(company_id|department_id|change_department|assign_role|manage_organization|change_manager|payroll|accounting|reports|crm|reservation|opportunity|inventory|employee|employees|attendance|payslip|salary|recruitment|resignation|onboarding|offboarding)\b/i.test(
            source,
        )
    ) {
        failures.push(
            `${file}: Mini customer app không được giữ parent-only runtime scope.`,
        );
    }
}

const importOnlyManifests = [
    "src/styles/app.css",
    "src/styles/components/modals.css",
    "src/styles/pages/content.css",
    "src/styles/mobile-responsive-owner.css",
    "src/styles/interaction-responsive-disclosure.css",
    "src/styles/mobile-responsive-foundation.css",
    "src/styles/shared-page-architecture.css",
    "src/styles/pages/content-editorial-pages.css",
    "src/styles/components/common.css",
];

for (const file of importOnlyManifests) {
    const source = fs.readFileSync(file, "utf8");
    const nonImportRules = source
        .split(/\r?\n/)
        .filter((line) => line.trim())
        .filter((line) => !line.trim().startsWith("/*"))
        .filter((line) => !line.trim().startsWith("*"))
        .filter((line) => !line.trim().startsWith("@import"));
    if (nonImportRules.length) {
        failures.push(
            `${file}: manifest chỉ được chứa @import, không chứa rule CSS.`,
        );
    }
}

const collectImportedStyles = (file, collected = new Set()) => {
    const source = fs.readFileSync(file, "utf8");
    const directory = path.dirname(file);
    for (const match of source.matchAll(/@import\s+["']([^"']+)["'];?/g)) {
        if (!match[1].startsWith(".")) continue;
        const imported = path.normalize(path.join(directory, match[1]));
        const relative = imported.replaceAll("\\", "/");
        if (collected.has(relative)) continue;
        collected.add(relative);
        if (fs.existsSync(imported)) collectImportedStyles(imported, collected);
    }
    return collected;
};
const manifestedStyles = collectImportedStyles("src/styles/app.css");
for (const file of tracked.filter(
    (entry) => entry.startsWith("src/styles/") && /\.(css|scss)$/.test(entry),
)) {
    const mustBeManifested =
        file.startsWith("src/styles/components/modal-") ||
        file.startsWith("src/styles/pages/content-") ||
        file.startsWith("src/styles/mobile-") ||
        file.startsWith("src/styles/interaction-");
    if (!mustBeManifested) continue;
    if (importOnlyManifests.includes(file)) continue;
    if (!manifestedStyles.has(file)) {
        failures.push(
            `${file}: style owner chưa được nối vào app.css hoặc manifest con.`,
        );
    }
}

const detail = fs.readFileSync("src/pages/GameDetailPage.jsx", "utf8");
if (detail.split(/\r?\n/).length > 900) {
    failures.push(
        "src/pages/GameDetailPage.jsx: page detail không được phình lại quá 900 dòng.",
    );
}
for (const needle of ["useGamePurchaseFlow(", "GameDetailGallery"]) {
    if (!detail.includes(needle)) {
        failures.push(
            `src/pages/GameDetailPage.jsx: thiếu owner contract ${needle}.`,
        );
    }
}
for (const file of [
    "src/components/marketplace/GameDetailGallery.jsx",
    "src/hooks/marketplace/useGamePurchaseFlow.js",
]) {
    if (!fs.existsSync(file)) {
        failures.push(`${file}: thiếu owner đã tách khỏi GameDetailPage.`);
    }
}

if (failures.length) {
    console.error(failures.join("\n"));
    process.exit(1);
}

console.log(
    "Maintainability guard passed: style manifests, detail owners and temp file names stay clean.",
);
