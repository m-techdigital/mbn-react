import fs from "node:fs";
const css = fs.readFileSync("src/styles/ui-shell-canonical.css", "utf8");
const mobile = fs.readFileSync("src/styles/mobile-document-catalog-owner.css", "utf8");
const header = fs.readFileSync("src/components/layout/Header.jsx", "utf8");
const documents = fs.readFileSync("src/pages/DocumentsPage.jsx", "utf8");
const index = fs.readFileSync("src/index.css", "utf8");
const failures = [];
const requireText = (text, needle, message) => { if (!text.includes(needle)) failures.push(message); };
requireText(css, "@media (max-width: 768px)", "Mobile shell breakpoint is not unified at 768px.");
requireText(css, ".mobile-menu-button", "Drawer trigger ownership is missing.");
requireText(css, ".mobile-menu-scroll", "Drawer scroll owner is missing.");
requireText(css, "overflow-y: auto", "Drawer is not vertically scrollable.");
requireText(mobile, ".document-mobile-list", "Responsive document cards are missing.");
requireText(header, 'className="mobile-menu-scroll"', "Header drawer does not render the scroll wrapper.");
requireText(documents, 'className="document-mobile-list"', "Documents page does not render responsive cards.");
requireText(index, '@import "./styles/ui-shell-canonical.css";', "Canonical shell is missing from deterministic manifest.");
if (failures.length) { console.error(failures.map((item) => `- ${item}`).join("\n")); process.exit(1); }
console.log("[mobile-adaptive-layout] PASS");
