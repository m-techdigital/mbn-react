import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const barrelPath = path.join(root, "src/services/repositories.js");
const ownerDir = path.join(root, "src/services/repositories");
const fail = (message) => {
    console.error(`Repository ownership check failed: ${message}`);
    process.exit(1);
};

const barrel = fs.readFileSync(barrelPath, "utf8");
const expectedOwners = [
    "auth.js",
    "marketplace.js",
    "content.js",
    "customer.js",
    "trust.js",
    "shared.js",
];
for (const file of expectedOwners) {
    if (!fs.existsSync(path.join(ownerDir, file))) fail(`missing ${file}`);
}

if (/api\.(get|post|put|delete|patch)\(/.test(barrel)) {
    fail("compatibility barrel must not own HTTP calls");
}
if (barrel.split("\n").length > 40) {
    fail("compatibility barrel is growing into a second repository owner");
}

const content = fs.readFileSync(path.join(ownerDir, "content.js"), "utf8");
for (const marker of [
    "transaction_statuses: payload?.transaction_statuses?.length",
    "marketplaceOptionFallback.transaction_statuses",
]) {
    if (!content.includes(marker))
        fail(`marketplace options contract missing ${marker}`);
}

console.log("Repository ownership check passed.");
