import fs from "node:fs";
const read = (file) => fs.readFileSync(file, "utf8");
const app = read("src/components/layout/AppLayout.jsx");
const sidebar = read("src/components/layout/AccountSidebar.jsx");
const shared = read("src/components/layout/AccountNavigationContent.jsx");
const products = read("src/pages/MyProductsPage.jsx");
const css = read("src/styles/ui-shell-canonical.css");
const requirements = [
 [app.includes("<AccountSidebar onAuth={openAuth} />"), "AppLayout must render one sidebar."],
 [sidebar.includes("AccountNavigationContent"), "Desktop sidebar must use the shared account navigation component."],
 [shared.includes("PUBLIC_SIDEBAR_ITEMS") && shared.includes("ACCOUNT_NAV_ITEMS"), "Shared navigation must switch data only by authentication state."],
 [products.includes('className="seller-products-create-link"'), "Create-product action must live in the list section."],
 [app.includes('className="site-frame site-frame--workspace"'), "All routes must use one workspace shell."],
 [css.includes("position: fixed !important") && css.includes("scrollbar-gutter: stable"), "Desktop sidebar must remain fixed with stable scrolling."],
 [css.includes("--mbn-shell-max: 1560px") && css.includes("left: max(0px, calc((100vw - var(--mbn-shell-max)) / 2))"), "Sidebar and header must share the same shell geometry."],
 [css.includes(".site-footer") && css.includes("width: 100% !important"), "Footer must use the same content column width as main."],
];
const failures = requirements.filter(([ok]) => !ok).map(([, message]) => message);
if (failures.length) { console.error(failures.map((x)=>`- ${x}`).join("\n")); process.exit(1); }
console.log("[desktop-shell] PASS");
