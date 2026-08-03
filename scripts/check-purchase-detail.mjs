import { readCanonicalCss } from "./lib-css-reader.mjs";
import fs from "node:fs";

const page = fs.readFileSync(
    new URL("../src/pages/PurchaseDetailPage.jsx", import.meta.url),
    "utf8",
);
const documents = fs.readFileSync(
    new URL(
        "../src/components/documents/TransactionDocuments.jsx",
        import.meta.url,
    ),
    "utf8",
);
const css = readCanonicalCss();

const checks = [
    [
        !page.includes("TransactionReviewForm"),
        "purchase detail must not render the transaction review form",
    ],
    [
        !page.includes("Các mốc đã xác nhận"),
        "duplicate checkpoint section must be removed",
    ],
    [
        page.includes("Thao tác tiếp theo"),
        "actions must be placed near the transaction status workspace",
    ],
    [page.includes("sortedPayments"), "payments must use canonical ordering"],
    [
        page.includes("Cần thanh toán") && page.includes("Đã xử lý"),
        "payments must be grouped by customer priority",
    ],
    [
        page.includes("transactionCode={transaction.code}"),
        "documents must be scoped and labelled by transaction",
    ],
    [
        documents.includes("Hồ sơ giao dịch"),
        "transaction documents must use attached transaction presentation",
    ],
    [
        documents.includes("transaction-documents__attached-list"),
        "documents must render compact attached cards instead of a wide table",
    ],
    [
        css.includes(".purchase-detail-action-section") &&
            css.includes(".transaction-document-card"),
        "purchase detail layout stylesheet is required",
    ],
];

const failed = checks
    .filter(([passed]) => !passed)
    .map(([, message]) => message);
if (failed.length) {
    console.error(`Purchase detail contract failed:\n- ${failed.join("\n- ")}`);
    process.exit(1);
}
console.log(
    "Purchase detail contract passed: documents, timeline, actions and payments follow the canonical customer flow.",
);
