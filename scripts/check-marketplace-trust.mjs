import fs from 'node:fs';
const sources = [
  '../src/App.jsx','../src/config/navigation.js','../src/services/repositories.js','../src/pages/AccountTrustPage.jsx','../src/pages/GameDetailPage.jsx','../src/pages/PurchaseDetailPage.jsx','../src/components/account/TransactionReviewForm.jsx'
].map((path)=>fs.readFileSync(new URL(path,import.meta.url),'utf8')).join('\n');
const failures=[];
for(const token of ['/account/trust','trustRepository','productReviews','TransactionReviewForm','notification-preferences','Phiên đăng nhập']) if(!sources.includes(token)) failures.push(`Thiếu ${token}`);
if(failures.length){console.error(failures.join('\n'));process.exit(1)}
console.log('MBN marketplace trust contract OK');
