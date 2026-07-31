import fs from 'node:fs';
import path from 'node:path';

const roots = ['src/pages', 'src/components', 'src/data'];
const banned = [
  'Checklist', 'MOCK UI', 'API + FALLBACK', 'Reserved/Đã giữ chỗ',
  'QĐ TRẢ GÓP', 'QĐ ĐẶT CỌC', 'MUA NICK BẰNG QR', 'XEM NICK',
];

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

const failures = [];
for (const root of roots) {
  for (const file of walk(root).filter((file) => /\.(js|jsx)$/.test(file))) {
    const content = fs.readFileSync(file, 'utf8');
    for (const term of banned) if (content.includes(term)) failures.push(`${file}: ${term}`);
  }
}
if (failures.length) {
  console.error('Phát hiện thuật ngữ giao diện chưa Việt hóa:\n' + failures.join('\n'));
  process.exit(1);
}
console.log('Thuật ngữ giao diện đã được Việt hóa nhất quán.');
