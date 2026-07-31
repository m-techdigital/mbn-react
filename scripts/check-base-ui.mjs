import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('src');
const files = [];
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(jsx|js)$/.test(entry.name)) files.push(full);
  }
};
walk(root);

const violations = [];
for (const file of files) {
  const rel = path.relative(process.cwd(), file);
  const source = fs.readFileSync(file, 'utf8');
  if (rel.includes('components/base/')) continue;
  if (/<form\b/.test(source)) violations.push(`${rel}: dùng <form> trực tiếp thay vì BaseForm/BaseFilter`);
  if (/import\s*\{[^}]*\b(Form|Table|Modal)\b[^}]*\}\s*from\s*['"]antd['"]/.test(source)) violations.push(`${rel}: dùng Form/Table/Modal của Ant Design`);
  if (/<table\b|<thead\b|<tbody\b/.test(source)) violations.push(`${rel}: dùng bảng HTML trực tiếp thay vì ResponsiveDataTable`);
}

if (violations.length) {
  console.error('Phát hiện thành phần chưa dùng base UI:\n- ' + violations.join('\n- '));
  process.exit(1);
}
console.log('Base UI contract OK: form, bộ lọc, bảng và hộp thoại đã dùng thành phần canonical.');
