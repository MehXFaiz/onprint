import catalogProducts from '../data/catalogProducts.json'
import { resolveCanonicalCategorySlug } from '../utils/categoryMapping'

/**
 * Static product catalogue (frontend-only build).
 * Products are bundled from src/data/catalogProducts.json.
 */
const activeProducts = catalogProducts.filter((p) => p.active !== false)

const CATEGORY_ALIAS_MATCHERS = {
  'rollup-banners': (catSlug, slug) =>
    catSlug.includes('rollup') || catSlug.includes('roll-up') || slug.includes('rollup') || slug.includes('roll-up') || slug.includes('pull-up') || slug.includes('retractable'),
  'stickers-labels-printing': (catSlug, slug) =>
    catSlug.includes('sticker') || catSlug.includes('label') || slug.includes('sticker') || slug.includes('label'),
  'stamps-printing-dubai': (catSlug, slug) =>
    catSlug.includes('stamp') || catSlug.includes('seal') || slug.includes('stamp') || slug.includes('seal') || slug.includes('dater'),
  'business-cards-printing': (catSlug, slug) => catSlug.includes('business-card') || slug.includes('business-card'),
  'letterheads-printing-dubai': (catSlug, slug) =>
    catSlug.includes('letterhead') || slug.includes('letterhead') || slug.includes('presentation-folder') || slug.includes('corporate-envelope'),
  'bottle-printing-dubai': (catSlug, slug) =>
    catSlug.includes('bottle') || slug.includes('bottle') || slug.includes('flask') || slug.includes('shaker'),
}

function matchesCategory(p, rawCategory, categoryParam) {
  const slug = String(p.slug || '').toLowerCase()
  const catSlug = p.category?.slug?.toLowerCase() || ''
  const catCanonical = resolveCanonicalCategorySlug(catSlug)
  const catId = String(p.category?._id || '').toLowerCase()
  const catName = p.category?.name?.toLowerCase() || ''

  if (
    catCanonical === categoryParam ||
    catSlug === categoryParam ||
    catSlug === rawCategory ||
    catId === categoryParam ||
    catId === rawCategory
  ) {
    return true
  }

  const aliasMatcher = CATEGORY_ALIAS_MATCHERS[categoryParam]
  if (aliasMatcher && aliasMatcher(catSlug, slug)) return true

  if (catName === categoryParam || catName === rawCategory) return true

  return (p.categories || []).some((cat) => {
    const sSlug = cat.slug?.toLowerCase() || ''
    const sId = String(cat._id || '').toLowerCase()
    return (
      resolveCanonicalCategorySlug(sSlug) === categoryParam ||
      sSlug === categoryParam ||
      sSlug === rawCategory ||
      sId === categoryParam ||
      sId === rawCategory
    )
  })
}

export async function getProducts(params = {}) {
  let list = activeProducts

  if (params.featured) list = list.filter((p) => p.featured)
  if (params.category) {
    const rawCategory = String(params.category).toLowerCase().trim()
    const categoryParam = resolveCanonicalCategorySlug(rawCategory)
    list = list.filter((p) => matchesCategory(p, rawCategory, categoryParam))
  }
  if (params.q) {
    const q = String(params.q).toLowerCase()
    list = list.filter((p) => p.name.toLowerCase().includes(q) || p.shortDescription?.toLowerCase().includes(q))
  }
  return { data: list, page: 1, pageSize: list.length, total: list.length }
}

export async function getProductBySlug(slug) {
  const found = activeProducts.find((p) => p.slug === slug)
  if (found) return found
  throw new Error('Product not found')
}
