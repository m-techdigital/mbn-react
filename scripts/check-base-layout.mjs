import fs from "node:fs";
import path from "node:path";

const root = path.resolve("src");
const errors = [];
const walk = (dir) =>
    fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const full = path.join(dir, entry.name);
        return entry.isDirectory() ? walk(full) : [full];
    });
for (const file of walk(root).filter((item) => /\.(jsx|js)$/.test(item))) {
    const text = fs.readFileSync(file, "utf8");
    if (file.includes("/pages/") && text.includes("<table"))
        errors.push(`${file}: dùng bảng HTML trực tiếp`);
    if (file.includes("/pages/") && text.includes('className="page-heading'))
        errors.push(`${file}: tự dựng page heading thay vì PageShell`);
    if (text.includes('className="mbn-check-field"'))
        errors.push(`${file}: dùng checkbox riêng thay vì BaseChoice`);
}
if (errors.length) {
    console.error(errors.join("\n"));
    process.exit(1);
}
console.log("Base layout contract OK");
