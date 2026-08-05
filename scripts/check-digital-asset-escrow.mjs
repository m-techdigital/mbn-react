import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8')
const required = [
    'src/pages/EscrowBoxCreatePage.jsx',
    'src/pages/EscrowBoxJoinPage.jsx',
    'src/pages/EscrowBoxesPage.jsx',
    'src/pages/EscrowBoxDetailPage.jsx',
    'src/pages/EscrowBoxTermsPage.jsx',
    'src/hooks/marketplace/useEscrowBoxForm.js',
    'src/hooks/marketplace/useEscrowBoxDetail.js',
    'src/styles/escrow-box.css',
]
for (const relative of required) {
    if (!fs.existsSync(path.join(root, relative))) throw new Error(`Missing MBN escrow box owner: ${relative}`)
}
const repository = read('src/services/repositories/marketplace.js')
for (const token of ['/customer/escrow-boxes', '/join/${token}/claim', '/confirm-receipt', '/disputes']) {
    if (!repository.includes(token)) throw new Error(`MBN escrow repository missing ${token}`)
}
const createPage = read('src/pages/EscrowBoxCreatePage.jsx')
for (const forbidden of ['counterparty_username', 'initiator_role']) {
    if (createPage.includes(forbidden)) throw new Error(`Escrow Box must not ask for ${forbidden}`)
}
for (const token of ['Bên A', 'Bên B', 'link dùng một lần', 'BaseForm']) {
    if (!createPage.includes(token)) throw new Error(`Escrow Box create page missing ${token}`)
}
const joinPage = read('src/pages/EscrowBoxJoinPage.jsx')
for (const token of ['Đồng ý trở thành Bên B', 'không thể truy cập', 'escrowBoxRepository.claim']) {
    if (!joinPage.includes(token)) throw new Error(`Escrow Box join page missing ${token}`)
}
const stylesheetManifest = read('src/index.css')
if (!stylesheetManifest.includes('./styles/escrow-box.css')) throw new Error('Escrow Box CSS must be registered in the deterministic stylesheet manifest')
for (const page of ['src/pages/EscrowBoxCreatePage.jsx', 'src/pages/EscrowBoxJoinPage.jsx', 'src/pages/EscrowBoxesPage.jsx', 'src/pages/EscrowBoxDetailPage.jsx', 'src/pages/EscrowBoxTermsPage.jsx']) {
    if (/^import\s+[\"\'][^\"\']+\.(?:css|scss)[\"\'];?\s*$/m.test(read(page))) {
        throw new Error(`Escrow Box page must not side-effect import CSS: ${page}`)
    }
}
const contract = JSON.parse(read('src/contracts/marketplace-contract.json'))
if (contract.contract_version !== '2026-08-05.3' || !contract.capabilities?.private_escrow_box || !contract.capabilities?.escrow_box_private_optimized_media) {
    throw new Error('MBN marketplace contract is stale')
}
for (const legacy of ['src/pages/DirectEscrowCreatePage.jsx', 'src/hooks/marketplace/useDirectEscrowForm.js']) {
    if (fs.existsSync(path.join(root, legacy))) throw new Error(`Legacy direct escrow owner must not coexist: ${legacy}`)
}
console.log('MBN escrow box guard passed.')
