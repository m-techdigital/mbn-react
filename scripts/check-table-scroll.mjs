import { readCanonicalCss } from "./lib-css-reader.mjs";
import fs from "node:fs";
const component = fs.readFileSync(
    new URL("../src/components/base/ResponsiveDataTable.jsx", import.meta.url),
    "utf8",
);
const css = readCanonicalCss();
const docs = fs.readFileSync(
    new URL("../src/pages/DocumentsPage.jsx", import.meta.url),
    "utf8",
);
const txDocs = fs.readFileSync(
    new URL(
        "../src/components/documents/TransactionDocuments.jsx",
        import.meta.url,
    ),
    "utf8",
);
const errors = [];
for (const token of ["mbn-table-scroll", "minWidth = 720", 'tabIndex="0"'])
    if (!component.includes(token))
        errors.push(`ResponsiveDataTable thiếu ${token}`);
for (const token of [
    "overflow-x:auto",
    ".mbn-table__head{display:grid!important",
    ".mbn-table .is-fixed-right{position:sticky!important",
])
    if (!css.replace(/\s+/g, "").includes(token.replace(/\s+/g, "")))
        errors.push(`CSS bảng cuộn ngang thiếu ${token}`);
if (!docs.includes("minWidth={1020}"))
    errors.push("Hồ sơ tài liệu chưa đặt chiều rộng bảng desktop/mobile.");
if (!txDocs.includes("transaction-documents__attached-list"))
    errors.push("Tài liệu giao dịch chưa dùng danh sách đính kèm responsive.");
if (errors.length) {
    console.error(errors.join("\n"));
    process.exit(1);
}
console.log("Horizontal table contract OK");
