import fs from "node:fs";
const required = [
    ["src/pages/ProfilePage.jsx", "PageSection"],
    ["src/pages/PurchasesPage.jsx", "ResponsiveDataTable"],
    ["src/pages/WalletTransactionsPage.jsx", "ResponsiveDataTable"],
    ["src/pages/PurchaseDetailPage.jsx", "PageSection"],
    ["src/pages/TopicPage.jsx", "PageSection"],
    ["src/pages/KnowledgePage.jsx", "PageSection"],
];
const errors = [];
for (const [file, token] of required) {
    const text = fs.readFileSync(file, "utf8");
    if (!text.includes(token)) errors.push(`${file} chưa dùng ${token}`);
}
const duplicatedLabelOwners = [
    ["src/pages/WalletTransactionsPage.jsx", "const statusLabel"],
    ["src/pages/PurchaseDetailPage.jsx", "const labels ="],
    ["src/pages/MyProductsPage.jsx", "const typeLabel"],
];
for (const [file, token] of duplicatedLabelOwners) {
    if (fs.readFileSync(file, "utf8").includes(token))
        errors.push(`${file} còn tự quản lý enum thay vì utils/labels`);
}
if (errors.length) {
    console.error(errors.join("\n"));
    process.exit(1);
}
console.log("Shared page architecture OK");
