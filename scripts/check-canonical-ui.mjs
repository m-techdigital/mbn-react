import fs from "node:fs";
import path from "node:path";

const root = path.resolve("src");
const files = [];
const walk = (dir) => {
    for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, item.name);
        if (item.isDirectory()) walk(full);
        else if (/\.(jsx|js)$/.test(item.name)) files.push(full);
    }
};
walk(root);
const source = files
    .map((file) => `${file}\n${fs.readFileSync(file, "utf8")}`)
    .join("\n");
const forbidden = [
    [
        "header-notification-button",
        "Notification cũ còn được dùng trong component",
    ],
    [
        "heading-round-action",
        "Nút quay lại/tải lại cũ còn được dùng trong component",
    ],
    ["profile-settings-grid", "Bố cục hồ sơ cũ còn được dùng"],
    ["mbn-base-filter__", "Bộ lọc cũ còn được dùng trong component"],
];
const errors = forbidden.filter(([token]) => source.includes(token));
if (errors.length) {
    for (const [token, message] of errors)
        console.error(`${message}: ${token}`);
    process.exit(1);
}
console.log(
    "Canonical UI ownership OK: notification, page header, profile and filter use v44 owners.",
);
