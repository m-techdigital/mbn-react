import fs from 'node:fs';
const root = new URL('../', import.meta.url);
const index = fs.readFileSync(new URL('src/index.css', root), 'utf8');
const shell = fs.readFileSync(new URL('src/components/base/PageShell.jsx', root), 'utf8');
const filter = fs.readFileSync(new URL('src/components/base/BaseFilter.jsx', root), 'utf8');
const css = fs.readFileSync(new URL('src/styles/interaction-system-v63.css', root), 'utf8');
const failures = [];
const consolidatedCss = index.includes('@import "./styles/foundation.css";') && index.includes('@import "./styles/app.css";');
if (!consolidatedCss && !index.trim().endsWith('@import "./styles/interaction-system-v63.css";')) failures.push('interaction-system-v63.css phải được import cuối');
if (shell.includes('is-placeholder')) failures.push('PageShell vẫn còn placeholder controls');
if (!shell.includes('mbn-page-header__tools')) failures.push('PageShell thiếu vùng tools canonical');
if (!filter.includes('aria-expanded') || !filter.includes('matchMedia')) failures.push('BaseFilter thiếu progressive disclosure responsive');
for (const token of ['.mbn-filter__toggle', '.mbn-page-header__tools', '@media(min-width:769px)']) if (!css.includes(token)) failures.push(`Thiếu CSS contract: ${token}`);
if (failures.length) { console.error(failures.join('\n')); process.exit(1); }
console.log('Interaction hierarchy contract OK');
