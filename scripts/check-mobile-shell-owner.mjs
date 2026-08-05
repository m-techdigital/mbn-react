import fs from "node:fs";

const read = (path) => fs.readFileSync(path, "utf8");
const css = read("src/styles/mobile-shell-owner.css");
const indexCss = read("src/index.css");
const detail = read("src/pages/GameDetailPage.jsx");
const app = read("src/App.jsx");
const header = read("src/components/layout/Header.jsx");
const finalCss = read("src/styles/desktop-visual-shell-owner.css");
const documentsPage = read("src/pages/DocumentsPage.jsx");
const transactionDocuments = read("src/components/documents/TransactionDocuments.jsx");

const requirements = [
    [indexCss.includes('@import "./styles/mobile-shell-owner.css";') && indexCss.indexOf('@import "./styles/mobile-shell-owner.css";') < indexCss.indexOf('@import "./styles/form-controls.css";'), "mobile shell owner must load before the canonical form owner"],
    [css.includes("position: fixed") && css.includes("padding-top: var(--header-h)"), "fixed header must reserve content space"],
    [css.includes(".mobile-menu-links > :is(a, button)") && css.includes("grid-template-columns: 18px minmax(0, 1fr) 10px !important"), "mobile action/link navigation must share final geometry"],
    [css.includes(".gaming-modal__close") && css.includes("transform: translateY(-50%)"), "mobile modal close control must be vertically centered"],
    [css.includes(".floating-rail") && css.includes("display: grid !important"), "mobile floating rail must remain visible"],
    [css.includes(".purchase-next-action__hero") && css.includes(".purchase-journey-list li"), "transaction next-step and journey styling must be restored"],
    [css.includes(".account-footer") && css.includes("grid-template-columns: minmax(0, .9fr) minmax(0, 1.1fr)"), "mobile recommendation price/action row must stay horizontal"],
    [detail.includes('<Navigate to="/not-found" replace />') && !detail.includes("detail-unavailable-notice") && !detail.includes("Bạn có thể xem thông tin tham khảo"), "unavailable product detail must fail closed without rendering stale product information"],
    [app.includes('path="/not-found"'), "canonical unavailable route must exist"],
    [!header.includes('className="mobile-menu-links"') && header.includes('className="mobile-menu-scroll"'), "mobile drawer must avoid duplicating the four BottomNav destinations"],
    [indexCss.indexOf('@import "./styles/desktop-visual-shell-owner.css";') < indexCss.indexOf('@import "./styles/form-controls.css";') && indexCss.trim().endsWith('@import "./styles/form-controls.css";'), "desktop shell owner must load immediately before the canonical form owner"],
    [finalCss.includes("--header-h: 106px") && finalCss.includes("height: 42px !important"), "desktop fixed-header offset must equal the rendered 64px + 42px header"],
    [finalCss.includes(".desktop-nav > :is(a, button)") && finalCss.includes("min-width: 0 !important"), "desktop navigation links and catalog action must share one geometry"],
    [finalCss.includes("overflow: visible !important") && finalCss.includes(".account-sidebar::-webkit-scrollbar"), "account sidebar must not own a nested vertical scrollbar"],
    [!documentsPage.match(/document-table__actions[\s\S]{0,1800}Tải PDF/) && documentsPage.includes('className="document-modal-download"'), "document PDF download must live inside the modal, not the table row"],
    [!transactionDocuments.match(/transaction-document-card__actions[\s\S]{0,1200}Tải PDF/) && transactionDocuments.includes('className="document-modal-download"'), "transaction document PDF download must live inside the modal, not the card"],
    [finalCss.includes(".purchase-detail-sidebar") && finalCss.includes(".transaction-timeline li"), "purchase detail right rail must keep the canonical professional card layout"],
];

const failures = requirements.filter(([ok]) => !ok).map(([, message]) => message);
if (failures.length) {
    console.error("Mobile shell owner check failed:\n- " + failures.join("\n- "));
    process.exit(1);
}
console.log("Mobile shell owner check passed.");
