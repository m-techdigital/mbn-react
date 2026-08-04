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
const compactAccountCss = accountCss.replace(/\s+/g, "");
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
const accountImport = accountShell.indexOf("customer-account.css");
const formImport = accountShell.indexOf("form-controls.css");
if (accountImport < 0 || formImport < 0 || accountImport > formImport) {
    console.error(
        "AccountRouteShell must load customer-account.css before final form-controls.css.",
    );
    process.exit(1);
}
if (indexCss.includes("customer-account.css")) {
    console.error("customer-account.css must remain outside the initial index.css graph.");
    process.exit(1);
}
for (const contract of [
    ".site-frame--account",
    "overflow-x:clip",
    ".wallet-page__metrics",
    "@media (max-width:1180px)",
]) {
    if (!compactAccountCss.includes(contract.replace(/\s+/g, ""))) {
        console.error(`Missing customer account layout contract: ${contract}`);
        process.exit(1);
    }
}
console.log("Customer visibility and account layout contract passed.");
