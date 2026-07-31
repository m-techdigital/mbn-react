import fs from 'node:fs';
const profile = fs.readFileSync('src/pages/ProfilePage.jsx','utf8');
const shell = fs.readFileSync('src/components/base/PageShell.jsx','utf8');
const css = fs.readFileSync('src/styles/system-v46.css','utf8');
const failures = [];
if (!profile.includes('loadingVariant="profile"')) failures.push('ProfilePage chưa khai báo skeleton hồ sơ.');
if (!shell.includes('<AsyncContent') || !shell.includes('loadingVariant={loadingVariant}')) failures.push('PageShell chưa sở hữu AsyncContent/skeleton tải trang.');
if (!profile.includes('mbn-profile-summary')) failures.push('ProfilePage chưa dùng khối nhận diện canonical.');
if (!css.includes('--mbn-control-height:38px')) failures.push('Chiều cao control canonical chưa được khóa ở 38px.');
if (!css.includes('@keyframes mbn-v46-content-in')) failures.push('Thiếu animation nội dung canonical.');
if (!css.includes('@keyframes mbn-v46-shimmer')) failures.push('Thiếu shimmer skeleton canonical.');
if (failures.length) { console.error(failures.join('\n')); process.exit(1); }
console.log('Motion and compact-control contract OK.');
