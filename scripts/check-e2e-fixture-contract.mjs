import fs from "node:fs";

const transactional = fs.readFileSync(new URL("./e2e-transactional-api.mjs", import.meta.url), "utf8");
const browser = fs.readFileSync(new URL("./e2e-browser-core.mjs", import.meta.url), "utf8");
const packageJson = JSON.parse(fs.readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const failures = [];

for (const code of ["NSO-0102", "NSO-0201", "NRO-0301"]) {
    if (!transactional.includes(code)) failures.push(`Transactional E2E thiếu fixture ${code}.`);
    if (!browser.includes(code)) failures.push(`Browser smoke thiếu route fixture ${code}.`);
}
for (const mutation of ["payment_method: \"wallet\"", "disputes", "seller_handover", "lessor_receive_return", "withdrawals", "documents/ensure"]) {
    if (!transactional.includes(mutation)) failures.push(`Transactional E2E thiếu mutation contract: ${mutation}.`);
}
if (!transactional.includes("MBN_E2E_ALLOW_MUTATION")) failures.push("Transactional E2E phải có mutation safety switch.");
if (!browser.includes("avatar upload persistence")) failures.push("Browser smoke phải kiểm tra avatar persistence.");
if (packageJson.scripts?.["e2e:transactional-api"] !== "node scripts/e2e-transactional-api.mjs") failures.push("Thiếu package script e2e:transactional-api.");

if (failures.length) {
    console.error(failures.join("\n"));
    process.exit(1);
}
console.log("E2E fixture contract passed: stable routes, mutations and safety switch are present.");
