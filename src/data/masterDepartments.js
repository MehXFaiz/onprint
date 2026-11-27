/**
 * ONPRINT — Master Product Categorization & Department Architecture
 * Reference standard inspired by DLX Print (Dubai commercial print portal)
 * Organizes 110 products across 19 subcategories into 5 Master Departments.
 */

export const MASTER_DEPARTMENTS = [
  {
    id: 'business-office-printing',
    slug: 'business-office-printing',
    name: 'Business & Office Printing',
    shortName: 'Business & Office',
    eyebrow: 'DUBAI CORPORATE SUITE',
    badge: 'Executive Stationery',
    description: 'Precision business cards, official company letterheads, corporate presentation folders, carbonless NCR books, and legal company stamps.',
    metaTitle: 'Business & Office Printing Dubai | Executive Corporate Stationery | ONPRINT',
    metaDescription: 'Order luxury business cards, executive letterheads, corporate folders, NCR duplicate invoice books, and official company stamps in Dubai with express Al Quoz dispatch.',
    iconName: 'Briefcase',
    heroImage: '/uploads/categories/business-cards-printing.jpg',
    subcategories: [
      {
        slug: 'business-cards-printing',
        name: 'Business Cards',
        shortDesc: '350–700 GSM cotton, soft-touch, 24K hot foil, spot UV & painted edge cards.',
        image: '/assets/products/luxury_business_cards_dubai.jpg',
        featuredBadge: 'Dubai Flagship',
        productSlugs: [
          'standard-business-cards',
          'premium-business-cards',
          'premium-soft-touch-business-cards',
          'velvet-foil-business-cards',
          'raised-ink-business-cards',
          'luxury-painted-edge-business-cards',
          'plastic-pvc-business-cards',
        ],
      },
      {
        slug: 'letterheads-printing-dubai',
        name: 'Letterheads & Presentation Folders',
        shortDesc: '120gsm executive letterheads, gold foil headers, matching envelopes & pocket folders.',
        image: '/assets/products/letterhead_gold_foil.jpg',
        featuredBadge: 'Official Stationery',
        productSlugs: [
          'executive-120gsm-letterheads',
          'luxury-gold-foil-letterheads',
          'matching-corporate-envelopes',
          'corporate-presentation-folders',
        ],
      },
      {
        slug: 'office-stationery-printing',
        name: 'Corporate Envelopes & Documentation',
        shortDesc: 'Corporate envelopes, hardcover notebooks, desk pads, NCR invoice books & calendars.',
        image: '/assets/products/stationery/stationery-corporate-envelopes.jpg',
        featuredBadge: 'Office Essentials',
        productSlugs: [
          'presentation-folders',
          'printed-envelopes',
          'executive-notebooks',
          'desk-pads-printing',
          'stationery-gift-sets',
          'executive-letterheads',
          'corporate-ring-binders',
          'wall-desk-calendars',
          'ncr-duplicate-books',
          'string-tie-envelopes',
          'sticky-notes-cubes',
        ],
      },
      {
        slug: 'stamps-printing-dubai',
        name: 'Custom Stamps & Legal Seals',
        shortDesc: 'Self-inking Trodat company stamps, pocket mobile stamps, heavy dater machines & wax seals.',
        image: '/assets/products/stamps/self-inking-company-stamp.jpg',
        featuredBadge: '2-Hour Express',
        productSlugs: [
          'self-inking-company-stamps',
          'pocket-mobile-stamps',
          'heavy-duty-dater-stamps',
          'luxury-brass-wax-seal-stamps',
        ],
      },
    ],
  },
  {
    id: 'marketing-promotional-printing',
    slug: 'marketing-promotional-printing',
    name: 'Marketing & Promotional Printing',
    shortName: 'Marketing & Collaterals',
    eyebrow: 'COMMERCIAL CAMPAIGNS',
    badge: 'High-Volume Press',
    description: 'High-impact marketing flyers, multi-fold corporate brochures, multi-page company profiles, and hospitality print solutions.',
    metaTitle: 'Marketing & Promotional Printing Dubai | Brochures, Flyers & Booklets | ONPRINT',
    metaDescription: 'High-volume commercial flyers, bi-fold & tri-fold brochures, booklets, catalogs, and restaurant menus printed in Dubai on German Heidelberg presses.',
    iconName: 'Megaphone',
    heroImage: '/uploads/categories/flyers-printing-in-dubai.jpg',
    subcategories: [
      {
        slug: 'flyers-printing-in-dubai',
        name: 'Marketing Flyers & Leaflets',
        shortDesc: 'A5, A4, DL, luxury gold foil, and custom die-cut flyers on 170–350 GSM gloss or silk art paper.',
        image: '/assets/products/flyers/flyer-a5-promotional.jpg',
        featuredBadge: 'Same-Day Dispatch',
        productSlugs: [
          'a5-promotional-flyers',
          'a4-business-flyers',
          'dl-event-flyers',
          'luxury-gold-foil-flyers',
          'door-hangers-printing',
          'postcards-printing',
          'folded-leaflets-flyers',
          'gloss-matte-flyers',
          'a6-pocket-flyers',
          'kraft-eco-flyers',
          'die-cut-flyers',
        ],
      },
      {
        slug: 'brochures-printing',
        name: 'Folded Corporate Brochures',
        shortDesc: 'Bi-fold, tri-fold, gate-fold, and z-fold brochures with velvet soft-touch finish.',
        image: '/assets/products/brochure_trifold.jpg',
        featuredBadge: 'Precision Folding',
        productSlugs: [
          'digital-offset-printing',
          'bi-fold-brochures-printing',
          'tri-fold-brochures-printing',
          'gate-fold-brochures-printing',
          'z-fold-leaflets-printing',
        ],
      },
      {
        slug: 'catalogs-booklets-printing',
        name: 'Catalogs & Corporate Booklets',
        shortDesc: 'Saddle-stitched and perfect-bound annual reports, product catalogs & company profiles.',
        image: '/assets/products/brochures.jpg',
        featuredBadge: 'Multi-Page Binding',
        productSlugs: [
          'catalogs-booklets-printing',
          'annual-reports-printing',
        ],
      },
      {
        slug: 'hospitality-event-printing',
        name: 'Hospitality & Event Stationery',
        shortDesc: 'Spill-resistant restaurant menus, acrylic table talkers & luxury wedding invitation suites.',
        image: '/assets/products/1 (14).jpg',
        featuredBadge: 'Hospitality Grade',
        productSlugs: [
          'greeting-cards-printing',
          'restaurant-menus-printing',
          'wedding-invitation-suites',
        ],
      },
    ],
  },
  {
    id: 'stickers-labels-packaging',
    slug: 'stickers-labels-packaging',
    name: 'Stickers & Product Labels',
    shortName: 'Stickers & Labels',
    eyebrow: 'DIE-CUT & PACKAGING',
    badge: 'Waterproof & UV',
    description: 'Custom die-cut vinyl stickers, waterproof roll labels, metallic foil labels, clear packaging decals, and 3D domed epoxy badges.',
    metaTitle: 'Custom Stickers & Product Labels Printing Dubai | Waterproof Decals | ONPRINT',
    metaDescription: 'Custom die-cut vinyl stickers, product packaging roll labels, metallic gold foil stickers, and 3D epoxy resin dome badges in Dubai.',
    iconName: 'Tag',
    heroImage: '/uploads/categories/stickers-labels-printing.jpg',
    subcategories: [
      {
        slug: 'stickers-labels-printing',
        name: 'Stickers & Product Labels',
        shortDesc: 'Die-cut vinyl, roll labels, gold foil, holographic, waterproof packaging & 3D domed epoxy decals.',
        image: '/assets/products/stickers/die-cut-vinyl-stickers.jpg',
        featuredBadge: 'Full Variety',
        productSlugs: [
          'die-cut-stickers',
          'waterproof-vinyl-stickers',
          'custom-roll-labels',
          'clear-transparent-stickers',
          'holographic-stickers',
          'cosmetic-bottle-labels',
          'gold-foil-stickers',
          'kraft-paper-stickers',
          'domed-epoxy-stickers',
        ],
      },
    ],
  },
  {
    id: 'signage-displays-banners',
    slug: 'signage-displays-banners',
    name: 'Signage, Displays & Banners',
    shortName: 'Signage & Displays',
    eyebrow: 'TRADE SHOWS & EXHIBITIONS',
    badge: 'Large Format',
    description: 'Heavy-duty roll-up banner stands, outdoor tear-drop event flags, rigid foam boards, acrylic wall signs, and executive door plaques.',
    metaTitle: 'Roll-Up Banners & Exhibition Signage Printing Dubai | ONPRINT',
    metaDescription: 'Retractable roll-up banners (85x200cm), teardrop flags, acrylic office signs, foam board displays, and magnetic staff name badges in Dubai.',
    iconName: 'Layers',
    heroImage: '/uploads/categories/rollup-banners.jpg',
    subcategories: [
      {
        slug: 'rollup-banners',
        name: 'Roll-Up Banner Stands',
        shortDesc: 'Standard 85x200, Wide 100x200, Teardrop, Giant backdrop & Double-sided pull-up banners.',
        image: '/assets/products/rollup_banner_showcase.jpg',
        featuredBadge: 'DWTC Event Ready',
        productSlugs: [
          'standard-rollup-banner-85x200',
          'luxury-teardrop-rollup-banner',
          'wide-exhibition-rollup-banner-100x200',
          'giant-backdrop-rollup-banner-120x200',
          'double-sided-rollup-banner-85x200',
          'desktop-mini-rollup-banner',
          'outdoor-wind-resistant-rollup-banner',
          'executive-matte-black-rollup-banner',
        ],
      },
      {
        slug: 'signage-banners-printing',
        name: 'Signage & Event Displays',
        shortDesc: 'Outdoor teardrop beach flags, rigid foam boards, acrylic wall signs & large format posters.',
        image: '/assets/products/flags.jpg',
        featuredBadge: 'Outdoor & Indoor',
        productSlugs: [
          'beach-flags',
          'large-format-posters',
          'foam-board-signage',
          'wall-acrylic-signage',
        ],
      },
      {
        slug: 'name-badges-printing-dubai',
        name: 'Name Badges & Architectural Plaques',
        shortDesc: 'Brushed gold & silver magnetic badges, 20mm acrylic desk nameplates, 3D epoxy staff badges & metal wall signs.',
        image: '/uploads/categories/name-badges-printing-dubai.jpg',
        featuredBadge: 'Executive Metal',
        productSlugs: [
          'acrylic-nameplates',
          'metal-name-signs',
          'professional-magnetic-metal-name-badges',
          'domed-epoxy-magnetic-staff-badges',
          'reusable-window-magnetic-badges',
          'executive-matte-black-magnetic-badges',
        ],
      },
    ],
  },
  {
    id: 'specialty-corporate-gifts',
    slug: 'specialty-corporate-gifts',
    name: 'Specialty Printing & Corporate Gifts',
    shortName: 'Gifts & Specialty',
    eyebrow: 'VIP CLIENT MERCHANDISE',
    badge: 'Custom Branded',
    description: 'Laser-engraved thermal flasks, smart LED bottles, ceramic coffee mugs, PVC ID access cards, conference lanyards, and corporate polo apparel.',
    metaTitle: 'Corporate Gifts & Promotional Merchandise Dubai | Water Bottles & Mugs | ONPRINT',
    metaDescription: 'Custom printed water bottles, thermal flasks, ceramic coffee mugs, USB tech sets, branded neck lanyards, and PVC staff ID cards in Dubai with fast dispatch.',
    iconName: 'Gift',
    heroImage: '/uploads/categories/corporate-gift-items.jpg',
    subcategories: [
      {
        slug: 'bottle-printing-dubai',
        name: 'Custom Water Bottles & Flasks',
        shortDesc: 'Double-wall stainless steel thermal bottles, smart LED temperature flasks, sports aluminium & bamboo glass bottles.',
        image: '/assets/products/bottle_smart_led.jpg',
        featuredBadge: 'Laser Engraved',
        productSlugs: [
          'smart-led-temperature-bottles',
          'matte-stainless-steel-bottles',
          'aluminium-sports-water-bottles',
          'borosilicate-glass-bamboo-bottles',
          'ergonomic-gym-protein-shakers',
          'luxury-copper-insulated-flasks',
        ],
      },
      {
        slug: 'mug-printing-dubai',
        name: 'Custom Ceramic Mugs & Tumblers',
        shortDesc: 'Classic white ceramic mugs, two-tone mugs, magic heat-changing mugs, matte black gold mugs & travel tumblers.',
        image: '/assets/products/mug_matte_black_gold.jpg',
        featuredBadge: 'Vibrant CMYK',
        productSlugs: [
          'classic-white-ceramic-mugs',
          'two-tone-ceramic-mugs',
          'magic-heat-sensitive-mugs',
          'executive-matte-black-mugs',
          'stainless-steel-travel-mugs',
          'vintage-enamel-camping-mugs',
        ],
      },
      {
        slug: 'lanyard-printing-dubai',
        name: 'Branded Neck Lanyards',
        shortDesc: 'Satin dye-sublimation, woven jacquard, safety breakaway, eco RPET, and retractable badge reel lanyards.',
        image: '/assets/products/lanyards/standard-polyester-lanyard.jpg',
        featuredBadge: 'Conference Ready',
        productSlugs: [
          'standard-polyester-lanyards',
          'satin-dye-sublimation-lanyards',
          'safety-breakaway-lanyards',
          'double-clip-conference-lanyards',
          'woven-jacquard-lanyards',
          'retractable-badge-reel-lanyards',
          'eco-friendly-rpet-lanyards',
          'reflective-hi-vis-lanyards',
        ],
      },
      {
        slug: 'id-card-printing-dubai',
        name: 'PVC ID Cards & Access Badges',
        shortDesc: 'High-security UV PVC cards, raised 3D spot UV cards, frosted translucent cards & RFID/NFC smart cards.',
        image: '/assets/products/id-cards/uv_standard_pvc_id.jpg',
        featuredBadge: 'CR80 Standard',
        productSlugs: [
          'standard-uv-pvc-id-cards',
          'raised-3d-spot-uv-id-cards',
          'frosted-translucent-uv-id-cards',
          'matte-anti-scratch-uv-id-cards',
          'metallic-luster-uv-id-cards',
          'high-gloss-photo-uv-id-cards',
        ],
      },
      {
        slug: 'promotional-drinkware-tech',
        name: 'Promotional Tech & Drinkware Sets',
        shortDesc: 'Personalized drinkware, branded power banks, USB drives & desk accessories.',
        image: '/assets/products/bottle_matte_thermal.jpg',
        featuredBadge: 'Executive Tech',
        productSlugs: [
          'personalized-water-bottles',
          'custom-printed-mugs',
          'custom-usb-flash-drives',
          'power-banks-printing',
          'mouse-pad-printing',
        ],
      },
      {
        slug: 'corporate-gift-items',
        name: 'Promotional Merchandise & Gifts',
        shortDesc: 'Cotton tote bags, custom engraved wooden keychains & luxury welcome gift sets.',
        image: '/assets/products/luxury_corporate_gifts_dubai.jpg',
        featuredBadge: 'VIP Giveaways',
        productSlugs: [
          'custom-branded-tote-bags',
          'engraved-keychains',
          'corporate-gift-sets',
        ],
      },
      {
        slug: 'custom-apparel-printing',
        name: 'Custom Apparel & Uniforms',
        shortDesc: 'Screen printed & embroidered corporate polo shirts, hoodies & branded promotional caps.',
        image: '/assets/products/1 (3).jpg',
        featuredBadge: 'Staff Uniforms',
        productSlugs: [
          'tshirt-screen-printing',
          'custom-cap-printing',
        ],
      },
    ],
  },
]

// Department Slug Set for fast O(1) identification
export const DEPARTMENT_SLUGS = new Set(MASTER_DEPARTMENTS.map((d) => d.slug))

// Map subcategory slug to parent department
const subcategoryToDepartmentMap = new Map()
const productSlugToDepartmentMap = new Map()

MASTER_DEPARTMENTS.forEach((dept) => {
  dept.subcategories.forEach((sub) => {
    subcategoryToDepartmentMap.set(sub.slug, dept)
    sub.productSlugs.forEach((pSlug) => {
      productSlugToDepartmentMap.set(pSlug, dept)
    })
  })
})

export function isDepartmentSlug(slug) {
  if (!slug) return false
  return DEPARTMENT_SLUGS.has(String(slug).toLowerCase().trim())
}

export function getDepartmentBySlug(slug) {
  if (!slug) return null
  const clean = String(slug).toLowerCase().trim()
  return MASTER_DEPARTMENTS.find((d) => d.slug === clean) || null
}

export function getDepartmentForCategory(categorySlug) {
  if (!categorySlug) return null
  const clean = String(categorySlug).toLowerCase().trim()
  return subcategoryToDepartmentMap.get(clean) || null
}

export function getDepartmentForProduct(productSlug) {
  if (!productSlug) return null
  const clean = String(productSlug).toLowerCase().trim()
  return productSlugToDepartmentMap.get(clean) || null
}

export function getAllDepartments() {
  return MASTER_DEPARTMENTS
}

export function getAllSubcategories() {
  const list = []
  MASTER_DEPARTMENTS.forEach((dept) => {
    dept.subcategories.forEach((sub) => {
      list.push({
        ...sub,
        departmentSlug: dept.slug,
        departmentName: dept.name,
      })
    })
  })
  return list
}
