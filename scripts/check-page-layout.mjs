import fs from 'node:fs';
import path from 'node:path';

const pagesDir = path.resolve('src/pages');
const files = fs.readdirSync(pagesDir).filter((file) => file.endsWith('.jsx'));
const violations = [];
for (const file of files) {
  const source = fs.readFileSync(path.join(pagesDir, file), 'utf8');
  if (!source.includes('PageShell')) violations.push(`${file}: không sử dụng PageShell`);
  if (/<main\b[^>]*className=/.test(source)) violations.push(`${file}: tự dựng page root bằng <main>`);
  if (/className=["'`]page-heading["'`]/.test(source)) violations.push(`${file}: sử dụng page-heading legacy`);
}
if (violations.length) {
  console.error('Page layout contract failed:\n- ' + violations.join('\n- '));
  process.exit(1);
}
console.log(`Page layout contract passed: ${files.length} pages use canonical PageShell.`);
