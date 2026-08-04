import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const readWithImports = (file, seen = new Set()) => {
    const absolute = path.resolve(file);
    if (seen.has(absolute) || !fs.existsSync(absolute)) return "";
    seen.add(absolute);
    const source = fs.readFileSync(absolute, "utf8");
    const directory = path.dirname(absolute);
    return source.replace(/@import\s+["']([^"']+)["'];?/g, (_, relative) => {
        if (!relative.startsWith(".")) return "";
        return readWithImports(path.resolve(directory, relative), seen);
    });
};

const walk = (directory) =>
    fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
        const absolute = path.join(directory, entry.name);
        if (entry.isDirectory()) return walk(absolute);
        return [absolute];
    });

const routeStyleRoots = () => {
    const roots = new Set([path.join(root, "src/index.css")]);
    for (const file of walk(path.join(root, "src")).filter((entry) => /\.(js|jsx)$/.test(entry))) {
        const source = fs.readFileSync(file, "utf8");
        const directory = path.dirname(file);
        for (const match of source.matchAll(/import\s+["']([^"']+\.(?:css|scss))["'];?/g)) {
            if (match[1].startsWith(".")) roots.add(path.resolve(directory, match[1]));
        }
    }
    return [...roots];
};

export const readCanonicalCss = () => {
    const seen = new Set();
    const raw = routeStyleRoots().map((file) => readWithImports(file, seen)).join("\n");
    const compact = raw.replace(/\s+/g, "");
    return `${raw}\n${compact}`;
};
