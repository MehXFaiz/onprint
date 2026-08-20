import api from './api'

export const initialCategories = [
  {
    id: 1,
    _id: 'cat-brochures-printing',
    name: 'Brochures Printing',
    slug: 'brochures-printing',
    description: 'Premium corporate bi-fold, tri-fold, and multi-page marketing brochures printed on luxury coated art paper with precision folding and finishing.',
    image: '/uploads/categories/brochures-printing.jpg',
    image_url: '/uploads/categories/brochures-printing.jpg',
    status: 'active',
    active: true,
    displayOrder: 1,
    display_order: 1,
    seoTitle: 'Brochures Printing in Dubai | Premium Brochure Printing | ONPRINT',
    seoDescription: 'Professional brochure printing in Dubai. Custom bi-fold, tri-fold, and multi-page brochures with soft-touch matte lamination and fast turnaround.',
    seoKeywords: 'brochures printing dubai, brochure printing dubai, corporate brochures uae, custom bi fold brochures',
    seoHeading: 'Commercial Brochure Printing in Dubai',
    canonicalUrl: 'https://0nprint.com/categories/brochures-printing',
    imageAlt: 'Professional commercial printed brochures in Dubai',
    productCount: 0,
  },
  {
    id: 2,
    _id: 'cat-business-cards-printing',
    name: 'Business Cards Printing',
    slug: 'business-cards-printing',
    description: 'Executive 350gsm to 600gsm cotton and silk business cards with soft-touch velvet lamination, metallic gold foil stamping, and painted edges.',
    image: '/uploads/categories/business-cards-printing.jpg',
    image_url: '/uploads/categories/business-cards-printing.jpg',
    status: 'active',
    active: true,
    displayOrder: 2,
    display_order: 2,
    seoTitle: 'Business Card Printing in Dubai | Luxury Business Cards | ONPRINT',
    seoDescription: 'Make an undeniable first impression with luxury business cards in Dubai. 350gsm–600gsm cotton stocks, gold foil stamping, and spot UV varnishing.',
    seoKeywords: 'business cards printing dubai, luxury business cards dubai, executive visiting cards uae',
    seoHeading: 'Luxury Executive Business Card Printing in Dubai',
    canonicalUrl: 'https://0nprint.com/categories/business-cards-printing',
    imageAlt: 'Luxury gold foil executive business cards in Dubai',
    productCount: 0,
  },
  {
    id: 3,
    _id: 'cat-flyers-printing-in-dubai',
    name: 'Flyers Printing In Dubai',
    slug: 'flyers-printing-in-dubai',
    description: 'High-impact commercial marketing flyers printed on 170gsm–300gsm gloss or matte art paper with vibrant CMYK Pantone color fidelity.',
    image: '/uploads/categories/flyers-printing-in-dubai.jpg',
    image_url: '/uploads/categories/flyers-printing-in-dubai.jpg',
    status: 'active',
    active: true,
    displayOrder: 3,
    display_order: 3,
    seoTitle: 'Flyer Printing in Dubai | Same Day Marketing Flyer Printing | ONPRINT',
    seoDescription: 'Order custom marketing flyer printing in Dubai. Single and double-sided promo flyers on premium art paper with express same-day delivery.',
    seoKeywords: 'flyers printing in dubai, flyer printing dubai, promotional flyers uae, marketing leaflets dubai',
    seoHeading: 'High-Impact Marketing Flyer Printing in Dubai',
    canonicalUrl: 'https://0nprint.com/categories/flyers-printing-in-dubai',
    imageAlt: 'Full color commercial marketing flyers printed in Dubai',
    productCount: 0,
  },
  {
    id: 4,
    _id: 'cat-id-card-printing-dubai',
    name: 'ID Card Printing Dubai',
    slug: 'id-card-printing-dubai',
    description: 'Secure CR80 standard PVC employee identity cards with high-definition thermal printing, smart chips, magnetic strips, and barcodes.',
    image: '/uploads/categories/id-card-printing-dubai.jpg',
    image_url: '/uploads/categories/id-card-printing-dubai.jpg',
    status: 'active',
    active: true,
    displayOrder: 4,
    display_order: 4,
    seoTitle: 'ID Card Printing Dubai | Corporate Employee & PVC Cards | ONPRINT',
    seoDescription: 'High-security corporate PVC ID card printing in Dubai. Crisp photo resolution, smart NFC chips, barcodes, and custom lanyards for UAE businesses.',
    seoKeywords: 'id card printing dubai, pvc id cards dubai, corporate employee badges uae, student id card printing',
    seoHeading: 'Corporate PVC ID Card Printing Solutions Dubai',
    canonicalUrl: 'https://0nprint.com/categories/id-card-printing-dubai',
    imageAlt: 'Corporate employee PVC identity cards with chips in Dubai',
    productCount: 0,
  },
  {
    id: 5,
    _id: 'cat-lanyard-printing-dubai',
    name: 'Lanyard Printing Dubai',
    slug: 'lanyard-printing-dubai',
    description: 'Custom branded satin and woven polyester neck lanyards with screen printing, safety breakaway clips, and heavy-duty metal swivel hooks.',
    image: '/uploads/categories/lanyard-printing-dubai.jpg',
    image_url: '/uploads/categories/lanyard-printing-dubai.jpg',
    status: 'active',
    active: true,
    displayOrder: 5,
    display_order: 5,
    seoTitle: 'Lanyard Printing Dubai | Custom Branded Neck Lanyards | ONPRINT',
    seoDescription: 'Custom branded neck lanyard printing in Dubai. High-density polyester and satin lanyards with safety buckles and swivel hooks for corporate events.',
    seoKeywords: 'lanyard printing dubai, custom lanyards dubai, branded neck straps uae, event lanyards dubai',
    seoHeading: 'Custom Branded Neck Lanyard Printing in Dubai',
    canonicalUrl: 'https://0nprint.com/categories/lanyard-printing-dubai',
    imageAlt: 'Custom branded corporate neck lanyards in Dubai',
    productCount: 0,
  },
  {
    id: 6,
    _id: 'cat-letterheads-printing-dubai',
    name: 'Letterheads Printing Dubai',
    slug: 'letterheads-printing-dubai',
    description: 'Executive 120gsm smooth uncoated white letterheads and official corporate stationery printed with crisp full-color CMYK laser compatibility.',
    image: '/uploads/categories/letterheads-printing-dubai.jpg',
    image_url: '/uploads/categories/letterheads-printing-dubai.jpg',
    status: 'active',
    active: true,
    displayOrder: 6,
    display_order: 6,
    seoTitle: 'Letterhead Printing in Dubai | Official Corporate Stationery | ONPRINT',
    seoDescription: 'Executive corporate letterhead printing in Dubai. 120gsm smooth laser-guaranteed paper for official contracts, proposals, and invoices.',
    seoKeywords: 'letterheads printing dubai, letterhead printing dubai, corporate stationery uae, official letterhead paper',
    seoHeading: 'Executive Corporate Letterhead Printing in Dubai',
    canonicalUrl: 'https://0nprint.com/categories/letterheads-printing-dubai',
    imageAlt: 'Executive corporate stationery letterhead and envelope in Dubai',
    productCount: 0,
  },
  {
    id: 7,
    _id: 'cat-name-badges-printing-dubai',
    name: 'Name Badges Printing Dubai',
    slug: 'name-badges-printing-dubai',
    description: 'Laser-cut brushed metal and acrylic employee name badges with magnetic backings, clear domed epoxy coatings, and scratch-resistant finishes.',
    image: '/uploads/categories/name-badges-printing-dubai.jpg',
    image_url: '/uploads/categories/name-badges-printing-dubai.jpg',
    status: 'active',
    active: true,
    displayOrder: 7,
    display_order: 7,
    seoTitle: 'Name Badges Printing Dubai | Magnetic Metal & Acrylic Badges | ONPRINT',
    seoDescription: 'Professional staff name badges printing in Dubai. Brushed silver, gold, and acrylic magnetic badges with domed epoxy resin for corporate teams.',
    seoKeywords: 'name badges printing dubai, magnetic name badges dubai, staff badge printing uae, acrylic name tag printing',
    seoHeading: 'Professional Magnetic Name Badges Printing Dubai',
    canonicalUrl: 'https://0nprint.com/categories/name-badges-printing-dubai',
    imageAlt: 'Professional magnetic metal and acrylic name badges in Dubai',
    productCount: 0,
  },
]

const STORAGE_KEY = 'onprint_categories_data'

function getStoredCategories() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch {
    // ignore
  }
  return initialCategories
}

function saveStoredCategories(data) {
  try {
    if (Array.isArray(data) && data.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    }
  } catch {
    // ignore
  }
}

export async function getCategories(params = {}) {
  try {
    const { data } = await api.get('/categories', { params })
    if (data?.data && Array.isArray(data.data) && data.data.length > 0) {
      saveStoredCategories(data.data)
      return data.data
    }
  } catch (err) {
    console.warn('[Categories] Fetch note:', err.message)
  }

  let list = getStoredCategories()
  if (params.status && params.status !== 'all') {
    list = list.filter((c) => (params.status === 'active' ? c.status === 'active' || c.active : c.status === 'inactive' || !c.active))
  }
  if (params.search) {
    const term = params.search.toLowerCase()
    list = list.filter((c) => c.name.toLowerCase().includes(term) || c.slug.toLowerCase().includes(term))
  }
  return list
}

export async function getCategoryById(id) {
  try {
    const { data } = await api.get(`/categories/${id}`)
    if (data?.data) return data.data
  } catch (err) {
    console.warn('[Category] Fetch by ID note:', err.message)
  }

  const all = getStoredCategories()
  const found = all.find((c) => String(c.id) === String(id) || c._id === id || c.slug === id)
  if (found) return found
  return all[0] || null
}

export async function createCategory(categoryData) {
  const payload = {
    name: categoryData.name,
    slug: categoryData.slug,
    description: categoryData.description || '',
    image: categoryData.image || categoryData.image_url || '',
    image_url: categoryData.image_url || categoryData.image || '',
    status: categoryData.status || 'active',
    display_order: Number(categoryData.display_order ?? categoryData.displayOrder ?? 0),
    displayOrder: Number(categoryData.display_order ?? categoryData.displayOrder ?? 0),
    seo_title: categoryData.seo_title || categoryData.seoTitle,
    seo_description: categoryData.seo_description || categoryData.seoDescription,
    seo_keywords: categoryData.seo_keywords || categoryData.seoKeywords,
    seo_heading: categoryData.seo_heading || categoryData.seoHeading,
    image_alt: categoryData.image_alt || categoryData.imageAlt,
    canonical_url: categoryData.canonical_url || categoryData.canonicalUrl,
  }

  try {
    const { data } = await api.post('/categories', payload)
    const all = getStoredCategories()
    const newCat = data?.data || { id: Date.now(), _id: `cat-${Date.now()}`, ...payload }
    saveStoredCategories([...all, newCat])
    return data
  } catch (err) {
    if (err.message === 'Network Error' || !err.response) {
      const all = getStoredCategories()
      const newCat = { id: Date.now(), _id: `cat-${Date.now()}`, ...payload, active: payload.status !== 'inactive' }
      saveStoredCategories([...all, newCat])
      return { success: true, data: newCat }
    }
    throw err
  }
}

export async function updateCategory(id, categoryData) {
  const payload = {
    name: categoryData.name,
    slug: categoryData.slug,
    description: categoryData.description || '',
    image: categoryData.image || categoryData.image_url || '',
    image_url: categoryData.image_url || categoryData.image || '',
    status: categoryData.status || 'active',
    display_order: Number(categoryData.display_order ?? categoryData.displayOrder ?? 0),
    displayOrder: Number(categoryData.display_order ?? categoryData.displayOrder ?? 0),
    seo_title: categoryData.seo_title || categoryData.seoTitle,
    seo_description: categoryData.seo_description || categoryData.seoDescription,
    seo_keywords: categoryData.seo_keywords || categoryData.seoKeywords,
    seo_heading: categoryData.seo_heading || categoryData.seoHeading,
    image_alt: categoryData.image_alt || categoryData.imageAlt,
    canonical_url: categoryData.canonical_url || categoryData.canonicalUrl,
  }

  try {
    const { data } = await api.put(`/categories/${id}`, payload)
    const all = getStoredCategories()
    const updated = all.map((c) => (String(c.id) === String(id) || c._id === id || c.slug === id ? { ...c, ...payload } : c))
    saveStoredCategories(updated)
    return data
  } catch (err) {
    if (err.message === 'Network Error' || !err.response) {
      const all = getStoredCategories()
      const updated = all.map((c) => (String(c.id) === String(id) || c._id === id || c.slug === id ? { ...c, ...payload } : c))
      saveStoredCategories(updated)
      return { success: true, data: { id, ...payload } }
    }
    throw err
  }
}

export async function updateCategoryStatus(id, status) {
  try {
    const { data } = await api.patch(`/categories/${id}/status`, { status })
    const all = getStoredCategories()
    const updated = all.map((c) => (String(c.id) === String(id) || c._id === id || c.slug === id ? { ...c, status, active: status === 'active' } : c))
    saveStoredCategories(updated)
    return data
  } catch {
    const all = getStoredCategories()
    const updated = all.map((c) => (String(c.id) === String(id) || c._id === id || c.slug === id ? { ...c, status, active: status === 'active' } : c))
    saveStoredCategories(updated)
    return { success: true, data: { id, status } }
  }
}

export async function deleteCategory(id) {
  const all = getStoredCategories()
  const updated = all.filter((c) => String(c.id) !== String(id) && c._id !== id && c.slug !== id)
  saveStoredCategories(updated)

  try {
    const { data } = await api.delete(`/categories/${id}`)
    return data
  } catch {
    return { success: true, message: 'Category removed successfully' }
  }
}

export async function uploadCategoryImage(id, file) {
  const formData = new FormData()
  formData.append('file', file)

  const { data } = await api.post(`/categories/${id}/image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return data
}

