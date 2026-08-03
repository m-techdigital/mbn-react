import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8')
const assert = (condition, message) => {
    if (!condition) throw new Error(message)
}

const app = read('src/App.jsx')
const auth = read('src/services/repositories/auth.js')
const marketplace = read('src/services/repositories/marketplace.js')
const customer = read('src/services/repositories/customer.js')
const payout = [
    read('src/pages/PayoutPage.jsx'),
    read('src/components/account/PayoutWithdrawalTable.jsx'),
    read('src/hooks/marketplace/usePayoutPage.js'),
].join('\n')
const purchase = read('src/pages/PurchaseDetailPage.jsx')
const productForm = read('src/pages/ProductFormPage.jsx')

for (const route of ['/account/products/new', '/account/purchases/:id', '/account/payouts', '/account/documents']) {
    assert(app.includes(route), `Thiếu route hành trình khách hàng: ${route}`)
}
assert(auth.includes('/auth/customer/login'), 'Thiếu contract đăng nhập khách hàng.')
for (const contract of ['create:', 'submitPayment', 'openDispute']) {
    assert(marketplace.includes(contract), `Thiếu contract marketplace: ${contract}`)
}
assert(customer.includes('cancelWithdrawal'), 'Thiếu contract hủy payout phía khách hàng.')
assert(payout.includes('loading={loading}') && payout.includes('error={loadError}') && payout.includes('onReload={load}'), 'Payout phải truyền loading/error/retry qua PageShell owner canonical.')
assert(payout.includes('Hủy yêu cầu'), 'Payout thiếu action hủy khi còn chờ duyệt.')
assert(purchase.includes('TransactionDocuments'), 'Purchase detail thiếu document flow.')
assert(productForm.includes('BaseForm'), 'Đăng bán phải dùng form owner canonical.')

console.log('Customer core-flow E2E source gate: PASS')
