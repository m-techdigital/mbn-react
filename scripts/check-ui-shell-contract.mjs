import fs from "node:fs";

const read = (file) => fs.readFileSync(file, "utf8");
const assert = (condition, message) => {
    if (!condition) throw new Error(message);
};

const app = read("src/App.jsx");
const notifications = read("src/pages/NotificationsPage.jsx");
const detail = read("src/pages/GameDetailPage.jsx");
const documents = read("src/components/documents/TransactionDocuments.jsx");
const documentsPage = read("src/pages/DocumentsPage.jsx");
const compatibility = read("src/contracts/marketplaceContract.js");
const purchaseCss = read("src/styles/interaction-purchase-detail.css");
const documentCss = read("src/styles/mobile-documents-profile-modal.scss");

assert(app.includes('path="/account/transactions"'), "Thiếu route tương thích danh sách giao dịch.");
assert(app.includes('path="/account/transactions/:id"'), "Thiếu route tương thích chi tiết giao dịch.");
assert(notifications.includes("normalizeNotificationTarget"), "Thông báo chưa chuẩn hóa action_url cũ.");
assert(detail.includes("availability_status"), "Chi tiết sản phẩm chưa đọc availability_status canonical.");
assert(detail.includes("!isUnavailable"), "Chi tiết sản phẩm chưa ẩn action khi không khả dụng.");
assert(documents.includes("document-modal-download"), "Modal hồ sơ giao dịch thiếu tải PDF.");
assert(documentsPage.includes("document-modal-download"), "Modal thư viện hồ sơ thiếu tải PDF.");
assert(compatibility.includes("major contract mismatch"), "Contract compatibility chưa phân biệt major mismatch và drift bổ sung.");
assert(purchaseCss.includes("Customer transaction journey owner"), "Thiếu CSS owner cho bước tiếp theo/timeline.");
assert(documentCss.includes("generated template"), "Thiếu dark-surface guard cho HTML tài liệu.");

console.log("MBN UI shell contract: PASS");
