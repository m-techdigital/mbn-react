import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8')
const assert = (condition, message) => {
    if (!condition) throw new Error(message)
}

const pageContracts = [
    ['src/pages/GameListPage.jsx', ['PageShell', 'loading={loading}', 'error={error}', 'EmptyState']],
    ['src/pages/GameDetailPage.jsx', ['PageShell', 'loading={loading}', 'error={error}', 'EmptyState', 'GamingButton']],
    ['src/pages/PurchaseDetailPage.jsx', ['PageShell', 'loading={loading}', 'error={error}', 'GamingButton']],
    ['src/pages/ProductFormPage.jsx', ['PageShell', 'BaseForm', 'BaseFormActions']],
    ['src/pages/PayoutPage.jsx', ['PageShell', 'loading={loading}', 'error={loadError}', 'ResponsiveDataTable']],
    ['src/pages/DocumentsPage.jsx', ['PageShell', 'loading={loading}', 'error={error}', 'ResponsiveDataTable']],
    ['src/pages/NotificationsPage.jsx', ['PageShell', 'EmptyState', 'GamingButton']],
]

for (const [file, markers] of pageContracts) {
    const source = file === 'src/pages/PayoutPage.jsx'
        ? [read(file), read('src/components/account/PayoutWithdrawalTable.jsx'), read('src/hooks/marketplace/usePayoutPage.js')].join('\n')
        : read(file)
    for (const marker of markers) {
        assert(source.includes(marker), `${file} thiếu UI owner chuẩn: ${marker}`)
    }
}

const baseFilter = read('src/components/base/BaseFilter.jsx')
const dataTable = read('src/components/base/ResponsiveDataTable.jsx')
const asyncContent = read('src/components/base/AsyncContent.jsx')
assert(baseFilter.includes('onReset'), 'BaseFilter phải giữ reset contract.')
assert(dataTable.includes('EmptyState'), 'ResponsiveDataTable phải sở hữu empty state.')
assert(asyncContent.includes('InlineNotice') && asyncContent.includes('PageSkeleton'), 'AsyncContent phải sở hữu loading/error state.')

console.log('Parent layout/UI parity gate: PASS')
