import fs from 'node:fs'

const required = [
    'node_modules/vite/dist/node/chunks/node.js',
    'node_modules/react-dom/index.js',
    'node_modules/react-dom/cjs/react-dom.development.js',
    'node_modules/antd/package.json',
    'node_modules/@ant-design/icons/package.json',
]

if (!fs.existsSync('node_modules')) {
    console.error('node_modules chưa tồn tại. Chạy: rm -rf node_modules package-lock.json.tmp && npm ci')
    process.exit(1)
}

const missing = required.filter((file) => !fs.existsSync(file))
if (missing.length) {
    console.error('Dependency installation bị thiếu/hỏng:')
    for (const file of missing) console.error(` - ${file}`)
    console.error('Khắc phục: dừng Vite, chạy rm -rf node_modules node_modules/.vite dist && npm cache verify && npm ci')
    process.exit(1)
}

console.log('Dependency installation integrity: PASS')
