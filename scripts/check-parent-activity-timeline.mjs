import fs from 'node:fs'

const detail = fs.readFileSync('src/pages/EscrowBoxDetailPage.jsx', 'utf8')
const list = fs.readFileSync('src/pages/EscrowBoxesPage.jsx', 'utf8')
if (detail.includes('const eventLabels =') || list.includes('const eventLabels =')) {
    throw new Error('MBN must consume canonical event descriptions from API')
}
if (!detail.includes('event.description || event.event_type')) {
    throw new Error('MBN detail must consume canonical event description')
}

const contract = JSON.parse(fs.readFileSync('src/contracts/marketplace-contract.json', 'utf8'))
if (!contract.customer_endpoints?.includes('GET /customer/escrow-boxes/{escrowBox}/timeline')) {
    throw new Error('MBN marketplace contract must declare the customer Escrow Box timeline endpoint')
}

console.log('Parent activity timeline contract consumption: PASS')
