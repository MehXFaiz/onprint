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
  // Service mappings
  'brochures-printing': '/uploads/categories/brochures-printing.jpg',
  'brochures-printing-dubai': '/uploads/categories/brochures-printing.jpg',
  'business-cards-printing': '/uploads/categories/business-cards-printing.jpg',
  'business-cards-printing-dubai': '/uploads/categories/business-cards-printing.jpg',
  'flyers-printing-in-dubai': '/uploads/categories/flyers-printing-in-dubai.jpg',
  'flyers-printing-dubai': '/uploads/categories/flyers-printing-in-dubai.jpg',
  'id-card-printing-dubai': '/uploads/categories/id-card-printing-dubai.jpg',
  'lanyard-printing-dubai': '/uploads/categories/lanyard-printing-dubai.jpg',
  'letterheads-printing-dubai': '/uploads/categories/letterheads-printing-dubai.jpg',
  'letterhead-printing-dubai': '/uploads/categories/letterheads-printing-dubai.jpg',
  'name-badges-printing-dubai': '/uploads/categories/name-badges-printing-dubai.jpg',
  'digital-offset-printing': img1,
  'luxury-packaging-custom-boxes': img5,
  'brochures-catalogs-printing': brochuresImg,
  'large-format-exhibition-signage': img9,
  'custom-labels-die-cut-stickers': img10,
  'executive-business-stationery': img11,

  // Product & category mappings
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

export function getProductImage(product) {
  if (!product) return toteBagsImg
  const rawImg = product.image_url || product.image || (product.images && product.images[0])
  if (typeof rawImg === 'string' && rawImg.trim() !== '') {
    return rawImg
  }
  if (product.imageKey && productImages[product.imageKey]) {
    return productImages[product.imageKey]
  }
  if (product.slug && productSlugImageMap[product.slug]) {
    return productSlugImageMap[product.slug]
  }
  return toteBagsImg
}
