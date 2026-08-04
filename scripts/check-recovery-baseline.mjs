import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'docs/release/recovery-baseline.json'), 'utf8'))
const failures = []
for (const file of manifest.critical_files) {
  if (!fs.existsSync(path.join(root, file))) failures.push(`Thiếu recovery owner: ${file}`)
}
const obsolete = ['src/styles/pages/content-route.css','src/styles/mobile-responsive-owner.css']
for (const file of obsolete) if (fs.existsSync(path.join(root,file))) failures.push(`Owner cũ đã được thay thế không được quay lại: ${file}`)
const contract = fs.readFileSync(path.join(root, 'src/contracts/marketplace-contract.json'))
const hash = createHash('sha256').update(contract).digest('hex')
if (hash !== manifest.contract_sha256) failures.push(`Contract hash lệch recovery baseline: ${hash}`)
if (failures.length) { console.error(failures.join('\n')); process.exit(1) }
console.log('Recovery baseline guard passed: MBN capabilities and semantic owners are intact.')
