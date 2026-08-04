import fs from 'node:fs'

const app = fs.readFileSync(new URL('../src/styles/app.css', import.meta.url), 'utf8')
const forbidden = [
    'modal-purchase-payment.css',
    'interaction-purchase-detail.css',
    'interaction-customer-shell.css',
    'customer-account.css',
    'content-route.scss',
]
const violations = forbidden.filter((owner) => app.includes(owner))
if (violations.length) {
    throw new Error(`Route-only styles leaked into global app.css: ${violations.join(', ')}`)
}
console.log('Global style boundary passed: route-only owners stay outside app.css.')
