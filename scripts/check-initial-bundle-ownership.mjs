import fs from 'node:fs'

const read = (file) => fs.readFileSync(file, 'utf8')
const failures = []
const main = read('src/main.jsx')
const root = read('src/app/RootApp.jsx')
const appCss = read('src/styles/app.css')
const index = read('src/index.css')

if (!main.includes('lazy(() => import("./app/RootApp"))')) {
    failures.push('RootApp phải là lazy bootstrap owner.')
}
if (/from ["']antd/.test(main) || main.includes('ConfigProvider')) {
    failures.push('main.jsx không được kéo AntD runtime vào initial graph.')
}
for (const token of ['MbnThemeProvider', 'BrowserRouter', 'AuthProvider', '<App />']) {
    if (!root.includes(token)) failures.push(`RootApp thiếu ${token}`)
}

for (const publicOwner of [
    'marketplace-shell-header.scss',
    'marketplace-page-surfaces.scss',
    'marketplace-catalog-detail.scss',
    'marketplace-responsive.scss',
    'interaction-customer-shell.css',
]) {
    if (!appCss.includes(publicOwner)) {
        failures.push(`app.css thiếu public first-load owner ${publicOwner}`)
    }
}

// CSS cascade must be deterministic across lazy route transitions. Route modules may
// remain lazy, but every stylesheet is owned by index.css in one canonical order.
for (const style of [
    './styles/pages/home.css',
    './styles/pages/catalog.css',
    './styles/pages/detail.css',
    './styles/pages/content-route.scss',
    './styles/components/modals.css',
    './styles/customer-account.css',
    './styles/marketplace-account-presentation.css',
    './styles/interaction-purchase-detail.css',
    './styles/mobile-home-page-shell.scss',
    './styles/mobile-catalog-detail.scss',
]) {
    if (!index.includes(`@import "${style}";`)) {
        failures.push(`index.css thiếu deterministic owner ${style}`)
    }
}

for (const file of [
    'src/components/account/AccountRouteShell.jsx',
    'src/components/base/GamingModal.jsx',
    'src/components/marketplace/GamePurchaseModal.jsx',
    'src/pages/HomePage.jsx',
    'src/pages/GameListPage.jsx',
    'src/pages/GameDetailPage.jsx',
    'src/pages/PurchaseDetailPage.jsx',
]) {
    if (/^import\s+["'][^"']+\.(?:css|scss)["'];?\s*$/m.test(read(file))) {
        failures.push(`${file} không được side-effect import CSS theo route`)
    }
}

if (failures.length) {
    console.error(failures.join('\n'))
    process.exit(1)
}
console.log('MBN initial bundle ownership PASS.')
