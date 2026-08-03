import fs from "node:fs";
import path from "node:path";
const root = path.resolve("src/styles");
const manifests = {
    "mobile-responsive-foundation.css": 7,
    "shared-page-architecture.css": 6,
    "pages/content-editorial-pages.css": 5,
    "components/common.css": 6,
};
for (const [file, count] of Object.entries(manifests)) {
    const source = fs.readFileSync(path.join(root, file), "utf8");
    const imports = [...source.matchAll(/@import\s+['"][^'"]+['"];?/g)];
    if (imports.length !== count)
        throw new Error(`${file} phải là manifest ${count} owner`);
    const residue = source.replace(/@import\s+['"][^'"]+['"];?/g, "").trim();
    if (residue) throw new Error(`${file} không được chứa declaration runtime`);
}
console.log("CSS domain ownership contract: PASS");
