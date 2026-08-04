import fs from "node:fs";
import path from "node:path";

const root = new URL("../", import.meta.url);
const read = (relative) => fs.readFileSync(new URL(relative, root), "utf8");
const failures = [];
const index = read("src/index.css");
const repositories = [
    "src/services/repositories.js",
    "src/services/repositories/shared.js",
    "src/services/repositories/marketplace.js",
    "src/services/repositories/customer.js",
    "src/services/repositories/trust.js",
]
    .map(read)
    .join("\n");
const pageShell = read("src/components/base/PageShell.jsx");
const accountShell = read("src/components/account/AccountRouteShell.jsx");

if (
    !index.includes('@import \"./styles/foundation.css\";') ||
    !index.includes('@import \"./styles/app.css\";') ||
    !index.includes('@import \"./styles/form-controls.css\";')
)
    failures.push(
        "CSS initial chưa dùng đúng foundation/app/base-primitives/form-controls owners.",
    );
if ((index.match(/@import/g) || []).length !== 5)
    failures.push(
        "index.css phải chỉ có Tailwind + foundation + app + base-primitives + form-controls.",
    );
if (!accountShell.includes("customer-account.css"))
    failures.push("Customer account styles phải thuộc lazy AccountRouteShell.");
for (const file of [
    "src/components/base/MarketplaceImage.jsx",
    "src/components/base/AsyncContent.jsx",
    "scripts/smoke-browser.sh",
    "scripts/smoke-visual.sh",
]) {
    if (!fs.existsSync(new URL(file, root)))
        failures.push(`Thiếu owner/runtime file: ${file}`);
}
if (!pageShell.includes("<AsyncContent"))
    failures.push("PageShell chưa dùng AsyncContent.");
if (
    !repositories.includes("invalidateAfter") ||
    !repositories.includes("invalidateQueries")
)
    failures.push("Mutation chưa invalidate query cache.");

const srcDir = new URL("src/", root);
const directImages = [];
const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(full);
        else if (
            /\.(jsx|js)$/.test(entry.name) &&
            entry.name !== "MarketplaceImage.jsx"
        ) {
            const source = fs.readFileSync(full, "utf8");
            if (/<img\b/.test(source))
                directImages.push(
                    path.relative(new URL(".", root).pathname, full),
                );
        }
    }
};
walk(srcDir.pathname);
if (directImages.length)
    failures.push(`Còn ảnh ngoài MarketplaceImage: ${directImages.join(", ")}`);

if (failures.length) {
    console.error(failures.join("\n"));
    process.exit(1);
}
console.log(
    "System contract OK: CSS, images, async state, cache invalidation and smoke tools are canonical.",
);
