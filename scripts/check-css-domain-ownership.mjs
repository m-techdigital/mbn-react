import fs from "node:fs";
import path from "node:path";
const root = path.resolve("src/styles");
const manifests = {
    "mobile-responsive-foundation.scss": 7,
    "shared-page-architecture.css": 6,
    "pages/content-editorial-pages.scss": 5,
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

// Large presentation owners must remain import-only manifests so domain rules
// do not collapse back into one cross-page stylesheet.
for (const manifest of [
    "marketplace-account-presentation.css",
    "presentation-density.css",
]) {
    const text = fs.readFileSync(path.join(root, manifest), "utf8");
    const declarations = text
        .split("\n")
        .filter((line) => line.trim() && !line.trim().startsWith("@import"));
    if (declarations.length)
        throw new Error(`${manifest} phải là import-only manifest`);
}
console.log("Large presentation manifest ownership: PASS");
