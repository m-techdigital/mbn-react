import fs from "node:fs";
const read = (p) =>
    fs.readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const nav = read("src/config/navigation.js");
const app = read("src/App.jsx");
const wallet = read("src/pages/WalletTransactionsPage.jsx");
const payout = read("src/pages/PayoutPage.jsx");
const cases = read("src/pages/SupportCasesPage.jsx");
const footer = read("src/components/layout/SiteFooter.jsx");
const image = read("src/components/base/MarketplaceImage.jsx");
const checks = [
    [
        "support route",
        /to:\s*["']\/support["']/.test(nav) &&
            /path=["']\/support["']/.test(app),
    ],
    ["game modal action", /action:\s*["']game-catalog["']/.test(nav)],
    ["footer guides", footer.includes("contentHubGroups")],
    [
        "case detail",
        app.includes("/account/cases/:id") &&
            cases.includes("/account/cases/${row.id}"),
    ],
    [
        "wallet before balance",
        wallet.includes("balance_before") &&
            wallet.includes("pending_deposit_balance"),
    ],
    [
        "payout practical flow",
        payout.includes("payout-stepper") &&
            payout.includes("Số dư có thể rút"),
    ],
    ["avatar storage normalization", image.includes("normalizeMediaSource")],
];
const failed = checks.filter(([, ok]) => !ok);
if (failed.length) {
    console.error(failed.map(([n]) => `Missing: ${n}`).join("\n"));
    process.exit(1);
}
console.log("Customer experience contract passed.");
