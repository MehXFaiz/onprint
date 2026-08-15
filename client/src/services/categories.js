import api from './api'

export const defaultCategories = [
  {
    _id: 'cat-corporate-gifts',
    name: 'Corporate Gift Items',
    slug: 'corporate-gift-items',
    description: 'Premium branded gifts, apparel, mugs, and giveaways designed for businesses and corporate events in Dubai.',
    active: true,
  },
  {
    _id: 'cat-office-stationery',
    name: 'Office Stationery Printing',
    slug: 'office-stationery-printing',
    description: 'Executive notebooks, pens, business cards, and letterheads tailored for professional brand correspondence.',
    active: true,
  },
  {
    _id: 'cat-other-products',
    name: 'Other Products',
    slug: 'other-products',
    description: 'Large-format roll-ups, outdoor flags, die-cut vinyl stickers, and acrylic executive nameplates.',
    active: true,
  },
]

export async function getCategories() {
  try {
    const { data } = await api.get('/categories')
    if (data?.data && data.data.length > 0) return data.data
    return defaultCategories
  } catch {
    return defaultCategories
  }
}
