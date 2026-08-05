import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const failures = [];
const walkFiles = (directory, prefix = "") =>
    fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
        if ([".git", "node_modules", "dist", "build"].includes(entry.name)) return [];
        const relative = path.posix.join(prefix, entry.name);
        const absolute = path.join(directory, entry.name);
        return entry.isDirectory() ? walkFiles(absolute, relative) : [relative];
    });
const tracked = (() => {
    try {
        return execSync("git ls-files", { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] })
            .trim()
            .split(/\r?\n/)
            .filter(Boolean);
    } catch {
        return walkFiles(process.cwd());
    }
})();

const trackedExisting = tracked.filter((file) => fs.existsSync(file));

for (const file of trackedExisting) {
    if (/(^|[-_])v\d{2,}([-_.]|$)/i.test(path.basename(file))) {
        failures.push(
            `${file}: không dùng tên file đánh dấu V55/V66 hoặc version marker tạm.`,
        );
    }
}

for (const file of trackedExisting.filter((entry) => entry.startsWith("src/"))) {
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
    "src/styles/mobile-responsive-owner.scss",
    "src/styles/interaction-disclosure-owner.css",
    "src/styles/mobile-responsive-foundation.scss",
    "src/styles/shared-page-architecture.css",
    "src/styles/pages/content-editorial-pages.scss",
    "src/styles/components/common.css",
];

for (const file of importOnlyManifests) {
    const source = fs.readFileSync(file, "utf8");
    const nonImportRules = source
        .split(/\r?\n/)
        .filter((line) => line.trim())
        .filter((line) => !line.trim().startsWith("/*"))
        .filter((line) => !line.trim().startsWith("*"))
        .filter((line) => !line.trim().startsWith("@import"))
        .filter((line) => !line.trim().startsWith("@forward"));
    if (nonImportRules.length) {
        failures.push(
            `${file}: manifest chỉ được chứa @import/@forward, không chứa rule CSS.`,
        );
    }
}

const collectImportedStyles = (file, collected = new Set()) => {
    const source = fs.readFileSync(file, "utf8");
    const directory = path.dirname(file);
    for (const match of source.matchAll(/@(import|forward)\s+["']([^"']+)["'];?/g)) {
        if (!match[2].startsWith(".")) continue;
        const imported = path.normalize(path.join(directory, match[2]));
        const relative = imported.replaceAll("\\", "/");
        if (collected.has(relative)) continue;
        collected.add(relative);
        if (fs.existsSync(imported)) collectImportedStyles(imported, collected);
    }
    return collected;
};
const manifestedStyles = collectImportedStyles("src/styles/app.css");
const routeOwnedStyles = new Set();
for (const file of trackedExisting.filter((entry) => entry.startsWith("src/") && /\.(js|jsx)$/.test(entry))) {
    const source = fs.readFileSync(file, "utf8");
    const directory = path.dirname(file);
    for (const match of source.matchAll(/import\s+["']([^"']+\.(?:css|scss))["'];?/g)) {
        if (!match[1].startsWith(".")) continue;
        const imported = path.normalize(path.join(directory, match[1])).replaceAll("\\", "/");
        routeOwnedStyles.add(imported);
        if (fs.existsSync(imported)) collectImportedStyles(imported, routeOwnedStyles);
    }
}
for (const file of trackedExisting.filter(
    (entry) => entry.startsWith("src/styles/") && /\.(css|scss)$/.test(entry),
)) {
    const mustBeManifested =
        file.startsWith("src/styles/components/modal-") ||
        file.startsWith("src/styles/pages/content-") ||
        file.startsWith("src/styles/mobile-") ||
        file.startsWith("src/styles/interaction-");
    if (!mustBeManifested) continue;
    if (importOnlyManifests.includes(file)) continue;
    if (!manifestedStyles.has(file) && !routeOwnedStyles.has(file)) {
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


const pageOwners = [
    ["src/pages/PurchaseDetailPage.jsx", 700, ["usePurchaseDetailActions", "buildPurchaseMetrics"]],
    ["src/pages/ProductFormPage.jsx", 450, ["useProductForm"]],
    ["src/pages/PayoutPage.jsx", 520, ["usePayoutPage", "PayoutWithdrawalTable"]],
];
for (const [file, maxLines, owners] of pageOwners) {
    const source = fs.readFileSync(file, "utf8");
    if (source.split(/\r?\n/).length > maxLines) {
        failures.push(`${file}: page owner exceeds ${maxLines} lines.`);
    }
    for (const owner of owners) {
        if (!source.includes(owner)) failures.push(`${file}: missing owner ${owner}.`);
    }
}

for (const file of [
    "src/hooks/marketplace/usePurchaseDetailActions.js",
    "src/hooks/marketplace/useProductForm.js",
    "src/hooks/marketplace/usePayoutPage.js",
    "src/components/account/PayoutWithdrawalTable.jsx",
    "src/data/knowledgeMeta.js",
]) {
    if (!fs.existsSync(file)) failures.push(`${file}: missing extracted semantic owner.`);
}

if (failures.length) {
    console.error(failures.join("\n"));
    process.exit(1);
}

console.log(
    "Maintainability guard passed: style manifests, detail owners and temp file names stay clean.",
);
