import fs from 'node:fs';
const index = fs.readFileSync('src/index.css','utf8');
const css = [
  fs.readFileSync('src/styles/mobile-shell-owner.css','utf8'),
  fs.readFileSync('src/styles/ui-shell-canonical.css','utf8'),
].join('\n');
const required = [
  '@import "./styles/mobile-shell-owner.css";',
  'grid-template-columns: repeat(4, minmax(0, 1fr)) !important',
  'overflow-y: auto',
  'grid-column: 3 !important',
  '--header-h: 56px',
  'font-size: 12px',
];
for (const token of required) {
  if (!(index + '\n' + css).includes(token)) throw new Error(`Missing mobile density token: ${token}`);
}
if (index.indexOf('mobile-shell-owner.css') > index.indexOf('form-controls.css')) {
  throw new Error('mobile UX density owner must load before form-controls.css');
}
console.log('[mobile-density-owner] PASS');
