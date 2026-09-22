import api from './api'

export const initialCategories = [
  {
    "_id": "cat-business-cards-printing",
    "id": 1,
    "name": "Business Cards Printing",
    "slug": "business-cards-printing",
    "description": "Executive 350gsm to 600gsm cotton and silk business cards with soft-touch velvet lamination, metallic gold foil stamping, and painted edges.",
    "image": "/uploads/categories/business-cards-printing.jpg",
    "image_url": "/uploads/categories/business-cards-printing.jpg",
    "status": "active",
    "display_order": 1,
    "active": true,
    "seoTitle": "Business Card Printing in Dubai | Luxury Business Cards | ONPRINT",
    "seoDescription": "Make an undeniable first impression with luxury business cards in Dubai. 350gsm–600gsm cotton stocks, gold foil stamping, and spot UV varnishing.",
    "seoKeywords": "business card printing dubai, custom business cards dubai, premium business cards dubai, luxury business cards dubai, corporate business cards dubai",
    "seoHeading": "Luxury Executive Business Card Printing in Dubai",
    "canonicalUrl": "https://0nprint.com/categories/business-cards-printing",
    "imageAlt": "Luxury gold foil executive business cards in Dubai"
  },
  {
    "_id": "cat-brochures-printing",
    "id": 2,
    "name": "Brochures Printing",
    "slug": "brochures-printing",
    "description": "Premium corporate bi-fold, tri-fold, and multi-page marketing brochures printed on luxury coated art paper with precision folding and finishing.",
    "image": "/uploads/categories/brochures-printing.jpg",
    "image_url": "/uploads/categories/brochures-printing.jpg",
    "status": "active",
    "display_order": 2,
    "active": true,
    "seoTitle": "Brochures Printing in Dubai | Premium Brochure Printing | ONPRINT",
    "seoDescription": "Professional brochure printing in Dubai. Custom bi-fold, tri-fold, and multi-page brochures with soft-touch matte lamination and fast turnaround.",
    "seoKeywords": "brochure printing dubai, brochure printing services dubai, custom brochure printing dubai, corporate brochure printing uae, bi fold brochure dubai",
    "seoHeading": "Commercial Brochure Printing in Dubai",
    "canonicalUrl": "https://0nprint.com/categories/brochures-printing",
    "imageAlt": "Professional commercial printed brochures in Dubai"
  },
  {
    "_id": "cat-flyers-printing-in-dubai",
    "id": 3,
    "name": "Flyers Printing In Dubai",
    "slug": "flyers-printing-in-dubai",
    "description": "High-impact commercial marketing flyers printed on 170gsm–300gsm gloss or matte art paper with vibrant CMYK Pantone color fidelity.",
    "image": "/uploads/categories/flyers-printing-in-dubai.jpg",
    "image_url": "/uploads/categories/flyers-printing-in-dubai.jpg",
    "status": "active",
    "display_order": 3,
    "active": true,
    "seoTitle": "Flyer Printing in Dubai | Same Day Marketing Flyer Printing | ONPRINT",
    "seoDescription": "Order custom marketing flyer printing in Dubai. Single and double-sided promo flyers on premium art paper with express same-day delivery.",
    "seoKeywords": "flyer printing dubai, flyer printing services dubai, custom flyer printing dubai, promotional flyer printing dubai, leaflet printing dubai",
    "seoHeading": "High-Impact Marketing Flyer Printing in Dubai",
    "canonicalUrl": "https://0nprint.com/categories/flyers-printing-in-dubai",
    "imageAlt": "Full color commercial marketing flyers printed in Dubai"
  },
  {
    "_id": "cat-id-card-printing-dubai",
    "id": 4,
    "name": "ID Card Printing Dubai",
    "slug": "id-card-printing-dubai",
    "description": "Secure CR80 standard PVC employee identity cards with high-definition thermal printing, smart chips, magnetic strips, and barcodes.",
    "image": "/uploads/categories/id-card-printing-dubai.jpg",
    "image_url": "/uploads/categories/id-card-printing-dubai.jpg",
    "status": "active",
    "display_order": 4,
    "active": true,
    "seoTitle": "ID Card Printing Dubai | Corporate Employee & PVC Cards | ONPRINT",
    "seoDescription": "High-security corporate PVC ID card printing in Dubai. Crisp photo resolution, smart NFC chips, barcodes, and custom lanyards for UAE businesses.",
    "seoKeywords": "id card printing dubai, pvc id cards dubai, corporate employee badges uae, student id card printing",
    "seoHeading": "Corporate PVC ID Card Printing Solutions Dubai",
    "canonicalUrl": "https://0nprint.com/categories/id-card-printing-dubai",
    "imageAlt": "Corporate employee PVC identity cards with chips in Dubai"
  },
  {
    "_id": "cat-lanyard-printing-dubai",
    "id": 5,
    "name": "Lanyard Printing Dubai",
    "slug": "lanyard-printing-dubai",
    "description": "Custom branded satin and woven polyester neck lanyards with screen printing, safety breakaway clips, and heavy-duty metal swivel hooks.",
    "image": "/uploads/categories/lanyard-printing-dubai.jpg",
    "image_url": "/uploads/categories/lanyard-printing-dubai.jpg",
    "status": "active",
    "display_order": 5,
    "active": true,
    "seoTitle": "Lanyard Printing Dubai | Custom Branded Neck Lanyards | ONPRINT",
    "seoDescription": "Custom branded neck lanyard printing in Dubai. High-density polyester and satin lanyards with safety buckles and swivel hooks for corporate events.",
    "seoKeywords": "lanyard printing dubai, custom lanyards dubai, branded neck straps uae, event lanyards dubai",
    "seoHeading": "Custom Branded Neck Lanyard Printing in Dubai",
    "canonicalUrl": "https://0nprint.com/categories/lanyard-printing-dubai",
    "imageAlt": "Custom branded corporate neck lanyards in Dubai"
  },
  {
    "_id": "cat-letterheads-printing-dubai",
    "id": 6,
    "name": "Letterheads Printing Dubai",
    "slug": "letterheads-printing-dubai",
    "description": "Executive 120gsm smooth uncoated white letterheads and official corporate stationery printed with crisp full-color CMYK laser compatibility.",
    "image": "/uploads/categories/letterheads-printing-dubai.jpg",
    "image_url": "/uploads/categories/letterheads-printing-dubai.jpg",
    "status": "active",
    "display_order": 6,
    "active": true,
    "seoTitle": "Letterhead Printing in Dubai | Official Corporate Stationery | ONPRINT",
    "seoDescription": "Executive corporate letterhead printing in Dubai. 120gsm smooth laser-guaranteed paper for official contracts, proposals, and invoices.",
    "seoKeywords": "letterheads printing dubai, letterhead printing dubai, corporate stationery uae, official letterhead paper",
    "seoHeading": "Executive Corporate Letterhead Printing in Dubai",
    "canonicalUrl": "https://0nprint.com/categories/letterheads-printing-dubai",
    "imageAlt": "Executive corporate stationery letterhead and envelope in Dubai"
  },
  {
    "_id": "cat-name-badges-printing-dubai",
    "id": 7,
    "name": "Name Badges Printing Dubai",
    "slug": "name-badges-printing-dubai",
    "description": "Laser-cut brushed metal and acrylic employee name badges with magnetic backings, clear domed epoxy coatings, and scratch-resistant finishes.",
    "image": "/uploads/categories/name-badges-printing-dubai.jpg",
    "image_url": "/uploads/categories/name-badges-printing-dubai.jpg",
    "status": "active",
    "display_order": 7,
    "active": true,
    "seoTitle": "Name Badges Printing Dubai | Magnetic Metal & Acrylic Badges | ONPRINT",
    "seoDescription": "Professional staff name badges printing in Dubai. Brushed silver, gold, and acrylic magnetic badges with domed epoxy resin for corporate teams.",
    "seoKeywords": "name badges printing dubai, magnetic name badges dubai, staff badge printing uae, acrylic name tag printing",
    "seoHeading": "Professional Magnetic Name Badges Printing Dubai",
    "canonicalUrl": "https://0nprint.com/categories/name-badges-printing-dubai",
    "imageAlt": "Professional magnetic metal and acrylic name badges in Dubai"
  },
  {
    "_id": "cat-mug-printing-dubai",
    "id": 8,
    "name": "Mug Printing Dubai",
    "slug": "mug-printing-dubai",
    "description": "Custom printed ceramic mugs, magic heat-sensitive mugs, executive matte black coffee mugs, stainless travel tumblers, and vintage enamel mugs printed in Dubai.",
    "image": "/assets/products/mug_white_ceramic.jpg",
    "image_url": "/assets/products/mug_white_ceramic.jpg",
    "status": "active",
    "display_order": 8,
    "active": true,
    "seoTitle": "Mug Printing Dubai | Custom Branded Ceramic & Travel Mugs | ONPRINT",
    "seoDescription": "Professional mug printing in Dubai. Custom ceramic mugs, magic color-changing mugs, executive matte black mugs, and travel tumblers with fast UAE delivery.",
    "seoKeywords": "mug printing dubai, custom mugs dubai, printed mugs uae, personalized coffee mugs dubai, magic mugs dubai, ceramic mug printing",
    "seoHeading": "Custom Mug Printing Solutions in Dubai",
    "canonicalUrl": "https://0nprint.com/categories/mug-printing-dubai",
    "imageAlt": "Custom printed corporate ceramic mugs and drinkware in Dubai"
  },
  {
    "_id": "cat-bottle-printing-dubai",
    "id": 9,
    "name": "Water Bottle Printing Dubai",
    "slug": "bottle-printing-dubai",
    "description": "Custom printed & laser-engraved water bottles, smart LED temperature display flasks, double-wall stainless steel thermal bottles, and aluminium sports bottles in Dubai.",
    "image": "/assets/products/bottle_smart_led.jpg",
    "image_url": "/assets/products/bottle_smart_led.jpg",
    "status": "active",
    "display_order": 9,
    "active": true,
    "seoTitle": "Water Bottle Printing Dubai | Custom Branded Flasks & Sports Bottles | ONPRINT",
    "seoDescription": "Custom water bottle printing and laser engraving in Dubai. Double-wall insulated flasks, smart LED temp bottles, aluminium sports bottles with fast UAE delivery.",
    "seoKeywords": "bottle printing dubai, water bottle printing dubai, custom flasks uae, branded sports bottles dubai, smart led temperature bottle dubai",
    "seoHeading": "Custom Water Bottle Printing & Laser Engraving Dubai",
    "canonicalUrl": "https://0nprint.com/categories/bottle-printing-dubai",
    "imageAlt": "Custom printed and laser engraved water bottles in Dubai"
  },
  {
    "_id": "cat-luxury-packaging-boxes",
    "id": 10,
    "name": "Luxury Packaging & Boxes",
    "slug": "luxury-packaging-boxes",
    "description": "Custom rigid presentation boxes, magnetic closure gift boxes, corrugated mailers, and premium boutique packaging crafted with embossed finishes.",
    "image": "/assets/products/service_luxury_packaging.jpg",
    "image_url": "/assets/products/service_luxury_packaging.jpg",
    "status": "active",
    "display_order": 10,
    "active": true,
    "seoTitle": "Luxury Packaging & Custom Box Printing Dubai | ONPRINT",
    "seoDescription": "Bespoke custom packaging and luxury boxes manufactured in Dubai. Rigid gift boxes, magnetic closure boxes, cosmetic packaging with foil embossing.",
    "seoKeywords": "luxury packaging dubai, custom boxes printing dubai, rigid box manufacturing uae, gift box printing dubai, boutique packaging",
    "seoHeading": "Luxury Custom Packaging & Presentation Boxes in Dubai",
    "canonicalUrl": "https://0nprint.com/categories/luxury-packaging-boxes",
    "imageAlt": "Luxury gold embossed custom packaging boxes in Dubai"
  },
  {
    "_id": "cat-corporate-gift-items",
    "id": 11,
    "name": "Corporate Gifts & Merchandise",
    "slug": "corporate-gift-items",
    "description": "VIP corporate executive gifts, customized branded gift sets, luxury desktop accessories, and curated event giveaways for Dubai organizations.",
    "image": "/assets/products/luxury_corporate_gifts_dubai.jpg",
    "image_url": "/assets/products/luxury_corporate_gifts_dubai.jpg",
    "status": "active",
    "display_order": 11,
    "active": true,
    "seoTitle": "Corporate Gifts & VIP Merchandise Printing Dubai | ONPRINT",
    "seoDescription": "Premium corporate gifts and branded merchandise in Dubai. Executive gift sets, leather items, engraved pens, and VIP presentation boxes.",
    "seoKeywords": "corporate gifts dubai, promotional merchandise dubai, executive gift sets uae, custom branded gifts dubai",
    "seoHeading": "Executive Corporate Gifts & VIP Merchandise Dubai",
    "canonicalUrl": "https://0nprint.com/categories/corporate-gift-items",
    "imageAlt": "Luxury corporate executive gift sets in Dubai"
  },
  {
    "_id": "cat-signage-banners-printing",
    "id": 12,
    "name": "Signage & Exhibition Banners",
    "slug": "signage-banners-printing",
    "description": "Roll-up pull banners, teardrop beach flags, acrylic wall signs, and rigid foam board displays engineered for Dubai trade shows and offices.",
    "image": "/assets/products/service_exhibition_signage.jpg",
    "image_url": "/assets/products/service_exhibition_signage.jpg",
    "status": "active",
    "display_order": 12,
    "active": true,
    "seoTitle": "Signage & Exhibition Banner Printing Dubai | ONPRINT",
    "seoDescription": "Large format printing and exhibition signage in Dubai. High-impact roll-up banners, outdoor flags, foam boards, and acrylic wall displays.",
    "seoKeywords": "signage printing dubai, exhibition banners dubai, roll up banner dubai, trade show displays uae, acrylic signs dubai",
    "seoHeading": "High-Impact Signage & Exhibition Banners in Dubai",
    "canonicalUrl": "https://0nprint.com/categories/signage-banners-printing",
    "imageAlt": "Commercial exhibition banners and trade show signage in Dubai"
  },
  {
    "_id": "cat-custom-apparel-printing",
    "id": 13,
    "name": "Custom Apparel & Wearables",
    "slug": "custom-apparel-printing",
    "description": "High-density screen printed and embroidered cotton corporate t-shirts, polo uniforms, hoodies, and promotional embroidered caps.",
    "image": "/assets/products/1 (3).jpg",
    "image_url": "/assets/products/1 (3).jpg",
    "status": "active",
    "display_order": 13,
    "active": true,
    "seoTitle": "Custom Apparel & T-Shirt Screen Printing Dubai | ONPRINT",
    "seoDescription": "Custom branded t-shirts, corporate polos, embroidered caps, and staff uniforms in Dubai with screen printing and DTG precision.",
    "seoKeywords": "t shirt printing dubai, custom apparel dubai, corporate uniform printing uae, embroidered caps dubai",
    "seoHeading": "Custom Corporate Apparel & Branded Wearables Dubai",
    "canonicalUrl": "https://0nprint.com/categories/custom-apparel-printing",
    "imageAlt": "Custom screen printed corporate t-shirts and apparel in Dubai"
  },
  {
    "_id": "cat-stickers-labels-printing",
    "id": 14,
    "name": "Stickers & Product Labels",
    "slug": "stickers-labels-printing",
    "description": "Waterproof die-cut vinyl stickers, foil metallic roll labels, holographic stickers, and embossed packaging seal stickers with UV durability.",
    "image": "/assets/products/service_stickers_labels.jpg",
    "image_url": "/assets/products/service_stickers_labels.jpg",
    "status": "active",
    "display_order": 14,
    "active": true,
    "seoTitle": "Stickers & Product Label Printing Dubai | ONPRINT",
    "seoDescription": "Precision die-cut stickers and product roll labels in Dubai. Waterproof vinyl, metallic foil, holographic, and transparent packaging stickers.",
    "seoKeywords": "sticker printing dubai, custom labels dubai, die cut stickers uae, packaging labels dubai",
    "seoHeading": "Precision Die-Cut Stickers & Product Labels Dubai",
    "canonicalUrl": "https://0nprint.com/categories/stickers-labels-printing",
    "imageAlt": "Custom die cut vinyl stickers and foil labels in Dubai"
  },
  {
    "_id": "cat-catalogs-booklets-printing",
    "id": 15,
    "name": "Catalogs & Booklets Printing",
    "slug": "catalogs-booklets-printing",
    "description": "Multi-page corporate product catalogs, lookbooks, company profiles, and annual reports with saddle-stitch, wire-o, or PUR perfect binding.",
    "image": "/assets/products/brochure_booklet_catalog.jpg",
    "image_url": "/assets/products/brochure_booklet_catalog.jpg",
    "status": "active",
    "display_order": 15,
    "active": true,
    "seoTitle": "Catalogs & Corporate Booklets Printing Dubai | ONPRINT",
    "seoDescription": "Executive multi-page booklet and catalog printing in Dubai. Saddle-stitched and perfect-bound company profiles, annual reports, and product lookbooks.",
    "seoKeywords": "catalog printing dubai, booklet printing uae, annual report printing dubai, company profile printing",
    "seoHeading": "Corporate Booklets, Catalogs & Annual Reports Dubai",
    "canonicalUrl": "https://0nprint.com/categories/catalogs-booklets-printing",
    "imageAlt": "Multi-page executive corporate booklets and catalogs in Dubai"
  },
  {
    "_id": "cat-office-stationery-printing",
    "id": 16,
    "name": "Office Stationery & Envelopes",
    "slug": "office-stationery-printing",
    "description": "Complete corporate identity suites: executive notebooks, foiled presentation folders, branded window envelopes, and desk writing pads.",
    "image": "/assets/products/service_executive_stationery.jpg",
    "image_url": "/assets/products/service_executive_stationery.jpg",
    "status": "active",
    "display_order": 16,
    "active": true,
    "seoTitle": "Office Stationery & Envelope Printing Dubai | ONPRINT",
    "seoDescription": "Executive office stationery sets in Dubai. Foil-stamped presentation folders, corporate envelopes, desk pads, and luxury notebooks for corporate identity.",
    "seoKeywords": "office stationery dubai, presentation folder printing dubai, corporate envelopes uae, desk pads printing",
    "seoHeading": "Executive Corporate Stationery & Envelopes in Dubai",
    "canonicalUrl": "https://0nprint.com/categories/office-stationery-printing",
    "imageAlt": "Executive corporate stationery and presentation folders in Dubai"
  },
  {
    "_id": "cat-hospitality-event-printing",
    "id": 17,
    "name": "Hospitality & Event Stationery",
    "slug": "hospitality-event-printing",
    "description": "Waterproof restaurant menus, luxury wedding invitation suites, table talkers, event badges, and embossed greeting card stationery.",
    "image": "/assets/products/1 (14).jpg",
    "image_url": "/assets/products/1 (14).jpg",
    "status": "active",
    "display_order": 17,
    "active": true,
    "seoTitle": "Hospitality & Event Stationery Printing Dubai | ONPRINT",
    "seoDescription": "Luxury hospitality and event print solutions in Dubai. Spill-resistant restaurant menus, luxury wedding invitations, and VIP event collaterals.",
    "seoKeywords": "restaurant menu printing dubai, wedding invitation printing dubai, event stationery uae, hospitality printing dubai",
    "seoHeading": "Hospitality, Menus & Event Stationery Solutions Dubai",
    "canonicalUrl": "https://0nprint.com/categories/hospitality-event-printing",
    "imageAlt": "Luxury restaurant menus and wedding invitation suites in Dubai"
  },
  {
    "_id": "cat-promotional-drinkware-tech",
    "id": 18,
    "name": "Promotional Drinkware & Tech",
    "slug": "promotional-drinkware-tech",
    "description": "Laser-engraved thermal insulated water bottles, ceramic coffee mugs, wireless power banks, USB drives, and ergonomic desk mouse mats.",
    "image": "/assets/products/water_bottles.jpg",
    "image_url": "/assets/products/water_bottles.jpg",
    "status": "active",
    "display_order": 18,
    "active": true,
    "seoTitle": "Promotional Drinkware & Branded Tech Dubai | ONPRINT",
    "seoDescription": "Custom printed mugs, insulated stainless steel water bottles, branded USB flash drives, and power banks for corporate promotional campaigns in Dubai.",
    "seoKeywords": "mug printing dubai, custom water bottles dubai, promotional tech items uae, branded power banks dubai",
    "seoHeading": "Promotional Branded Drinkware & Tech Accessories Dubai",
    "canonicalUrl": "https://0nprint.com/categories/promotional-drinkware-tech",
    "imageAlt": "Custom branded drinkware and promotional tech accessories in Dubai"
  }
]

const STORAGE_KEY = 'onprint_categories_data_v2'

function getStoredCategories() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed) && parsed.length > 0) {
        const existingSlugs = new Set(parsed.map((c) => c.slug))
        const missing = initialCategories.filter((ic) => !existingSlugs.has(ic.slug))
        if (missing.length > 0) {
          const merged = [...parsed, ...missing]
          saveStoredCategories(merged)
          return merged
        }
        return parsed
      }
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
  let list = []
  try {
    const { data } = await api.get('/categories', { params })
    if (data?.data && Array.isArray(data.data) && data.data.length > 0) {
      const existingSlugs = new Set(data.data.map((c) => c.slug))
      const missing = initialCategories.filter((ic) => !existingSlugs.has(ic.slug))
      list = missing.length > 0 ? [...data.data, ...missing] : data.data
      saveStoredCategories(list)
    }
  } catch (err) {
    console.warn('[Categories] Fetch note:', err.message)
  }

  if (!list || list.length === 0) {
    list = getStoredCategories()
  }

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
  const fallback = initialCategories.find((c) => String(c.id) === String(id) || c._id === id || c.slug === id)
  if (fallback) return fallback
  return all[0] || initialCategories[0] || null
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

