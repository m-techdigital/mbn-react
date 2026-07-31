import fs from 'node:fs';
const css = fs.readFileSync(new URL('../src/styles/mobile-system-v50.css', import.meta.url), 'utf8');
const profile = fs.readFileSync(new URL('../src/pages/ProfilePage.jsx', import.meta.url), 'utf8');
const documents = fs.readFileSync(new URL('../src/pages/DocumentsPage.jsx', import.meta.url), 'utf8');
const transactionDocuments = fs.readFileSync(new URL('../src/components/documents/TransactionDocuments.jsx', import.meta.url), 'utf8');
const failures = [];
for (const token of [
  '.mbn-metric-grid{grid-template-columns:repeat(2,minmax(0,1fr))',
  '.mbn-payment-item__actions{grid-column:1/-1!important;display:grid!important;grid-template-columns:1fr 1fr',
  '.detail-action-grid{grid-template-columns:repeat(2,minmax(0,1fr))',
  '.purchase-detail-actions{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))',
  '.mbn-table-scroll{',
  '.mbn-table__head{display:grid!important',
]) {
  if (!css.includes(token)) failures.push(`Thiếu mobile polish contract: ${token}`);
}
if (!profile.includes('context="account"')) failures.push('Profile chưa dùng nhãn trạng thái theo ngữ cảnh khách hàng.');
if (!documents.includes('ResponsiveDataTable')) failures.push('Hồ sơ tài liệu chưa dùng bảng canonical.');
if (!transactionDocuments.includes('transaction-documents__attached-list')) failures.push('Tài liệu trong chi tiết giao dịch chưa dùng danh sách đính kèm responsive.');
if (failures.length) { console.error(failures.join('\n')); process.exit(1); }
console.log('Mobile route polish contract OK');
