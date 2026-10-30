const fs = require('fs')
const path = require('path')
const { STICKER_LINKABLE_GUIDES } = require('../src/data/stickerLinkableGuidesData.js')

const dbStorePath = path.resolve(__dirname, '../src/data/dbStore.json')
const defaultBlogPath = path.resolve(__dirname, '../client/src/data/defaultBlogGuides.js')

// 1. Update dbStore.json
const dbStore = JSON.parse(fs.readFileSync(dbStorePath, 'utf8'))
const existingSlugs = new Set(dbStore.blogs.map((b) => b.slug))

let addedToDb = 0
STICKER_LINKABLE_GUIDES.forEach((g, idx) => {
  if (!existingSlugs.has(g.slug)) {
    dbStore.blogs.push({
      id: 400 + idx,
      _id: `blog-${400 + idx}`,
      ...g,
    })
    addedToDb++
  }
})

if (addedToDb) {
  fs.writeFileSync(dbStorePath, JSON.stringify(dbStore, null, 2), 'utf8')
}
console.log(`Added ${addedToDb} sticker guides to dbStore.json`)

// 2. Update defaultBlogGuides.js
let defaultContent = fs.readFileSync(defaultBlogPath, 'utf8')
const clientSlugs = new Set()
const matches = defaultContent.matchAll(/"slug":\s*"([^"]+)"/g)
for (const m of matches) {
  clientSlugs.add(m[1])
}

const toAddClient = STICKER_LINKABLE_GUIDES.filter((g) => !clientSlugs.has(g.slug))
if (toAddClient.length) {
  const formatted = toAddClient.map((g, idx) => ({
    id: 400 + idx,
    title: g.title,
    slug: g.slug,
    excerpt: g.excerpt,
    category: g.category_name,
    categoryData: { name: g.category_name, slug: g.category_slug },
    productData: { name: g.title, slug: g.product_slug },
    author: g.author_name,
    author_name: g.author_name,
    published_at: g.published_at,
    publishedAt: g.published_at,
    reading_time: `${g.reading_time} min read`,
    readTime: `${g.reading_time} min read`,
    word_count: g.word_count,
    featured_image: g.featured_image,
    image_alt: g.image_alt,
    meta_title: g.seo_title,
    meta_description: g.meta_description,
    focus_keyword: g.focus_keyword,
    secondary_keywords: g.secondary_keywords,
    canonical_url: g.canonical_url,
    faqs: g.faqs,
    content: g.content,
  }))

  const jsonStr = JSON.stringify(formatted, null, 2)
  const inner = jsonStr.slice(1, -1).trim()
  const lastIdx = defaultContent.lastIndexOf(']')
  defaultContent = defaultContent.slice(0, lastIdx).trimEnd() + ',\n' + inner + '\n' + defaultContent.slice(lastIdx)
  fs.writeFileSync(defaultBlogPath, defaultContent, 'utf8')
}
console.log(`Added ${toAddClient.length} sticker guides to defaultBlogGuides.js`)
