import fs from "node:fs";
const detail = fs.readFileSync("src/pages/PurchaseDetailPage.jsx", "utf8");
const journey = fs.readFileSync(
    "src/components/account/TransactionJourney.jsx",
    "utf8",
);
if (!detail.includes("TransactionJourney"))
    throw new Error("Purchase detail chưa dùng customer journey");
for (const key of ["next_action", "blocking_reasons", "workflow_checklist"])
    if (!journey.includes(key))
        throw new Error(`Customer journey thiếu ${key}`);
console.log("customer journey: PASS");
