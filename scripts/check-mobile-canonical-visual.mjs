import fs from "node:fs";
const read = (file) => fs.readFileSync(file, "utf8");
const css = read("src/styles/ui-shell-canonical.css");
const forms = read("src/styles/form-controls.css");
const index = read("src/index.css");
const drawer = read("src/components/base/BaseDrawer.jsx");
const shared = read("src/components/layout/AccountNavigationContent.jsx");
const checks = [
  [index.includes('@import "./styles/ui-shell-canonical.css";'), "canonical mobile owner must be imported"],
  [index.indexOf('ui-shell-canonical.css') < index.indexOf('form-controls.css'), "shell owner must load before form owner"],
  [css.includes("margin: var(--mbn-header-mobile) 0 0 !important"), "mobile shell must have one header offset"],
  [css.includes("grid-template-rows: 56px minmax(0, 1fr)"), "drawer must have a constrained scroll row"],
  [css.includes("overflow-y: auto !important") && css.includes("touch-action: pan-y !important"), "drawer must be natively scrollable"],
  [!drawer.includes("onTouchMove=") && !drawer.includes("onWheel="), "BaseDrawer must not intercept scrolling"],
  [forms.includes("--mbn-form-control-height: 36px") && forms.includes("font-size: 12px !important"), "mobile form density must be owned by final form CSS"],
  [css.includes("--mbn-bottom-nav: 52px") && css.includes("font-size: 9px !important"), "bottom navigation must remain compact"],
  [css.includes(".site-footer") && css.includes("display: block !important"), "public footer must remain visible on mobile"],
  [shared.includes("account-navigation-links") && shared.includes("account-navigation-logout"), "shared account navigation component is incomplete"],
];
const failures = checks.filter(([ok]) => !ok).map(([, message]) => message);
if (failures.length) {
  console.error("[mobile-canonical-visual] FAIL");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log("[mobile-canonical-visual] PASS");
