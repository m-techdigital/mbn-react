import fs from 'node:fs';

const requiredFiles = [
  'src/styles/mobile-system-v50.css',
  'src/components/layout/Header.jsx',
  'src/components/base/PageShell.jsx',
  'src/components/base/BaseFilter.jsx',
  'src/components/base/ResponsiveDataTable.jsx',
  'src/components/base/GamingModal.jsx',
];

const errors = [];
for (const file of requiredFiles) {
  if (!fs.existsSync(file)) errors.push(`Thiếu tệp mobile canonical: ${file}`);
}

const indexCss = fs.readFileSync('src/index.css', 'utf8');
if (!indexCss.includes('@import "./styles/app.css";') && !indexCss.includes('@import "./styles/mobile-system-v50.css";')) {
  errors.push('mobile-system-v50.css chưa được tải.');
}
if (!indexCss.includes('@import "./styles/app.css";') && (!indexCss.includes('@import "./styles/experience-system-v55.css";') || !indexCss.includes('@import "./styles/architecture-system-v56.css";') || !indexCss.includes('@import "./styles/ui-system-v62.css";') || !indexCss.trimEnd().endsWith('@import "./styles/interaction-system-v63.css";'))) {
  errors.push('Experience v55, architecture v56 và UI v62 phải được giữ; interaction v63 là owner cuối.');
}

const mobileCss = fs.readFileSync('src/styles/mobile-system-v50.css', 'utf8');
const requiredSelectors = [
  '.mobile-menu-panel',
  '.bottom-nav',
  '.mbn-page-header',
  '.mbn-page-section',
  '.mbn-filter-panel__fields',
  '.mbn-table__row',
  '.gaming-modal',
  '.account-grid',
  '.detail-layout',
  '.transaction-documents__list article',
];
for (const selector of requiredSelectors) {
  if (!mobileCss.includes(selector)) errors.push(`Thiếu quy tắc mobile cho ${selector}`);
}
if (!mobileCss.includes('font-size:16px!important')) {
  errors.push('Control mobile phải dùng cỡ chữ 16px để tránh iOS tự phóng to.');
}
if (!mobileCss.includes('repeat(4,minmax(0,1fr))')) {
  errors.push('Bottom navigation phải chia đúng 4 cột.');
}

const header = fs.readFileSync('src/components/layout/Header.jsx', 'utf8');
const navigation = fs.readFileSync('src/config/navigation.js', 'utf8');
for (const label of ['Biến động số dư', 'Hướng dẫn và an toàn', 'Điều khoản và chính sách']) {
  if (!navigation.includes(label)) errors.push(`Navigation owner thiếu mục: ${label}`);
}
if (!header.includes('Đăng xuất')) errors.push('Menu mobile thiếu Đăng xuất');

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log('Mobile UI contract OK: breakpoints, drawer, forms, tables, modal and navigation are canonical.');
