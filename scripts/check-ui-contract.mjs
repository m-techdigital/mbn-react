import fs from 'node:fs';
const app = fs.readFileSync(new URL('../src/components/layout/AppLayout.jsx', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../src/styles/ui-system-v62.css', import.meta.url), 'utf8');
const index = fs.readFileSync(new URL('../src/index.css', import.meta.url), 'utf8');
const failures = [];
const consolidatedCss = index.includes('@import "./styles/foundation.css";') && index.includes('@import "./styles/app.css";');
for (const token of ['site-frame--account', 'site-frame--public', 'isAccountWorkspace']) if (!app.includes(token)) failures.push(`Thiếu layout contract: ${token}`);
for (const token of ['--mbn-v62-shell:1280px', '.site-frame--account', '.account-grid{grid-template-columns:repeat(3', '.detail-card{position:sticky']) if (!css.includes(token)) failures.push(`Thiếu UI contract: ${token}`);
if (!consolidatedCss && (!index.includes('@import "./styles/ui-system-v62.css";') || !index.trim().endsWith('@import "./styles/interaction-system-v63.css";'))) failures.push('ui-system-v62 phải được giữ trước interaction-system-v63');
if (failures.length) { console.error(failures.join('\n')); process.exit(1); }
console.log('MBN UI contract OK');
