import fs from "node:fs";

const read = (path) => fs.readFileSync(path, "utf8");
const support = read("src/pages/SupportCasesPage.jsx");
const trust = read("src/pages/AccountTrustPage.jsx");
const listings = read("src/pages/MyProductsPage.jsx");
const table = read("src/components/base/ResponsiveDataTable.jsx");
const css = read("src/styles/customer-account.css");
const compactCss = css.replace(/\s+/g, "");
const index = read("src/index.css");
const accountShell = read("src/components/account/AccountRouteShell.jsx");
const failures = [];

if (support.indexOf("Gửi yêu cầu mới") > support.indexOf("Các yêu cầu đã gửi"))
    failures.push("Form tạo yêu cầu phải nằm trước bảng danh sách");
if (
    !support.includes("ResponsiveDataTable") ||
    !support.includes("support-cases-table")
)
    failures.push("Trung tâm yêu cầu phải dùng ResponsiveDataTable canonical");
if (!trust.includes("ResponsiveDataTable") || !trust.includes("sessions-table"))
    failures.push("Phiên đăng nhập phải dùng ResponsiveDataTable canonical");
if (listings.includes("Đăng tài khoản đầu tiên"))
    failures.push("Không được hiển thị CTA Đăng tài khoản đầu tiên");

for (const token of [
    'className="mbn-semantic-table"',
    "<thead>",
    "<tbody>",
    "<th",
    "<td",
]) {
    if (!table.includes(token))
        failures.push(
            `ResponsiveDataTable phải render table semantic thật: ${token}`,
        );
}
for (const token of [
    "overflow-x:auto",
    "table-layout:fixed",
    "@media(max-width:980px)",
    "width:max-content",
]) {
    if (!compactCss.includes(token.replace(/\s+/g, "")))
        failures.push(`Thiếu contract table mobile scroll ngang: ${token}`);
}
if (css.includes(".mbn-semantic-table thead{display:none"))
    failures.push("Không được ẩn header table trên mobile");
if (!accountShell.includes("customer-account.css"))
    failures.push("customer-account.css phải thuộc AccountRouteShell lazy owner");
if (index.includes("customer-account.css"))
    failures.push("customer-account.css không được quay lại initial index.css");

if (failures.length) {
    console.error(failures.join("\n"));
    process.exit(1);
}
console.log(
    "Customer tables contract passed: sessions, support cases and purchase lists use one semantic table with horizontal mobile scrolling.",
);
