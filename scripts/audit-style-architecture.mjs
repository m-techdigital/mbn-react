import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const stylesRoot = path.join(root, "src/styles");
const sourceRoots = ["src/components", "src/pages", "src/styles"];
const styleFiles = [];

const walk = (directory, visitor) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
        const fullPath = path.join(directory, entry.name);
        if (entry.isDirectory()) {
            walk(fullPath, visitor);
            continue;
        }
        visitor(fullPath);
    }
};

walk(stylesRoot, (file) => {
    if (/\.(css|scss)$/.test(file)) styleFiles.push(file);
});

const issueFiles = (pattern) =>
    styleFiles
        .filter((file) => pattern.test(path.basename(file)))
        .map((file) => path.relative(root, file));

const versionMatches = [];
for (const directory of sourceRoots) {
    walk(path.join(root, directory), (file) => {
        if (!/\.(css|scss|jsx|js)$/.test(file)) return;
        const source = fs.readFileSync(file, "utf8");
        const matches = source.match(
            /\b(?:mbn-)?v\d{2}\b|(?:^|["'\s.])[-_a-z0-9]*v\d{2}[-_a-z0-9]*|--[^;\s]*-v\d{2}/gi,
        );
        if (!matches) return;
        versionMatches.push({
            file: path.relative(root, file),
            tokens: [...new Set(matches)].slice(0, 8),
        });
    });
}

const directCssImports = [];
for (const directory of ["src/components", "src/pages"]) {
    walk(path.join(root, directory), (file) => {
        if (!/\.(jsx|js)$/.test(file)) return;
        const source = fs.readFileSync(file, "utf8");
        if (/^import\s+["'][^"']+\.(?:css|scss)["'];?\s*$/m.test(source)) {
            directCssImports.push(path.relative(root, file));
        }
    });
}

const report = {
    styleFileCount: styleFiles.length,
    temporaryOwnerFiles: issueFiles(/(?:^|[-_])(closure|regression|final)(?:[-_.]|$)/i),
    versionTokenFiles: versionMatches,
    directCssImports,
};

console.log(JSON.stringify(report, null, 2));

if (directCssImports.length > 0) {
    throw new Error("Route/component CSS side-effect imports must stay out of JSX.");
}

if (report.temporaryOwnerFiles.length > 0) {
    throw new Error(
        `Temporary style owner names are not allowed: ${report.temporaryOwnerFiles.join(", ")}`,
    );
}

if (report.versionTokenFiles.length > 0) {
    throw new Error(
        `Versioned CSS/class tokens are not allowed: ${report.versionTokenFiles
            .map((item) => item.file)
            .join(", ")}`,
    );
}
