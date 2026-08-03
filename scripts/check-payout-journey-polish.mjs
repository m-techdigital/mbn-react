import fs from "node:fs";

const page = fs.readFileSync(
    new URL("../src/pages/PayoutPage.jsx", import.meta.url),
    "utf8",
);
const css = fs.readFileSync(
    new URL("../src/styles/app.css", import.meta.url),
    "utf8",
);
const payoutScss = fs.readFileSync(
    new URL("../src/styles/pages/payout.scss", import.meta.url),
    "utf8",
);
const customerOperationsScss = fs.readFileSync(
    new URL("../src/styles/pages/customer-operations.scss", import.meta.url),
    "utf8",
);

for (const marker of [
    "journey.next_action",
    "journey.blocked_reasons",
    "journey.steps",
]) {
    if (!page.includes(marker)) throw new Error(`PayoutPage thiếu ${marker}`);
}
for (const marker of [".payout-stepper", ".is-blocked"]) {
    if (!payoutScss.includes(marker))
        throw new Error(`Mobile polish thiếu ${marker}`);
}
if (!/min-height:\s*48px/.test(payoutScss)) {
    throw new Error("Mobile polish thiếu min-height 48px");
}
if (/\.payout-stepper|\.payout-account-list|\.payout-status-banner/.test(css)) {
    throw new Error("Payout CSS phải nằm trong src/styles/pages/payout.scss");
}
for (const marker of [
    ".deposit-overview-table__grid",
    ".simple-notification-list",
    ".wallet-page__metrics",
]) {
    if (!customerOperationsScss.includes(marker)) {
        throw new Error(`Customer operations SCSS thiếu ${marker}`);
    }
    if (css.includes(marker)) {
        throw new Error(`${marker} phải nằm trong customer-operations.scss`);
    }
}

console.log("payout journey/mobile polish contract: PASS");
