import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const sourceRoot = path.join(root, "src");
const allowedOwner = path.join(sourceRoot, "main.jsx");
const violations = [];

function walk(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
        const target = path.join(directory, entry.name);
        if (entry.isDirectory()) {
            walk(target);
            continue;
        }
        if (!/\.(?:js|jsx)$/.test(entry.name) || target === allowedOwner) continue;
        const source = fs.readFileSync(target, "utf8");
        if (/^import\s+["'][^"']+\.(?:css|scss)["'];?\s*$/m.test(source)) {
            violations.push(path.relative(root, target));
        }
    }
}

walk(sourceRoot);

const indexCss = fs.readFileSync(path.join(sourceRoot, "index.css"), "utf8");
const required = [
    "./styles/pages/home.css",
    "./styles/pages/catalog.css",
    "./styles/pages/detail.css",
    "./styles/pages/content-route.scss",
    "./styles/components/modals.css",
    "./styles/customer-account.css",
    "./styles/interaction-purchase-detail.css",
];
for (const stylesheet of required) {
    if (!indexCss.includes(`@import \"${stylesheet}\";`)) {
        violations.push(`src/index.css missing ${stylesheet}`);
    }
}

if (violations.length > 0) {
    console.error("Deterministic style manifest check failed:");
    for (const violation of violations) console.error(`- ${violation}`);
    process.exit(1);
}

console.log("Deterministic style manifest check passed.");
