import fs from "node:fs";

const walletPage = fs.readFileSync(
    new URL("../src/pages/WalletTransactionsPage.jsx", import.meta.url),
    "utf8",
);
const indexCss = fs.readFileSync(
    new URL("../src/index.css", import.meta.url),
    "utf8",
);
const accountShell = fs.readFileSync(
    new URL("../src/components/account/AccountRouteShell.jsx", import.meta.url),
    "utf8",
);
const accountCss = fs.readFileSync(
    new URL("../src/styles/customer-account.css", import.meta.url),
    "utf8",
);
const shellCss = fs.readFileSync(
    new URL("../src/styles/responsive-shell-owner.css", import.meta.url),
    "utf8",
);
const compactAccountCss = accountCss.replace(/\s+/g, "");
const compactShellCss = shellCss.replace(/\s+/g, "");
const forbidden = [
    "external_reference",
    "available_before",
    "held_before",
    "lifetime_credit",
    "lifetime_debit",
];
const leaked = forbidden.filter((field) => walletPage.includes(field));
if (leaked.length) {
    console.error(
        `Customer wallet UI exposes internal or unnecessary fields: ${leaked.join(", ")}`,
    );
    process.exit(1);
}
const accountImport = indexCss.indexOf("customer-account.css");
const formImport = indexCss.indexOf("form-controls.css");
if (accountImport < 0 || formImport < 0 || accountImport > formImport) {
    console.error(
        "index.css must load deterministic customer-account.css before final form-controls.css.",
    );
    process.exit(1);
}
if (/^import\s+["'][^"']+\.(?:css|scss)["'];?\s*$/m.test(accountShell)) {
    console.error("AccountRouteShell must not create route-order CSS side effects.");
    process.exit(1);
}
for (const contract of [
    ".site-frame--workspace",
    "overflow-x:clip",
    ".wallet-page__metrics",
]) {
    if (!compactAccountCss.includes(contract.replace(/\s+/g, ""))) {
        console.error(`Missing customer account layout contract: ${contract}`);
        process.exit(1);
    }
}
for (const contract of [
    "@media(min-width:769px)and(max-width:1180px)",
    "--mbn-sidebar-compact:224px",
    ".site-content-column",
]) {
    if (!compactShellCss.includes(contract.replace(/\s+/g, ""))) {
        console.error(`Missing canonical responsive shell contract: ${contract}`);
        process.exit(1);
    }
}
console.log("Customer visibility and account layout contract passed.");
