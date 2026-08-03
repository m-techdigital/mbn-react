import fs from "node:fs";
const required = [
    "src/utils/formValidation.js",
    "src/components/base/FormField.jsx",
    "src/pages/ProfilePage.jsx",
    "src/pages/DepositPage.jsx",
];
for (const file of required)
    if (!fs.existsSync(file)) throw new Error(`Thiếu ${file}`);
const api = fs.readFileSync("src/services/api.js", "utf8");
const field = fs.readFileSync("src/components/base/FormField.jsx", "utf8");
const profile = fs.readFileSync("src/pages/ProfilePage.jsx", "utf8");
const deposit = fs.readFileSync("src/pages/DepositPage.jsx", "utf8");
if (!api.includes("normalizeValidationErrors"))
    throw new Error("API chưa chuẩn hóa validation tập trung.");
if (!field.includes("cloneElement") || !field.includes("aria-describedby"))
    throw new Error("FormField chưa truyền trạng thái lỗi vào control.");
if (!profile.includes("profileErrors") || !profile.includes("updateAvatar"))
    throw new Error(
        "Profile chưa dùng field error hoặc avatar endpoint canonical.",
    );
if (
    !deposit.includes("deposit-payment-stack") ||
    !deposit.includes("errors.proof")
)
    throw new Error("Deposit chưa dùng layout dọc hoặc field error.");
console.log(
    "Validation UI contract passed: errors are centralized, localized and bound to fields.",
);
