import fs from 'node:fs'

const read = (file) => fs.readFileSync(new URL(`../${file}`, import.meta.url), 'utf8')
const app = read('src/styles/app.css')
const index = read('src/index.css')
const common = read('src/styles/components/common.css')
const gamingModal = read('src/components/base/GamingModal.jsx')
const purchaseModal = read('src/components/marketplace/GamePurchaseModal.jsx')

for (const owner of [
    'marketplace-shell-header.scss',
    'marketplace-page-surfaces.scss',
    'marketplace-catalog-detail.scss',
    'marketplace-responsive.scss',
    'interaction-customer-shell.css',
]) {
    if (!app.includes(owner))
        throw new Error(`Public first-load owner missing from app.css: ${owner}`)
}
if (common.includes('common-purchase-modal.scss'))
    throw new Error('Purchase modal styles leaked into common global manifest')
for (const owner of [
    './styles/components/modals.css',
    './styles/components/common-purchase-modal.scss',
    './styles/interaction-purchase-detail.css',
    './styles/customer-account.css',
    './styles/pages/content-route.scss',
]) {
    if (!index.includes(`@import "${owner}";`))
        throw new Error(`Deterministic stylesheet owner missing from index.css: ${owner}`)
}
for (const [file, source] of [
    ['GamingModal', gamingModal],
    ['GamePurchaseModal', purchaseModal],
]) {
    if (/^import\s+["'][^"']+\.(?:css|scss)["'];?\s*$/m.test(source))
        throw new Error(`${file} must not create route-order CSS side effects`)
}
console.log('Global style boundary passed: one deterministic stylesheet manifest owns cascade order.')
