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

const businessCardsImg = '/uploads/categories/business-cards-printing.jpg'

export const productImages = {
  toteBags: toteBagsImg,
  keychain: keychainImg,
  mugs: mugsImg,
  bottles: bottlesImg,
  flyers: flyersImg,
  brochures: brochuresImg,
  badges: badgesImg,
  idCards: idCardsImg,
  rollup: rollupImg,
  flags: flagsImg,
  stickers: stickersImg,
  namePlates: namePlatesImg,
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
  'letterheads-printing-dubai': img11,
  'letterhead-printing-dubai': img11,
  'name-badges-printing-dubai': badgesImg,
  'digital-offset-printing': flyersImg,
  'luxury-packaging-custom-boxes': img5,
  'custom-branded-tote-bags': toteBagsImg,
  'personalized-water-bottles': bottlesImg,
  'custom-printed-mugs': mugsImg,
  'premium-business-cards': businessCardsImg,
  'standard-business-cards': businessCardsImg,
  'premium-soft-touch-business-cards': businessCardsImg,
  'velvet-foil-business-cards': businessCardsImg,
  'luxury-painted-edge-business-cards': businessCardsImg,
  'acrylic-nameplates': namePlatesImg,
  'roll-up-banners': rollupImg,
  'beach-flags': flagsImg,
  'die-cut-stickers': stickersImg,
  'engraved-keychains': keychainImg,
  'executive-notebooks': img5,
  'brochures-catalogs-printing': brochuresImg,
  'large-format-exhibition-signage': img9,
  'custom-labels-die-cut-stickers': stickersImg,
  'executive-business-stationery': businessCardsImg,

  // Product slug mappings
  'bags-printing-dubai': toteBagsImg,
  'tote-bags-printing-dubai': toteBagsImg,
  'keychain-printing-dubai': keychainImg,
  'wooden-keychain-printing': keychainImg,
  'mug-printing-dubai': mugsImg,
  'mugs-printing-dubai': mugsImg,
  'water-bottles-printing-dubai': bottlesImg,
  'custom-water-bottles-printing-in-dubai': bottlesImg,
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
  'pens-printing': img6,
}

/** Map category slugs → best matching hero image */
export const categorySlugImageMap = {
  'brochures-printing': brochuresImg,
  'business-cards-printing': businessCardsImg,
  'flyers-printing-in-dubai': flyersImg,
  'id-card-printing-dubai': idCardsImg,
  'lanyard-printing-dubai': badgesImg,
  'letterheads-printing-dubai': businessCardsImg,
  'name-badges-printing-dubai': badgesImg,
  'corporate-gift-items': mugsImg,
  'office-stationery-printing': businessCardsImg,
  'other-products': rollupImg,
}

/**
 * Keyword fragments in product slug/name → image.
 * Used as last-resort before the generic placeholder.
 */
const slugKeywordImageMap = [
  [['mug', 'cup', 'flask', 'tumbler'], mugsImg],
  [['bottle', 'water bottle'], bottlesImg],
  [['tote', 'shopper', 'bag'], toteBagsImg],
  [['keychain', 'key-chain', 'keyring'], keychainImg],
  [['flyer', 'leaflet', 'pamphlet'], flyersImg],
  [['brochure', 'catalog', 'catalogue', 'booklet'], brochuresImg],
  [['name badge', 'name-badge', 'staff badge'], badgesImg],
  [['name plate', 'nameplate', 'name-plate', 'door sign'], namePlatesImg],
  [['id card', 'id-card', 'pvc card', 'employee card'], idCardsImg],
  [['lanyard', 'neck strap'], badgesImg],
  [['letterhead', 'business card', 'visiting card', 'stationery'], businessCardsImg],
  [['roll-up', 'rollup', 'banner', 'pull-up', 'backdrop'], rollupImg],
  [['flag', 'beach flag', 'teardrop', 'feather flag'], flagsImg],
  [['sticker', 'label', 'die-cut', 'vinyl'], stickersImg],
  [['notebook', 'diary', 'notepad'], img5],
  [['pen', 'pencil', 'marker'], img6],
  [['t-shirt', 'tshirt', 'shirt', 'apparel', 'hoodie'], img3],
  [['cap', 'hat', 'headwear'], img4],
  [['mouse pad', 'mousepad', 'desk mat'], img2],
  [['signage', 'exhibition', 'display board'], img9],
]

export function getProductImage(product) {
  if (!product) return img1

  // 1. Prefer explicit URL already on the product (from DB upload)
  //    Skip the generic DB default placeholder image
  const rawImg = product.image_url || product.image || (product.images && product.images[0])
  if (
    typeof rawImg === 'string' &&
    rawImg.trim() !== '' &&
    !rawImg.includes('1 (1).jpg') &&
    !rawImg.includes('1%20(1).jpg') &&
    !rawImg.includes('/assets/products/1 (')
  ) {
    return rawImg
  }

  // 2. Explicit imageKey set on product object
  if (product.imageKey && productImages[product.imageKey]) {
    return productImages[product.imageKey]
  }

  // 3. Product slug exact match
  if (product.slug && productSlugImageMap[product.slug]) {
    return productSlugImageMap[product.slug]
  }

  // 4. Category slug exact match
  const catSlug =
    (typeof product.category === 'object' ? product.category?.slug : null) ||
    product.categorySlug ||
    ''
  if (catSlug && categorySlugImageMap[catSlug]) {
    return categorySlugImageMap[catSlug]
  }

  // 5. Keyword-in-slug/name fuzzy match
  const combinedText = `${product.slug || ''} ${product.name || ''}`.toLowerCase()
  for (const [keywords, img] of slugKeywordImageMap) {
    if (keywords.some((kw) => combinedText.includes(kw))) {
      return img
    }
  }

  // 6. Absolute last resort — generic image
  return img1
}
