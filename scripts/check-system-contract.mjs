import fs from 'node:fs';
import path from 'node:path';

const root = new URL('../', import.meta.url);
const read = (relative) => fs.readFileSync(new URL(relative, root), 'utf8');
const failures = [];
const index = read('src/index.css');
const repositories = read('src/services/repositories.js');
const pageShell = read('src/components/base/PageShell.jsx');

if (!index.includes('@import \"./styles/foundation.css\";') || !index.includes('@import \"./styles/app.css\";') || !index.includes('@import \"./styles/customer-account.css\";') || !index.includes('@import \"./styles/form-controls.css\";')) failures.push('CSS chưa dùng các owner foundation/app/customer-account/form-controls.');
if ((index.match(/@import/g) || []).length !== 6) failures.push('index.css phải chỉ có Tailwind + foundation + app + customer-account + base-primitives + form-controls.');
for (const file of ['src/components/base/MarketplaceImage.jsx', 'src/components/base/AsyncContent.jsx', 'scripts/smoke-browser.sh', 'scripts/smoke-visual.sh']) {
  if (!fs.existsSync(new URL(file, root))) failures.push(`Thiếu owner/runtime file: ${file}`);
}
if (!pageShell.includes('<AsyncContent')) failures.push('PageShell chưa dùng AsyncContent.');
if (!repositories.includes('invalidateAfter') || !repositories.includes('invalidateQueries')) failures.push('Mutation chưa invalidate query cache.');

const srcDir = new URL('src/', root);
const directImages = [];
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(jsx|js)$/.test(entry.name) && entry.name !== 'MarketplaceImage.jsx') {
      const source = fs.readFileSync(full, 'utf8');
      if (/<img\b/.test(source)) directImages.push(path.relative(new URL('.', root).pathname, full));
    }
  }
};
walk(srcDir.pathname);
if (directImages.length) failures.push(`Còn ảnh ngoài MarketplaceImage: ${directImages.join(', ')}`);

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log('System contract OK: CSS, images, async state, cache invalidation and smoke tools are canonical.');
