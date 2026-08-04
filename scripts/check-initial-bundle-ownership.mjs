import fs from 'node:fs'

const read = (file) => fs.readFileSync(file, 'utf8')

const main = read('src/main.jsx')
const root = read('src/app/RootApp.jsx')
const appCss = read('src/styles/app.css')
const index = read('src/index.css')
const account = read('src/components/account/AccountRouteShell.jsx')
const failures = []

if (!main.includes('lazy(() => import("./app/RootApp"))')) {
    failures.push('RootApp phải là lazy bootstrap owner.')
}
if (/from ["']antd/.test(main) || main.includes('ConfigProvider')) {
    failures.push('main.jsx không được kéo AntD runtime vào initial graph.')
}
for (const token of [
    'MbnThemeProvider',
    'BrowserRouter',
    'AuthProvider',
    '<App />',
]) {
    if (!root.includes(token)) failures.push(`RootApp thiếu ${token}`)
}
for (const routeStyle of [
    'pages/home.css',
    'pages/catalog.css',
    'pages/detail.css',
    'marketplace-account-presentation.css',
    'interaction-purchase-detail.css',
]) {
    if (appCss.includes(routeStyle))
        failures.push(`${routeStyle} không được quay lại global app.css`)
}
if (index.includes('customer-account.css')) {
    failures.push('customer-account.css không được quay lại initial index.css')
}
for (const token of [
    'customer-account.css',
    'form-controls.css',
    'account-privacy-upload.css',
    'profile-security-motion.css',
    'form-table-document-polish.css',
    'profile-controls-motion.css',
    'mobile-route-polish.scss',
    'mobile-table-resilience.scss',
]) {
    if (!account.includes(token))
        failures.push(`AccountRouteShell thiếu ${token}`)
}

for (const forbidden of [
    'account-privacy-upload.css',
    'profile-security-motion.css',
    'form-table-document-polish.css',
    'profile-controls-motion.css',
    'mobile-route-polish.scss',
    'mobile-table-resilience.scss',
]) {
    if (appCss.includes(forbidden)) {
        failures.push(`${forbidden} không được quay lại global app.css`)
    }
}
for (const [file, token] of [
    ['src/pages/HomePage.jsx', 'mobile-home-page-shell.scss'],
    ['src/pages/GameListPage.jsx', 'mobile-catalog-detail.scss'],
    ['src/pages/GameDetailPage.jsx', 'mobile-catalog-detail.scss'],
]) {
    if (!read(file).includes(token)) {
        failures.push(`${file} thiếu route mobile style ${token}`)
    }
}

if (failures.length) {
    console.error(failures.join('\n'))
    process.exit(1)
}
console.log('MBN initial bundle ownership PASS.')
