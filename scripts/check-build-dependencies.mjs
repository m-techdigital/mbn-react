import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const lockPath = path.join(root, 'package-lock.json');
const requiredLockEntries = [
  'node_modules/@vitejs/plugin-react',
  'node_modules/@rolldown/pluginutils',
  'node_modules/@tailwindcss/vite',
  'node_modules/vite',
];

function fail(message, details = []) {
  console.error(`[build-dependencies] ${message}`);
  for (const detail of details) console.error(`  - ${detail}`);
  console.error('\nKhắc phục canonical:');
  console.error('  rm -rf node_modules dist');
  console.error('  npm cache verify');
  console.error('  npm ci');
  console.error('\nKhông giải nén ZIP đè lên node_modules cũ và không dùng npm install để vá từng package.');
  process.exit(1);
}

if (!fs.existsSync(lockPath)) {
  fail('Thiếu package-lock.json. Không dùng npm install để tự tạo lockfile khác baseline.');
}

const lock = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
const missingLockEntries = requiredLockEntries.filter((entry) => !lock.packages?.[entry]);
if (missingLockEntries.length > 0) {
  fail('package-lock.json thiếu dependency build bắt buộc:', missingLockEntries);
}

const nodeModulesPath = path.join(root, 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.log('[build-dependencies] node_modules chưa tồn tại; npm ci sẽ cài đúng dependency từ package-lock.json.');
  process.exit(0);
}

// Nạp từng module trong tiến trình con và buộc thoát ngay sau khi import thành công.
// Một số plugin Vite/Tailwind có thể giữ worker hoặc file watcher sống trong event loop;
// import trực tiếp trong checker sẽ khiến npm đứng dù dependency hoàn toàn hợp lệ.
const buildModules = ['vite', '@vitejs/plugin-react', '@tailwindcss/vite'];
const importFailures = [];

for (const moduleName of buildModules) {
  const probe = spawnSync(
    process.execPath,
    [
      '--input-type=module',
      '--eval',
      `import(${JSON.stringify(moduleName)})`
        + `.then(() => process.exit(0))`
        + `.catch((error) => { console.error(error?.stack || error); process.exit(1); })`,
    ],
    {
      cwd: root,
      encoding: 'utf8',
      timeout: 15000,
      stdio: ['ignore', 'pipe', 'pipe'],
    },
  );

  if (probe.error?.code === 'ETIMEDOUT') {
    importFailures.push(`${moduleName}: quá thời gian kiểm tra 15 giây`);
    continue;
  }

  if (probe.status !== 0) {
    const detail = (probe.stderr || probe.stdout || `exit ${probe.status}`).trim();
    importFailures.push(`${moduleName}: ${detail}`);
  }
}

if (importFailures.length > 0) {
  fail('node_modules không thể nạp dependency build:', importFailures);
}

console.log('[build-dependencies] PASS');
