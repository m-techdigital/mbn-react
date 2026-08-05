import fs from "node:fs";

const read = (path) => fs.readFileSync(path, "utf8");
const css = read("src/styles/ui-shell-canonical.css");
const header = read("src/components/layout/Header.jsx");
const bottom = read("src/components/layout/BottomNav.jsx");
const layout = read("src/components/layout/AppLayout.jsx");
const navigation = read("src/config/navigation.js");
const shared = read("src/components/layout/AccountNavigationContent.jsx");
const sidebar = read("src/components/layout/AccountSidebar.jsx");
const index = read("src/index.css");

const requirements = [
    [index.includes('@import "./styles/ui-shell-canonical.css";'), "canonical shell owner is not imported"],
    [index.indexOf("ui-shell-canonical.css") < index.indexOf("form-controls.css"), "canonical shell must load before form owner"],
    [css.includes("margin: var(--mbn-header-mobile) 0 0 !important"), "mobile header offset is not owned exactly once"],
    [css.includes("grid-template-rows: 56px minmax(0, 1fr)"), "drawer is not split into fixed head and scroll viewport"],
    [css.includes(".mobile-menu-scroll") && css.includes("overflow-y: auto !important"), "drawer scroll viewport is missing"],
    [css.includes("touch-action: pan-y !important"), "drawer touch scrolling contract is missing"],
    [layout.includes("site-content-column") && layout.includes("<SiteFooter />"), "footer is not in the same content column as main"],
    [header.includes("<AccountNavigationContent") && sidebar.includes("<AccountNavigationContent"), "desktop and mobile account navigation do not share one component"],
    [shared.includes("account-navigation-balance") && shared.includes("formatMoney"), "shared account navigation does not expose canonical balance"],
    [bottom.includes('item.action === "game-catalog"'), "mobile account action does not open game catalog"],
    [navigation.includes('action: "game-catalog"'), "catalog action config is missing"],
    [!navigation.match(/match:\s*true/), "navigation match must not be boolean"],
    [navigation.includes('typeof item?.match === "function"'), "navigation matcher must fail closed"],
];

const failures = requirements.filter(([ok]) => !ok).map(([, message]) => message);
if (failures.length) {
    console.error(failures.join("\n"));
    process.exit(1);
}
console.log("[responsive-shell-canonical] PASS");
