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
const purchaseModal = fs.readFileSync(
    new URL(
        "../src/components/marketplace/GamePurchaseModal.jsx",
        import.meta.url,
    ),
    "utf8",
);
const purchasePolicy = fs.readFileSync(
    new URL(
        "../src/components/marketplace/PurchasePolicyPanel.jsx",
        import.meta.url,
    ),
    "utf8",
);

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
        !page.includes("TransactionDocuments"),
        "purchase detail must not embed issued legal documents that can be mistaken for the current transaction summary",
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
    [
        purchaseModal.includes("PurchasePolicyPanel"),
        "purchase modal policy must have a dedicated semantic owner",
    ],
    [
        !/hoàn lại\s*<b>?(?:20|30|50)%/i.test(purchasePolicy) &&
            purchasePolicy.includes("không áp dụng tỷ lệ cố định"),
        "purchase policy must not hard-code refund percentages outside the API contract",
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
    "Purchase detail contract passed: legal documents remain in their dedicated library; timeline, actions and payments follow the canonical customer flow.",
);
