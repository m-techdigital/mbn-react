import fs from "node:fs";
import path from "node:path";

const root = path.resolve("src");
const files = [];
const walk = (dir) =>
    fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
        const target = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(target);
        else if (/\.(jsx|js)$/.test(entry.name)) files.push(target);
    });
walk(root);

const errors = [];
for (const file of files) {
    const text = fs.readFileSync(file, "utf8");
    if (
        /import\s*\{[^}]*\b(Form|Table|Modal|Alert|Empty|Pagination|message)\b[^}]*\}\s*from\s*['"]antd['"]/.test(
            text,
        )
    ) {
        errors.push(
            `${path.relative(root, file)} còn dùng thành phần Ant Design thay cho base MBN.`,
        );
    }
    if (
        /\b(Completed|Pending|Returned|Cancelled|Invalid credentials|Coming Soon)\b/.test(
            text,
        )
    ) {
        errors.push(
            `${path.relative(root, file)} còn thuật ngữ hiển thị chưa Việt hóa.`,
        );
    }
}
if (errors.length) {
    console.error(errors.join("\n"));
    process.exit(1);
}
console.log(
    "UX/UI contract OK: trạng thái, thông báo và thành phần hiển thị đã dùng base canonical.",
);
