import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve('src')
const failures = []
const walk = (directory) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
        const file = path.join(directory, entry.name)
        if (entry.isDirectory()) walk(file)
        else if (file.endsWith('.scss')) {
            const source = fs.readFileSync(file, 'utf8')
            if (/@import\s+["']/.test(source))
                failures.push(`${path.relative(process.cwd(), file)} còn dùng Sass @import`)
        }
    }
}
walk(root)
for (const file of [
    'src/styles/mobile-responsive-owner.scss',
    'src/styles/mobile-responsive-foundation.scss',
    'src/styles/pages/content-editorial-pages.scss',
    'src/styles/pages/content-route.scss',
]) {
    const source = fs.readFileSync(file, 'utf8')
    if (!source.includes('@forward'))
        failures.push(`${file} phải là Sass @forward manifest`)
}
if (failures.length) {
    console.error(failures.join('\n'))
    process.exit(1)
}
console.log('Sass module ownership PASS.')
