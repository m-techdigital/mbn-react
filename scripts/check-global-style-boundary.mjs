import fs from 'node:fs'

const read = (file) => fs.readFileSync(new URL(`../${file}`, import.meta.url), 'utf8')
const app = read('src/styles/app.css')
const common = read('src/styles/components/common.css')
const gamingModal = read('src/components/base/GamingModal.jsx')
const purchaseModal = read('src/components/marketplace/GamePurchaseModal.jsx')
const forbidden = [
    'components/modals.css',
    'modal-purchase-payment.css',
    'interaction-purchase-detail.css',
    'interaction-customer-shell.css',
    'customer-account.css',
    'content-route.scss',
]
const violations = forbidden.filter((owner) => app.includes(owner))
if (violations.length)
    throw new Error(`Route-only styles leaked into global app.css: ${violations.join(', ')}`)
if (common.includes('common-purchase-modal.scss'))
    throw new Error('Purchase modal styles leaked into common global manifest')
if (!gamingModal.includes('styles/components/modals.css'))
    throw new Error('GamingModal must own modal styles')
if (!purchaseModal.includes('styles/components/common-purchase-modal.scss'))
    throw new Error('GamePurchaseModal must own purchase modal styles')
console.log('Global style boundary passed: modal and route-only owners stay demand-loaded.')
