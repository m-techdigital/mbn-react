import fs from 'node:fs';
const component = fs.readFileSync(new URL('../src/components/base/ResponsiveDataTable.jsx', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../src/styles/mobile-system-v50.css', import.meta.url), 'utf8');
const docs = fs.readFileSync(new URL('../src/pages/DocumentsPage.jsx', import.meta.url), 'utf8');
const txDocs = fs.readFileSync(new URL('../src/components/documents/TransactionDocuments.jsx', import.meta.url), 'utf8');
const errors = [];
for (const token of ['mbn-table-scroll', 'minWidth = 720', 'tabIndex="0"']) if (!component.includes(token)) errors.push(`ResponsiveDataTable thiếu ${token}`);
for (const token of ['overflow-x:auto', '.mbn-table__head{display:grid!important', '.mbn-table .is-fixed-right{position:sticky!important']) if (!css.includes(token)) errors.push(`CSS bảng cuộn ngang thiếu ${token}`);
if (!docs.includes('minWidth={1020}')) errors.push('Hồ sơ tài liệu chưa đặt chiều rộng bảng desktop/mobile.');
if (!txDocs.includes('minWidth={720}')) errors.push('Tài liệu giao dịch chưa đặt chiều rộng bảng.');
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log('Horizontal table contract OK');
