import fs from "node:fs";
const read = (path) => fs.readFileSync(new URL(path, import.meta.url), "utf8");
const app = read("../src/App.jsx");
const header = read("../src/components/layout/Header.jsx");
const sidebar = read("../src/components/layout/AccountSidebar.jsx");
const bottom = read("../src/components/layout/BottomNav.jsx");
const index = read("../src/index.css");
const failures = [];
const consolidatedCss =
    index.includes('@import "./styles/foundation.css";') &&
    index.includes('@import "./styles/app.css";');
const routeContracts = [
    [/lazy\(\(\) => import\(["']\.\/pages\//, "lazy page routes"],
    [
        /<Suspense fallback=\{<RouteLoadingFallback \/>\}>/,
        "route loading fallback",
    ],
    [/<RouteBoundary>/, "route boundary"],
];
for (const [pattern, label] of routeContracts)
    if (!pattern.test(app))
        failures.push(`App thiếu kiến trúc route: ${label}`);
for (const source of [header, sidebar, bottom])
    if (!source.includes("../../config/navigation"))
        failures.push("Navigation chưa dùng owner chung");
if ((header.match(/const navItems/g) || []).length)
    failures.push("Header còn khai báo navItems cục bộ");
if (
    !consolidatedCss &&
    (!index.includes(
        '@import "./styles/accessibility-route-experience.css";',
    ) ||
        !index.includes(
            '@import "./styles/marketplace-account-presentation.css";',
        ) ||
        !index
            .trim()
            .endsWith(
                '@import "./styles/interaction-disclosure-owner.css";',
            ))
)
    failures.push(
        "architecture and UI styles phải được giữ, interaction-system-v63 là owner cuối",
    );
if (
    !fs.existsSync(
        new URL("../src/components/system/RouteBoundary.jsx", import.meta.url),
    )
)
    failures.push("Thiếu RouteBoundary");
if (failures.length) {
    console.error(failures.join("\n"));
    process.exit(1);
}
console.log(
    "Architecture contract OK: lazy routes, error boundary and canonical navigation are active.",
);
