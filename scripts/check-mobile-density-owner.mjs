import fs from 'node:fs';
const index = fs.readFileSync('src/index.css','utf8');
const css = fs.readFileSync('src/styles/mobile-density-owner.css','utf8');
const required = [
  '@import "./styles/mobile-density-owner.css";',
  'grid-template-columns: repeat(4, minmax(0, 1fr))',
  'overflow-y: auto !important',
  'grid-column: 3 !important',
  '--header-h: 56px',
  'font-size: 12px !important',
];
for (const token of required) {
  if (!(index + '\n' + css).includes(token)) throw new Error(`Missing mobile density token: ${token}`);
}
if (index.indexOf('mobile-density-owner.css') > index.indexOf('form-controls.css')) {
  throw new Error('mobile UX density owner must load before form-controls.css');
}
console.log('[mobile-density-owner] PASS');
