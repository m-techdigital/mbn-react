import fs from "node:fs";
const purchase = fs.readFileSync("src/pages/PurchaseDetailPage.jsx", "utf8");
const game = fs.readFileSync("src/pages/GameDetailPage.jsx", "utf8");
const purchaseFlow = fs.readFileSync(
    "src/hooks/marketplace/useGamePurchaseFlow.js",
    "utf8",
);
const deposit = fs.readFileSync("src/pages/DepositPage.jsx", "utf8");
const sidebar = fs.readFileSync(
    "src/components/layout/AccountSidebar.jsx",
    "utf8",
);
const failures = [];
if (!purchase.includes("Thông tin tài khoản trò chơi"))
    failures.push("Purchase detail must show game account essentials.");
if (
    purchase.includes("action === 'cancel'") ||
    purchase.includes("Hủy giao dịch")
)
    failures.push(
        "Customer purchase detail must not expose cancel transaction.",
    );
if (game.includes("UY TÍN NGƯỜI BÁN"))
    failures.push("Seller reputation block must be removed from game detail.");
if (
    !game.includes("recommendation-list-grid") ||
    game.includes("recommendation-arrow")
)
    failures.push(
        "Recommendations must use a normal list grid without slider arrows.",
    );
if (
    !purchaseFlow.includes('paymentMethod === "balance"') ||
    !purchaseFlow.includes("transactionRepository.submitPayment") ||
    !purchaseFlow.includes('payment_method: "wallet"')
)
    failures.push(
        "Instant wallet checkout must submit the first payable payment after transaction creation.",
    );
if (
    !deposit.includes("Danh sách yêu cầu nạp tiền") ||
    !deposit.includes("GamingModal")
)
    failures.push("Deposit requests must have a table and modal detail.");
if (!sidebar.includes("sidebar-profile__identity"))
    failures.push("Sidebar avatar and name must share one identity row.");
if (failures.length) {
    console.error(failures.join("\n"));
    process.exit(1);
}
console.log("Customer transaction experience contract passed.");
