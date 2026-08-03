import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const readWithImports = (file, seen = new Set()) => {
    const absolute = path.resolve(file);
    if (seen.has(absolute)) return "";
    seen.add(absolute);
    const source = fs.readFileSync(absolute, "utf8");
    const directory = path.dirname(absolute);
    return source.replace(/@import\s+["']([^"']+)["'];?/g, (_, relative) => {
        if (!relative.startsWith(".")) return "";
        return readWithImports(path.resolve(directory, relative), seen);
    });
};

export const readCanonicalCss = () => {
    const raw = readWithImports(path.join(root, "src/styles/app.css"));
    const compact = raw.replace(/\s+/g, "");
    return `${raw}\n${compact}`;
};
