import toteBagsImg from './products/tote_bags.jpg'
import keychainImg from './products/wooden_keychain.jpg'
import mugsImg from './products/mugs.jpg'
import bottlesImg from './products/water_bottles.jpg'
import flyersImg from './products/flyers.jpg'
import brochuresImg from './products/brochures.jpg'
import badgesImg from './products/name_badges.jpg'
import idCardsImg from './products/id_cards.jpg'
import rollupImg from './products/rollup_banner.jpg'
import flagsImg from './products/flags.jpg'
import stickersImg from './products/stickers.jpg'
import namePlatesImg from './products/name_plates.jpg'
import img1 from './products/1 (1).jpg'
import img2 from './products/1 (2).jpg'
import img3 from './products/1 (3).jpg'
import img4 from './products/1 (4).jpg'
import img5 from './products/1 (5).jpg'
import img6 from './products/1 (6).jpg'
import img7 from './products/1 (7).jpg'
import img8 from './products/1 (8).jpg'
import img9 from './products/1 (9).jpg'
import img10 from './products/1 (10).jpg'
import img11 from './products/1 (11).jpg'
import img12 from './products/1 (12).jpg'
import img13 from './products/1 (13).jpg'
import img14 from './products/1 (14).jpg'
import img15 from './products/1 (15).jpg'
import softTouchBusinessCardImg from './products/card-soft-touch.jpg'
import velvetFoilBusinessCardImg from './products/card-velvet-foil.jpg'
import paintedEdgeBusinessCardImg from './products/card-painted-edge.jpg'
import serviceDigitalOffsetImg from './products/service_digital_offset.jpg'
import serviceLuxuryPackagingImg from './products/service_luxury_packaging.jpg'
import serviceCorporateGiftsImg from './products/service_corporate_gifts.jpg'
import serviceStickersLabelsImg from './products/service_stickers_labels.jpg'
import serviceExecutiveStationeryImg from './products/service_executive_stationery.jpg'
import serviceExhibitionSignageImg from './products/service_exhibition_signage.jpg'
import brochureBifoldImg from './products/brochure_bifold.jpg'
import brochureTrifoldImg from './products/brochure_trifold.jpg'
import brochureBookletImg from './products/brochure_booklet_catalog.jpg'
import brochureGatefoldImg from './products/brochure_gatefold.jpg'
import brochureZfoldImg from './products/brochure_zfold.jpg'
import luxuryBusinessCardsDubaiImg from './products/luxury_business_cards_dubai.jpg'
import luxuryCorporateGiftsDubaiImg from './products/luxury_corporate_gifts_dubai.jpg'

// Dedicated high-resolution Mug variety images
import mugWhiteCeramicImg from './products/mug_white_ceramic.jpg'
import mugTwoToneImg from './products/mug_two_tone.jpg'
import mugMagicHeatImg from './products/mug_magic_heat.jpg'
import mugMatteBlackGoldImg from './products/mug_matte_black_gold.jpg'
import mugTravelTumblerImg from './products/mug_travel_tumbler.jpg'
import mugVintageEnamelImg from './products/mug_vintage_enamel.jpg'

// Dedicated high-resolution Water Bottle variety images
import bottleSmartLedImg from './products/bottle_smart_led.jpg'
import bottleMatteThermalImg from './products/bottle_matte_thermal.jpg'
import bottleSportsAluminiumImg from './products/bottle_sports_aluminium.jpg'
import bottleGlassBambooImg from './products/bottle_glass_bamboo.jpg'
import bottleProteinShakerImg from './products/bottle_protein_shaker.jpg'
import bottleLuxuryCopperImg from './products/bottle_luxury_copper.jpg'

import { categoryImageMap, getCategoryImages as getMapCategoryImages } from './categoryImageMap'

const businessCardsImg = '/uploads/categories/business-cards-printing.jpg'
const penPrintingImg = '/uploads/categories/letterheads-printing-dubai.jpg'
const letterheadImg = '/assets/products/letterhead-printing.svg'
const standardBusinessCardImg = '/assets/products/business-card-standard.svg'

export const productImages = {
  toteBags: toteBagsImg,
  keychain: keychainImg,
  mugs: mugsImg,
  bottles: bottlesImg,
  flyers: flyersImg,
  brochures: brochuresImg,
  brochureBifold: brochureBifoldImg,
  brochureTrifold: brochureTrifoldImg,
  brochureBooklet: brochureBookletImg,
  brochureGatefold: brochureGatefoldImg,
  brochureZfold: brochureZfoldImg,
  badges: badgesImg,
  idCards: idCardsImg,
  rollup: rollupImg,
  flags: flagsImg,
  stickers: stickersImg,
  namePlates: namePlatesImg,
  softTouchCard: softTouchBusinessCardImg,
  velvetFoilCard: velvetFoilBusinessCardImg,
  paintedEdgeCard: paintedEdgeBusinessCardImg,
  serviceDigitalOffset: serviceDigitalOffsetImg,
  serviceLuxuryPackaging: serviceLuxuryPackagingImg,
  serviceCorporateGifts: serviceCorporateGiftsImg,
  serviceStickersLabels: serviceStickersLabelsImg,
  serviceExecutiveStationery: serviceExecutiveStationeryImg,
  serviceExhibitionSignage: serviceExhibitionSignageImg,

  // Mugs
  mugWhiteCeramic: mugWhiteCeramicImg,
  mugTwoTone: mugTwoToneImg,
  mugMagicHeat: mugMagicHeatImg,
  mugMatteBlackGold: mugMatteBlackGoldImg,
  mugTravelTumbler: mugTravelTumblerImg,
  mugVintageEnamel: mugVintageEnamelImg,

  // Bottles
  bottleSmartLed: bottleSmartLedImg,
  bottleMatteThermal: bottleMatteThermalImg,
  bottleSportsAluminium: bottleSportsAluminiumImg,
  bottleGlassBamboo: bottleGlassBambooImg,
  bottleProteinShaker: bottleProteinShakerImg,
  bottleLuxuryCopper: bottleLuxuryCopperImg,
}

export const productSlugImageMap = {
  // Service / category-page slug mappings
  'brochures-printing': brochuresImg,
  'brochures-printing-dubai': brochuresImg,
  'business-cards-printing': businessCardsImg,
  'business-cards-printing-dubai': businessCardsImg,
  'flyers-printing-in-dubai': flyersImg,
  'flyers-printing-dubai': flyersImg,
  'id-card-printing-dubai': idCardsImg,
  'lanyard-printing-dubai': badgesImg,
  'letterheads-printing-dubai': letterheadImg,
  'letterhead-printing-dubai': letterheadImg,
  'name-badges-printing-dubai': badgesImg,
  'mug-printing-dubai': mugWhiteCeramicImg,
  'mugs-printing-dubai': mugWhiteCeramicImg,
  'bottle-printing-dubai': bottleSmartLedImg,
  'water-bottle-printing-dubai': bottleSmartLedImg,
  'water-bottles-printing-dubai': bottleSmartLedImg,
  'digital-offset-printing': serviceDigitalOffsetImg,
  'luxury-packaging-custom-boxes': serviceLuxuryPackagingImg,
  'corporate-gift-customization': luxuryCorporateGiftsDubaiImg,
  'corporate-gift-items': luxuryCorporateGiftsDubaiImg,
  'corporate-gifts-dubai': luxuryCorporateGiftsDubaiImg,
  'promotional-corporate-gifting-dubai-vip-ideas': luxuryCorporateGiftsDubaiImg,
  'business-card-design-printing': luxuryBusinessCardsDubaiImg,
  'how-to-choose-business-card-paper-dubai': luxuryBusinessCardsDubaiImg,
  'choosing-printing-company-dubai': serviceDigitalOffsetImg,
  'printing-services-dubai': serviceDigitalOffsetImg,
  'custom-labels-die-cut-stickers': serviceStickersLabelsImg,
  'executive-business-stationery': serviceExecutiveStationeryImg,
  'office-stationery-printing': serviceExecutiveStationeryImg,
  'large-format-exhibition-signage': serviceExhibitionSignageImg,
  'packaging-printing-dubai': serviceLuxuryPackagingImg,
  'custom-packaging-dubai': serviceLuxuryPackagingImg,
  'custom-branded-tote-bags': toteBagsImg,

  // Mug Products
  'classic-white-ceramic-mugs': mugWhiteCeramicImg,
  'custom-printed-mugs': mugWhiteCeramicImg,
  'two-tone-ceramic-mugs': mugTwoToneImg,
  'magic-heat-sensitive-mugs': mugMagicHeatImg,
  'executive-matte-black-mugs': mugMatteBlackGoldImg,
  'stainless-steel-travel-mugs': mugTravelTumblerImg,
  'vintage-enamel-camping-mugs': mugVintageEnamelImg,

  // Water Bottle Products
  'smart-led-temperature-bottles': bottleSmartLedImg,
  'personalized-water-bottles': bottleSmartLedImg,
  'matte-stainless-steel-bottles': bottleMatteThermalImg,
  'aluminium-sports-water-bottles': bottleSportsAluminiumImg,
  'borosilicate-glass-bamboo-bottles': bottleGlassBambooImg,
  'ergonomic-gym-protein-shakers': bottleProteinShakerImg,
  'luxury-copper-insulated-flasks': bottleLuxuryCopperImg,

  // Cards & Stationery
  'premium-business-cards': businessCardsImg,
  'standard-business-cards': businessCardsImg,
  'premium-soft-touch-business-cards': softTouchBusinessCardImg,
  'soft-touch-business-cards': softTouchBusinessCardImg,
  'velvet-foil-business-cards': velvetFoilBusinessCardImg,
  'luxury-velvet-business-cards': velvetFoilBusinessCardImg,
  'luxury-painted-edge-business-cards': paintedEdgeBusinessCardImg,
  'painted-edge-business-cards': paintedEdgeBusinessCardImg,
  'acrylic-nameplates': namePlatesImg,
  'roll-up-banners': rollupImg,
  'beach-flags': flagsImg,
  'die-cut-stickers': serviceStickersLabelsImg,
  'engraved-keychains': keychainImg,
  'executive-notebooks': serviceExecutiveStationeryImg,
  'bi-fold-brochures-printing': brochureBifoldImg,
  'corporate-bi-fold-brochures': brochureBifoldImg,
  'bi-fold-brochure-printing': brochureBifoldImg,
  'bi-fold-brochures': brochureBifoldImg,
  'tri-fold-brochures-printing': brochureTrifoldImg,
  'tri-fold-brochure-printing': brochureTrifoldImg,
  'tri-fold-brochures': brochureTrifoldImg,
  'gate-fold-brochures-printing': brochureGatefoldImg,
  'gate-fold-brochure-printing': brochureGatefoldImg,
  'gate-fold-brochures': brochureGatefoldImg,
  'luxury-gate-fold-brochures': brochureGatefoldImg,
  'z-fold-leaflets-printing': brochureZfoldImg,
  'z-fold-brochures-leaflets': brochureZfoldImg,
  'z-fold-brochures': brochureZfoldImg,
  'z-fold-leaflets': brochureZfoldImg,
  'brochures-catalogs-printing': brochureBookletImg,
  'catalogs-booklets-printing': brochureBookletImg,
  'multipage-booklet-brochures': brochureBookletImg,
  'annual-reports-printing': brochureBookletImg,
  'presentation-folders': img9,
  'raised-ink-business-cards': velvetFoilBusinessCardImg,
  'plastic-pvc-business-cards': softTouchBusinessCardImg,
  'large-format-posters': img9,
  'door-hangers-printing': flyersImg,
  'postcards-printing': img3,
  'student-id-cards': idCardsImg,
  'access-control-cards': img4,
  'visitor-pass-cards': badgesImg,
  'custom-usb-flash-drives': img2,
  'corporate-gift-sets': img5,
  'power-banks-printing': bottlesImg,
  'printed-envelopes': letterheadImg,
  'desk-pads-printing': img2,
  'stationery-gift-sets': img11,
  'foam-board-signage': img9,
  'metal-name-signs': namePlatesImg,
  'wall-acrylic-signage': img12,
  'calendars-printing': img7,
  'greeting-cards-printing': img6,
  'printed-paper-bags': toteBagsImg,
  'food-packaging-boxes': img13,
  'restaurant-menus-printing': img14,
  'wedding-invitation-suites': img15,
  'tshirt-screen-printing': img3,
  'custom-cap-printing': img4,
  'mouse-pad-printing': img2,
  'bags-printing-dubai': toteBagsImg,
  'tote-bags-printing-dubai': toteBagsImg,
  'keychain-printing-dubai': keychainImg,
  'wooden-keychain-printing': keychainImg,
  'roll-up-printing-in-dubai': rollupImg,
  'roll-up-printing-dubai': rollupImg,
  'flags-printing-in-dubai': flagsImg,
  'flag-printing-dubai': flagsImg,
  'stickers-printing-in-dubai': stickersImg,
  'stickers-printing-dubai': stickersImg,
  'name-plates-printing-in-dubai': namePlatesImg,
  'name-plate-printing-dubai': namePlatesImg,
  'custom-mouse-pad': img2,
  't-shirt-printing-dubai': img3,
  'cap-printing-dubai': img4,
  'notebook-printing': img5,
  'pens-printing': penPrintingImg,
  'pen-printing': penPrintingImg,
}

/** Map category slugs → best matching hero image */
export const categorySlugImageMap = {
  'brochures-printing': brochuresImg,
  'business-cards-printing': businessCardsImg,
  'flyers-printing-in-dubai': flyersImg,
  'id-card-printing-dubai': idCardsImg,
  'lanyard-printing-dubai': badgesImg,
  'letterheads-printing-dubai': letterheadImg,
  'name-badges-printing-dubai': badgesImg,
  'mug-printing-dubai': mugWhiteCeramicImg,
  'bottle-printing-dubai': bottleSmartLedImg,
  'luxury-packaging-boxes': serviceLuxuryPackagingImg,
  'corporate-gift-items': luxuryCorporateGiftsDubaiImg,
  'signage-banners-printing': serviceExhibitionSignageImg,
  'custom-apparel-printing': img3,
  'stickers-labels-printing': serviceStickersLabelsImg,
  'catalogs-booklets-printing': brochureBookletImg,
  'office-stationery-printing': serviceExecutiveStationeryImg,
  'hospitality-event-printing': img14,
  'promotional-drinkware-tech': bottlesImg,
  'other-products': rollupImg,
}

/**
 * Keyword fragments in product slug/name → image.
 * Used as last-resort before the generic placeholder.
 */
const slugKeywordImageMap = [
  [['digital & offset', 'digital offset', 'offset printing', 'digital printing'], serviceDigitalOffsetImg],
  [['luxury packaging', 'packaging & custom', 'custom boxes', 'custom box', 'rigid box', 'rigid packaging'], serviceLuxuryPackagingImg],
  [['corporate gift', 'gift customization', 'corporate gifts', 'merchandise'], serviceCorporateGiftsImg],
  [['custom labels', 'die-cut stickers', 'die cut stickers', 'labels & die-cut', 'stickers & labels'], serviceStickersLabelsImg],
  [['executive business stationery', 'business stationery', 'office stationery', 'stationery suite'], serviceExecutiveStationeryImg],
  [['exhibition signage', 'large format', 'exhibition displays', 'trade show display'], serviceExhibitionSignageImg],
  [['painted edge', 'painted-edge', 'painted-edges', 'painted edges'], paintedEdgeBusinessCardImg],
  [['velvet foil', 'velvet-foil', 'foil card', 'gold foil card'], velvetFoilBusinessCardImg],
  [['soft touch', 'soft-touch'], softTouchBusinessCardImg],
  [['bi-fold', 'bifold', '4-panel brochure', 'bi fold'], brochureBifoldImg],
  [['tri-fold', 'trifold', '6-panel brochure', 'tri fold', 'letter-fold'], brochureTrifoldImg],
  [['gate-fold', 'gatefold', 'gate fold'], brochureGatefoldImg],
  [['z-fold', 'zfold', 'z fold', 'accordion brochure'], brochureZfoldImg],
  [['booklet', 'catalog', 'catalogue', 'lookbook'], brochureBookletImg],
  [['annual report', 'annual-report', 'company profile'], brochureBookletImg],
  [['brochure', 'leaflet', 'pamphlet'], brochureBifoldImg],

  // Specific Mug Keywords
  [['magic heat', 'heat sensitive', 'magic mug', 'color changing mug'], mugMagicHeatImg],
  [['two-tone', 'two tone', 'accent mug', 'colored interior'], mugTwoToneImg],
  [['matte black mug', 'executive mug', 'gold crest mug', 'black ceramic mug'], mugMatteBlackGoldImg],
  [['travel mug', 'tumbler', 'travel tumbler', 'flip lid'], mugTravelTumblerImg],
  [['enamel mug', 'camping mug', 'vintage enamel'], mugVintageEnamelImg],
  [['white ceramic', 'sublimation mug', 'ceramic mug', 'coffee mug', 'mug'], mugWhiteCeramicImg],

  // Specific Bottle Keywords
  [['smart led', 'led temperature', 'digital flask', 'temperature bottle', 'aquasmart'], bottleSmartLedImg],
  [['matte thermal', 'matte stainless', 'apex hydration', 'matte bottle'], bottleMatteThermalImg],
  [['sports bottle', 'aluminium bottle', 'aluminum bottle', 'carabiner', 'fuel the run'], bottleSportsAluminiumImg],
  [['glass bottle', 'bamboo lid', 'silicone sleeve', 'pure eco', 'borosilicate'], bottleGlassBambooImg],
  [['protein shaker', 'shaker bottle', 'gym bottle', 'core elite'], bottleProteinShakerImg],
  [['copper insulated', 'copper flask', 'executive edition', 'luxury bottle', 'copper bottle'], bottleLuxuryCopperImg],
  [['bottle', 'flask', 'drinkware', 'water bottle'], bottleSmartLedImg],

  [['business card', 'visiting card', 'card printing'], businessCardsImg],
  [['flyer', 'leaflet', 'handbill'], flyersImg],
  [['tote bag', 'canvas bag', 'shopping bag', 'cotton bag'], toteBagsImg],
  [['roll-up', 'rollup', 'pull-up banner', 'retractable banner'], rollupImg],
  [['id card', 'pvc card', 'badge card', 'smart card'], idCardsImg],
  [['lanyard', 'neck strap', 'ribbon'], badgesImg],
  [['name badge', 'name tag', 'magnetic badge', 'staff badge'], badgesImg],
  [['nameplate', 'name plate', 'door sign', 'desk sign'], namePlatesImg],
  [['sticker', 'label', 'decal'], serviceStickersLabelsImg],
  [['flag', 'beach flag', 'feather flag', 'teardrop'], flagsImg],
  [['keychain', 'key ring', 'keyring'], keychainImg],
  [['letterhead', 'stationery', 'official paper'], letterheadImg],
]

/**
 * Robust product image resolver.
 * Priority order:
 *  1. If product has a dedicated slug mapping AND raw image is a generic seed/placeholder, prefer slug mapping
 *  2. Explicit URL on product (if valid, non-placeholder, and non-generic)
 *  3. Explicit imageKey matching productImages
 *  4. Product slug exact match in productSlugImageMap
 *  5. Keyword fuzzy match in slug/name
 *  6. Category slug match in categorySlugImageMap
 *  7. Fallback to generic product shot
 */
export function resolveProductImage(product) {
  if (!product) return img1

  // 1. If we have a dedicated product slug mapping, check whether the raw image is a known generic placeholder
  if (product.slug && productSlugImageMap[product.slug]) {
    const slugImg = productSlugImageMap[product.slug]
    const rawImg = product.image_url || product.image || (product.images && product.images[0])
    // If rawImg is empty, placeholder, SVG, generic category hero, or default seed, return dedicated slug image
    if (
      !rawImg ||
      typeof rawImg !== 'string' ||
      rawImg === businessCardsImg ||
      rawImg.includes('/uploads/categories/') ||
      rawImg.includes('business-cards-printing.jpg') ||
      rawImg.includes('brochures-printing.jpg') ||
      rawImg.includes('flyers-printing-in-dubai.jpg') ||
      rawImg.includes('trae.ai') ||
      rawImg.includes('1 (1).jpg') ||
      rawImg.includes('1%20(1).jpg') ||
      rawImg.includes('1 (5).jpg') ||
      rawImg.includes('/assets/products/1 (') ||
      rawImg.endsWith('.svg')
    ) {
      return slugImg
    }
  }

  // 2. Prefer explicit URL already on the product (from DB upload)
  //    Skip generic DB default placeholder images, duplicate category images for specific cards, or old SVGs
  const rawImg = product.image_url || product.image || (product.images && product.images[0])
  if (
    typeof rawImg === 'string' &&
    rawImg.trim() !== '' &&
    !rawImg.includes('trae.ai') &&
    !rawImg.includes('1 (1).jpg') &&
    !rawImg.includes('1%20(1).jpg') &&
    !rawImg.includes('/assets/products/1 (') &&
    !rawImg.endsWith('.svg')
  ) {
    return rawImg
  }

  // 3. Explicit imageKey set on product object
  if (product.imageKey && productImages[product.imageKey]) {
    return productImages[product.imageKey]
  }

  // 4. Product slug exact match
  if (product.slug && productSlugImageMap[product.slug]) {
    return productSlugImageMap[product.slug]
  }

  // 5. Keyword-in-slug/name fuzzy match (e.g. "painted edge", "velvet foil", "soft touch")
  const combinedText = `${product.slug || ''} ${product.name || ''}`.toLowerCase()
  for (const [keywords, img] of slugKeywordImageMap) {
    if (keywords.some((kw) => combinedText.includes(kw))) {
      return img
    }
  }

  // 6. Category slug exact match
  const catSlug =
    (typeof product.category === 'object' ? product.category?.slug : null) ||
    product.categorySlug ||
    ''
  if (catSlug && categorySlugImageMap[catSlug]) {
    return categorySlugImageMap[catSlug]
  }

  // 7. Absolute last resort — generic image
  return img1
}

export function getProductCategoriesWithImages(product) {
  if (!product) return []
  const cats = product.categories || []
  const slug = product.slug || ''
  return cats.map((cat) => {
    const catSlug = typeof cat === 'object' ? (cat.slug || '') : cat
    const catObj = typeof cat === 'object' ? cat : { slug: catSlug, name: catSlug }
    const existingImages = Array.isArray(catObj.images) && catObj.images.length > 0 ? catObj.images : []
    const mappedImages = slug && catSlug ? getMapCategoryImages(slug, catSlug) : []
    const images = existingImages.length > 0 ? existingImages : mappedImages
    return { ...catObj, images }
  })
}

export function getProductCategoryImages(product, categorySlug) {
  if (!product || !categorySlug) return []
  const categories = getProductCategoriesWithImages(product)
  const match = categories.find((c) => c.slug === categorySlug)
  return match?.images || []
}

export function getAllProductCategoryImages(product) {
  if (!product) return []
  const categories = getProductCategoriesWithImages(product)
  const result = []
  for (const cat of categories) {
    for (let i = 0; i < (cat.images || []).length; i++) {
      result.push({
        categorySlug: cat.slug,
        categoryName: cat.name,
        url: cat.images[i],
        imageIndex: i,
      })
    }
  }
  return result
}

// Canonical alias for components expecting getProductImage
export const getProductImage = resolveProductImage

/**
 * Resolver for blog cover images
 */
export function getBlogCoverImage(post) {
  if (!post) return img1
  const raw = post.featured_image || post.cover_image || post.image_url || post.image
  if (typeof raw === 'string' && raw.trim() !== '' && !raw.includes('trae.ai')) {
    return raw
  }
  if (post.category_slug && categorySlugImageMap[post.category_slug]) {
    return categorySlugImageMap[post.category_slug]
  }
  if (post.product_slug && productSlugImageMap[post.product_slug]) {
    return productSlugImageMap[post.product_slug]
  }
  return img1
}

export default resolveProductImage

