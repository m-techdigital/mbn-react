import fs from "node:fs";
import path from "node:path";
const root = process.cwd();
const appPath = path.join(root, "src/styles/app.css");
const source = fs.readFileSync(appPath, "utf8");
const imports = [...source.matchAll(/@import\s+"\.\/([^"]+)";/g)].map(
    (match) => match[1],
);
const expected = [
    "layout/shell.css",
    "layout/navigation.css",
    "components/common.css",
    "components/forms.css",
    "components/modals.css",
    "components/modal-foundation.css",
    "components/modal-authentication.css",
    "components/modal-purchase-payment.css",
    "components/modal-admin-information.css",
    "components/modal-responsive-refinements.css",
    "components/motion.css",
    "pages/home.css",
    "pages/catalog.css",
    "pages/detail.css",
    "pages/content.css",
    "pages/content-core.scss",
    "pages/content-editorial-pages.scss",
    "pages/content-policy-pages.scss",
    "pages/content-safety-pages.scss",
    "pages/content-deposit-flow.scss",
    "typography.css",
    "readability.css",
    "marketplace-finance.css",
    "account-privacy-upload.css",
    "account-layout-polish.css",
    "profile-security-motion.css",
    "feedback-form-alignment.css",
    "page-geometry-responsive-tables.css",
    "form-table-document-polish.css",
    "cross-page-behavior.css",
    "base-layout-foundation.css",
    "base-layout-refinement.css",
    "canonical-page-owners.css",
    "shared-page-architecture.css",
    "profile-controls-motion.css",
    "mobile-responsive-owner.scss",
    "mobile-responsive-foundation.scss",
    "mobile-compact-density.scss",
    "mobile-route-polish.scss",
    "mobile-table-resilience.scss",
    "presentation-density.css",
    "experience-feedback.css",
    "accessibility-route-experience.css",
    "marketplace-account-presentation.css",
    "interaction-customer-shell.css",
    "interaction-hierarchy.css",
    "interaction-form-control-owner.css",
    "interaction-form-modal-resilience.css",
    "interaction-detail-safeguards.css",
    "interaction-purchase-detail.css",
    "interaction-responsive-disclosure.css",
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
console.log(`Style ownership valid: ${expected.length} ordered owners.`);
