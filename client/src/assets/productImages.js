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

export const productSlugImageMap = {
  'mug-printing-dubai': img1,
  'mugs-printing-dubai': img1,
  'water-bottles-printing-dubai': img13,
  'custom-water-bottles-printing-in-dubai': img13,
  'custom-mouse-pad': img2,
  't-shirt-printing-dubai': img3,
  'cap-printing-dubai': img4,
  'notebook-printing': img5,
  'pens-printing': img6,
  'business-cards-printing': img7,
  'letterhead-printing-dubai': img8,
  'roll-up-printing-dubai': img9,
  'flag-printing-dubai': img10,
  'stickers-printing-dubai': img11,
  'name-plate-printing-dubai': img12,
}

export function getProductImage(product) {
  if (!product) return img1
  if (product.slug && productSlugImageMap[product.slug]) {
    return productSlugImageMap[product.slug]
  }
  if (product.images?.[0] && !product.images[0].startsWith('http')) {
    return product.images[0]
  }
  return product.images?.[0] || product.image || img1
}
