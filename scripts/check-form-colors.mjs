import fs from 'node:fs';

const indexCss = fs.readFileSync('src/index.css', 'utf8');
const canonical = fs.readFileSync('src/styles/form-controls.css', 'utf8');
const password = fs.readFileSync('src/components/base/PasswordField.jsx', 'utf8');
const money = fs.readFileSync('src/components/base/MoneyInput.jsx', 'utf8');

const requiredTokens = [
  '--mbn-form-control-bg',
  '--mbn-form-control-text',
  '--mbn-form-control-placeholder',
  '--mbn-form-control-disabled-text',
  '--mbn-form-control-readonly-text',
];

const failures = [];
if (!indexCss.trimEnd().endsWith('@import "./styles/form-controls.css";')) {
  failures.push('form-controls.css must be the final stylesheet import');
}
for (const token of requiredTokens) {
  if (!canonical.includes(token)) failures.push(`missing canonical token ${token}`);
}
for (const contract of [':-webkit-autofill', '::placeholder', "[readonly]", ':disabled', 'select.mbn-control option', 'color-scheme: dark', '::-webkit-calendar-picker-indicator']) {
  if (!canonical.includes(contract)) failures.push(`missing state contract ${contract}`);
}
if (!password.includes('mbn-control mbn-control--password')) failures.push('PasswordField must use mbn-control');
if (!money.includes('mbn-control mbn-control--money')) failures.push('MoneyInput must use mbn-control');
if (!canonical.includes('--mbn-form-control-bg: #18131c')) failures.push('dark background token must remain canonical');
if (!canonical.includes('--mbn-form-control-text: #f8f3fb')) failures.push('white text token must remain canonical');

if (failures.length) {
  console.error('Form color contract failed:\n- ' + failures.join('\n- '));
  process.exit(1);
}
console.log('Form color contract passed: canonical controls own text, placeholder, state, option and autofill colors.');
