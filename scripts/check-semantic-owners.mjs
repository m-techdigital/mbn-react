import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const failures = [];
const importModule = (relative) => import(pathToFileURL(path.join(root, relative)).href);

const purchase = await importModule("src/config/marketplace/purchaseDetail.js");
if (!purchase.actionablePaymentStatuses.has("pending")) {
    failures.push("purchase detail config: pending payment must stay actionable.");
}
if (purchase.comparePayments({ id: 2, status: "confirmed" }, { id: 1, status: "pending" }) <= 0) {
    failures.push("purchase detail config: actionable payments must sort first.");
}
const metrics = purchase.buildPurchaseMetrics({
    total_payable: "100000",
    service_fee: "1000",
    paid_amount: "50000",
    escrow_amount: "50000",
    released_amount: "0",
    refunded_amount: "0",
    transaction_type: "purchase",
});
if (!metrics.some((item) => item.label === "Tổng phải thanh toán")) {
    failures.push("purchase detail config: total payable metric is missing.");
}

const knowledge = await importModule("src/data/knowledgeMeta.js");
if (!knowledge.contentHubGroups.length || !knowledge.policySources.length) {
    failures.push("knowledge metadata: footer/hub metadata must stay in the lightweight owner.");
}

const pageContracts = [
    ["src/pages/PurchaseDetailPage.jsx", 700, ["usePurchaseDetailActions", "buildPurchaseMetrics"]],
    ["src/pages/ProductFormPage.jsx", 450, ["useProductForm"]],
    ["src/pages/PayoutPage.jsx", 520, ["usePayoutPage", "PayoutWithdrawalTable"]],
];
for (const [file, maxLines, owners] of pageContracts) {
    const source = fs.readFileSync(path.join(root, file), "utf8");
    const lines = source.split(/\r?\n/).length;
    if (lines > maxLines) failures.push(`${file}: ${lines} lines exceeds semantic owner budget ${maxLines}.`);
    for (const owner of owners) {
        if (!source.includes(owner)) failures.push(`${file}: missing semantic owner ${owner}.`);
    }
}

const contentRepository = fs.readFileSync(
    path.join(root, "src/services/repositories/content.js"),
    "utf8",
);
if (!contentRepository.includes('import("../../data/topicContent.js")') || !contentRepository.includes('loadDetailedTopics')) {
    failures.push("content repository: topic content loader must remain lazy-loaded.");
}
const topicLoader = fs.readFileSync(path.join(root, "src/data/topicContent.js"), "utf8");
if (!topicLoader.includes('import("./topics/topicGroup1.js")') || !topicLoader.includes('import("./topics/topicGroup3.js")')) {
    failures.push("topic content: subject groups must stay dynamically imported.");
}
const knowledgeLoader = fs.readFileSync(path.join(root, "src/data/knowledgeBase.js"), "utf8");
if (!knowledgeLoader.includes('loadKnowledgePage') || !knowledgeLoader.includes('import("./knowledge/knowledgeGroup1.js")')) {
    failures.push("knowledge content: route groups must stay dynamically imported.");
}
const mockData = fs.readFileSync(path.join(root, "src/data/mockData.js"), "utf8");
if (mockData.includes('from "./topicContent"')) {
    failures.push("mock data: topic content must not return to the initial bundle.");
}

const browserSmoke = fs.readFileSync(path.join(root, "scripts/e2e-browser-core.mjs"), "utf8");
for (const marker of ["avatar-e2e.png", "avatar persistence after re-login", "Mua ngay", "Thuê ngay", "Mua trả góp"]) {
    if (!browserSmoke.includes(marker)) failures.push(`browser smoke: missing ${marker}.`);
}
const rentalMoney = await importModule("src/utils/rentalMoney.js");
const rental = rentalMoney.rentalMoneyBreakdown({ rentalAmount: 120000, depositAmount: 300000, deductionAmount: 50000 });
if (rental.initialAmount !== 420000 || rental.refundableAmount !== 250000) failures.push("rental money: shared calculation contract is incorrect.");
for (const owner of ["src/styles/components/motion.css", "src/styles/experience-feedback.css"]) {
    const manifest = fs.readFileSync(path.join(root, owner), "utf8");
    if (!manifest.trim().startsWith("@import") || manifest.split(/\r?\n/).length > 8) failures.push(`${owner}: must remain an import-only manifest.`);
}


const payoutPage = fs.readFileSync(path.join(root, 'src/pages/PayoutPage.jsx'), 'utf8');
const payoutStatePanel = fs.readFileSync(path.join(root, 'src/components/account/PayoutStatePanel.jsx'), 'utf8');
if (!payoutPage.includes('PayoutStatePanel')) failures.push('payout: state panel owner is missing.');
for (const marker of ['Tiền đang được tạm giữ', 'tiền tạm giữ phải được hoàn', 'Tham chiếu chi trả']) {
    if (!payoutStatePanel.includes(marker)) failures.push(`payout state panel: missing ${marker}.`);
}
if (failures.length) {
    console.error(failures.join("\n"));
    process.exit(1);
}
console.log("Semantic owner guard passed: MBN page actions, content metadata and lazy data behavior are stable.");
