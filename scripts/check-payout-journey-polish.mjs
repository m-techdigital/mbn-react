import fs from "node:fs";

const page = fs.readFileSync(
    new URL("../src/pages/PayoutPage.jsx", import.meta.url),
    "utf8",
);
const css = fs.readFileSync(
    new URL("../src/styles/app.css", import.meta.url),
    "utf8",
);

for (const marker of [
    "journey.next_action",
    "journey.blocked_reasons",
    "journey.steps",
]) {
    if (!page.includes(marker)) throw new Error(`PayoutPage thiếu ${marker}`);
}
for (const marker of [".payout-stepper .is-blocked"]) {
    if (!css.includes(marker)) throw new Error(`Mobile polish thiếu ${marker}`);
}
if (!/min-height:\s*48px/.test(css)) {
    throw new Error("Mobile polish thiếu min-height 48px");
}

console.log("payout journey/mobile polish contract: PASS");
