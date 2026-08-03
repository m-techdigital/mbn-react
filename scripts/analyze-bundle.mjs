import fs from "node:fs";
import path from "node:path";

const distRoot = path.resolve("dist");
const assetsRoot = path.join(distRoot, "assets");
const manifestPath = path.join(distRoot, ".vite", "manifest.json");
if (!fs.existsSync(assetsRoot)) {
    console.error("Chưa có dist/assets. Hãy chạy npm run build trước.");
    process.exit(2);
}
const rows = fs.readdirSync(assetsRoot)
    .filter((name) => /\.(js|css)$/.test(name))
    .map((name) => ({ name, bytes: fs.statSync(path.join(assetsRoot, name)).size }))
    .sort((a, b) => b.bytes - a.bytes);
const jsBudget = Number(process.env.MBN_BUNDLE_JS_CHUNK_BUDGET_KB || 500) * 1024;
const cssBudget = Number(process.env.MBN_BUNDLE_CSS_BUDGET_KB || 380) * 1024;
for (const row of rows) console.log(`${(row.bytes / 1024).toFixed(1).padStart(8)} KB  ${row.name}`);
const oversized = rows.filter((row) => row.name.endsWith(".css") ? row.bytes > cssBudget : row.bytes > jsBudget);
if (oversized.length) console.warn(`Cảnh báo: ${oversized.length} asset vượt bundle budget.`);

if (fs.existsSync(manifestPath)) {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    const entries = Object.entries(manifest).filter(([, item]) => item.isEntry);
    const visited = new Set();
    const files = new Set();
    const css = new Set();
    const visit = (key) => {
        if (!key || visited.has(key) || !manifest[key]) return;
        visited.add(key);
        const item = manifest[key];
        if (item.file) files.add(item.file);
        for (const value of item.css || []) css.add(value);
        for (const dependency of item.imports || []) visit(dependency);
    };
    for (const [key] of entries) visit(key);
    const bytes = (relative) => {
        const file = path.join(distRoot, relative);
        return fs.existsSync(file) ? fs.statSync(file).size : 0;
    };
    const initialJs = [...files].reduce((sum, file) => sum + bytes(file), 0);
    const initialCss = [...css].reduce((sum, file) => sum + bytes(file), 0);
    console.log(`\nInitial entry closure: ${(initialJs / 1024).toFixed(1)} KB JS + ${(initialCss / 1024).toFixed(1)} KB CSS`);
    console.log(`Initial files: ${[...files, ...css].join(", ") || "none"}`);
    const initialBudget = Number(process.env.MBN_INITIAL_JS_BUDGET_KB || 500) * 1024;
    if (initialJs > initialBudget) console.warn(`Cảnh báo initial JS vượt ${Math.round(initialBudget / 1024)} KB.`);
    if (process.env.BUNDLE_BUDGET_STRICT === "1" && (oversized.length || initialJs > initialBudget)) process.exit(1);
} else {
    console.warn("Thiếu dist/.vite/manifest.json; không đo được initial import closure.");
    if (process.env.BUNDLE_BUDGET_STRICT === "1" && oversized.length) process.exit(1);
}
