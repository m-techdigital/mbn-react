import fs from 'node:fs';
const files=['src/pages/PayoutPage.jsx','src/services/repositories.js','src/App.jsx','src/config/navigation.js'];
const text=files.map(f=>fs.readFileSync(new URL(`../${f}`,import.meta.url),'utf8')).join('\n');
const required=['/customer/payouts','/customer/seller-verification','/customer/payout-accounts','/customer/withdrawals','/account/payouts','Xác minh và rút tiền'];
const missing=required.filter(x=>!text.includes(x));
if(missing.length){console.error(`Thiếu payout flow: ${missing.join(', ')}`);process.exit(1);} console.log('MBN payout flow contract OK');
