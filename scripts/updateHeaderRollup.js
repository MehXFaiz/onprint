const fs = require('fs')
const path = require('path')

const headerPath = path.join(__dirname, '..', 'client', 'src', 'components', 'SiteHeader.jsx')
let header = fs.readFileSync(headerPath, 'utf8')

const rollupNavGroup = `  {
    key: 'signage',
    label: 'Rollup Banners & Signage',
    description: 'Retractable roll-up stands, pull-up banners & exhibition displays',
    icon: Layers,
    badge: 'Exhibition',
    keywords: ['banner', 'rollup', 'roll up', 'roll-up', 'pull up', 'stand', 'signage'],
  },`

if (!header.includes("'signage'")) {
  header = header.replace(
    /keywords:\s*\['mug',\s*'bottle'[\s\S]*?\],\s*\},/m,
    (match) => `${match}\n${rollupNavGroup}`
  )
  fs.writeFileSync(headerPath, header, 'utf8')
  console.log('Successfully updated SiteHeader.jsx with Rollup Banners group')
} else {
  console.log('SiteHeader.jsx already has signage group')
}
