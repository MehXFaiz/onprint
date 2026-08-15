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
import img2 from './products/1 (2).jpg'
import img3 from './products/1 (3).jpg'
import img4 from './products/1 (4).jpg'
import img5 from './products/1 (5).jpg'
import img6 from './products/1 (6).jpg'
import img7 from './products/1 (7).jpg'
import img8 from './products/1 (8).jpg'

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
  'bags-printing-dubai': toteBagsImg,
  'tote-bags-printing-dubai': toteBagsImg,
  'keychain-printing-dubai': keychainImg,
  'wooden-keychain-printing': keychainImg,
  'mug-printing-dubai': mugsImg,
  'mugs-printing-dubai': mugsImg,
  'water-bottles-printing-dubai': bottlesImg,
  'custom-water-bottles-printing-in-dubai': bottlesImg,
  'flyers-printing-in-dubai': flyersImg,
  'flyers-printing-dubai': flyersImg,
  'brochures-printing': brochuresImg,
  'brochures-printing-dubai': brochuresImg,
  'name-badges-printing-dubai': badgesImg,
  'id-card-printing-dubai': idCardsImg,
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
  'business-cards-printing': img7,
  'letterhead-printing-dubai': img8,
}

export function getProductImage(product) {
  if (!product) return toteBagsImg
  if (product.imageKey && productImages[product.imageKey]) {
    return productImages[product.imageKey]
  }
  if (product.slug && productSlugImageMap[product.slug]) {
    return productSlugImageMap[product.slug]
  }
  if (product.images?.[0] && !product.images[0].startsWith('http')) {
    return product.images[0]
  }
  return product.images?.[0] || product.image || toteBagsImg
}

