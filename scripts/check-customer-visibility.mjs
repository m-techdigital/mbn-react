import fs from 'node:fs';

const walletPage = fs.readFileSync(new URL('../src/pages/WalletTransactionsPage.jsx', import.meta.url), 'utf8');
const indexCss = fs.readFileSync(new URL('../src/index.css', import.meta.url), 'utf8');
const accountCss = fs.readFileSync(new URL('../src/styles/customer-account.css', import.meta.url), 'utf8');
const forbidden = ['external_reference', 'available_before', 'held_before', 'lifetime_credit', 'lifetime_debit'];
const leaked = forbidden.filter((field) => walletPage.includes(field));
if (leaked.length) {
  console.error(`Customer wallet UI exposes internal or unnecessary fields: ${leaked.join(', ')}`);
  process.exit(1);
}
const accountImport = indexCss.indexOf('@import \"./styles/customer-account.css\";');
const formImport = indexCss.indexOf('@import \"./styles/form-controls.css\";');
if (accountImport < 0 || formImport < 0 || accountImport > formImport) {
  console.error('customer-account.css must load after app.css and before final form-controls.css.');
  process.exit(1);
}
for (const contract of ['.site-frame--account', 'overflow-x:clip', '.wallet-page__metrics', '@media (max-width:1180px)']) {
  if (!accountCss.includes(contract)) {
    console.error(`Missing customer account layout contract: ${contract}`);
    process.exit(1);
  }
}
console.log('Customer visibility and account layout contract passed.');
