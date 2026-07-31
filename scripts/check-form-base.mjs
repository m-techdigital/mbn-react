import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('src');
const allowed = new Set([
  'components/base/BaseChoice.jsx',
  'components/base/BaseFilter.jsx',
  'components/base/BaseForm.jsx',
  'components/base/FormControls.jsx',
  'components/base/ImageUploadField.jsx',
  'components/base/MoneyInput.jsx',
  'components/base/MultiImageUploadField.jsx',
  'components/base/PasswordField.jsx',
]);
const violations = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(jsx|js)$/.test(entry.name)) {
      const rel = path.relative(root, full).replaceAll('\\', '/');
      if (allowed.has(rel)) continue;
      const source = fs.readFileSync(full, 'utf8');
      const tags = [...source.matchAll(/<(input|select|textarea|form)\b/g)].map((match) => match[1]);
      if (tags.length) violations.push(`${rel}: raw ${[...new Set(tags)].join(', ')}`);
    }
  }
}
walk(root);
if (violations.length) {
  console.error('Form base contract failed:\n' + violations.map((item) => `- ${item}`).join('\n'));
  process.exit(1);
}
console.log('Form base contract passed: all feature forms use canonical base components.');
