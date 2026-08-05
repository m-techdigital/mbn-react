import fs from "node:fs";
import path from "node:path";
const root = process.cwd();
const appPath = path.join(root, "src/styles/app.css");
const source = fs.readFileSync(appPath, "utf8");
const imports = [...source.matchAll(/@import\s+"\.\/([^"]+)";/g)].map(
    (match) => match[1],
);
const expected = [
    'layout/shell.css',
    'layout/navigation.css',
    'components/common.css',
    'components/forms.css',
    'components/motion.css',
    'typography.css',
    'readability.css',
    'feedback-form-alignment.css',
    'page-geometry-responsive-tables.css',
    'cross-page-behavior.css',
    'base-layout-foundation.css',
    'base-layout-refinement.css',
    'canonical-page-owners.css',
    'shared-page-architecture.css',
    'marketplace-shell-header.scss',
    'marketplace-page-surfaces.scss',
    'marketplace-catalog-detail.scss',
    'marketplace-responsive.scss',
    'interaction-customer-shell.css',
    'mobile-responsive-owner.scss',
    'mobile-compact-density.scss',
    'presentation-density.css',
    'experience-feedback.css',
    'accessibility-route-experience.css',
    'interaction-hierarchy.css',
    'interaction-form-control-owner.css',
    'interaction-form-modal-resilience.css',
    'interaction-detail-safeguards.css',
];
if (source.split(/\r?\n/).length > 80)
    throw new Error("src/styles/app.css must remain an import-only manifest.");
if (JSON.stringify(imports) !== JSON.stringify(expected))
    throw new Error("src/styles/app.css import order or ownership changed.");
for (const relative of expected) {
    const owner = path.join(root, "src/styles", relative);
    if (
        !fs.existsSync(owner) ||
        fs.readFileSync(owner, "utf8").trim().length === 0
    )
        throw new Error(`Missing or empty canonical style owner: ${relative}`);
}
const deterministicIndex = fs.readFileSync(path.join(root, "src/index.css"), "utf8");
const deterministicOwners = [
    "./styles/pages/home.css",
    "./styles/pages/catalog.css",
    "./styles/pages/detail.css",
    "./styles/mobile-home-page-shell.scss",
    "./styles/mobile-catalog-detail.scss",
    "./styles/pages/payout.scss",
    "./styles/marketplace-finance.css",
    "./styles/interaction-purchase-detail.css",
    "./styles/customer-account.css",
    "./styles/marketplace-account-presentation.css",
    "./styles/account-privacy-upload.css",
    "./styles/profile-security-motion.css",
    "./styles/form-table-document-polish.css",
    "./styles/profile-controls-motion.css",
    "./styles/mobile-route-polish.scss",
    "./styles/mobile-table-resilience.scss",
];
for (const owner of deterministicOwners) {
    if (!deterministicIndex.includes(`@import "${owner}";`)) {
        throw new Error(`src/index.css missing deterministic style owner ${owner}`);
    }
}
for (const file of [
    "src/pages/HomePage.jsx",
    "src/pages/GameListPage.jsx",
    "src/pages/GameDetailPage.jsx",
    "src/pages/PayoutPage.jsx",
    "src/pages/PurchaseDetailPage.jsx",
    "src/components/account/AccountRouteShell.jsx",
]) {
    const routeSource = fs.readFileSync(path.join(root, file), "utf8");
    if (/^import\s+["'][^"']+\.(?:css|scss)["'];?\s*$/m.test(routeSource)) {
        throw new Error(`${file} must not create route-order CSS side effects`);
    }
}
console.log(`Style ownership valid: ${expected.length} ordered owners.`);
