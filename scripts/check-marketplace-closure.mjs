import fs from 'node:fs';
const files = {
  app: fs.readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8'),
  repo: fs.readFileSync(new URL('../src/services/repositories.js', import.meta.url), 'utf8'),
  detail: fs.readFileSync(new URL('../src/pages/PurchaseDetailPage.jsx', import.meta.url), 'utf8'),
  nav: fs.readFileSync(new URL('../src/config/navigation.js', import.meta.url), 'utf8'),
};
const failures=[];
for(const [name,token] of [['route','/account/cases'],['cases','openCase:'],['snapshots','storeSnapshot:'],['detail','TransactionAssetSnapshots'],['nav','Trung tâm yêu cầu']]){
  if(!Object.values(files).some((value)=>value.includes(token))) failures.push(`Thiếu ${name}: ${token}`);
}
if(failures.length){console.error(failures.join('\n'));process.exit(1)}
console.log('Marketplace closure UI contract OK');
