import fs from 'node:fs';
const files=['src/components/account/AuthModal.jsx','src/pages/AccountTrustPage.jsx','src/services/repositories.js','src/contracts/marketplace-contract.json'];
const text=files.map(f=>fs.readFileSync(new URL(`../${f}`,import.meta.url),'utf8')).join('\n');
const required=['two_factor_required','two-factor/verify','security/two-factor/setup','security/two-factor/confirm','recovery-codes','Xác thực hai lớp'];
const missing=required.filter(x=>!text.includes(x)); if(missing.length){console.error(`Thiếu 2FA contract: ${missing.join(', ')}`);process.exit(1)} console.log('Two-factor authentication contract OK');
