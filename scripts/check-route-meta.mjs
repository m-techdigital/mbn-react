import fs from "node:fs";
const app = fs.readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");
const required = [
    "/",
    "/teamobi/ninja-school",
    "/teamobi/ngoc-rong",
    "/teamobi/avatar",
    "/topics",
    "/account/profile",
];
const missing = required.filter(
    (route) => !app.includes(`path=\"${route}\"`) && route !== "/",
);
if (missing.length) {
    console.error(`Missing required routes: ${missing.join(", ")}`);
    process.exit(1);
}
console.log(`Route contract OK: ${required.length} core routes are present.`);
