const fs = require('fs')
const path = require('path')

const imgJsPath = path.join(__dirname, '..', 'client', 'src', 'assets', 'productImages.js')
let content = fs.readFileSync(imgJsPath, 'utf8')

const imports = `// Roll-Up Banner Varieties
import standardRollupBannerImg from './products/rollup-banners/standard-rollup-banner-85x200.svg'
import luxuryTeardropRollupBannerImg from './products/rollup-banners/luxury-teardrop-rollup-banner-85x200.svg'
import wideExhibitionRollupBannerImg from './products/rollup-banners/wide-exhibition-rollup-banner-100x200.svg'
import giantBackdropRollupBannerImg from './products/rollup-banners/giant-backdrop-rollup-banner-120x200.svg'
import doubleSidedRollupBannerImg from './products/rollup-banners/double-sided-rollup-banner-85x200.svg'
import desktopMiniRollupBannerImg from './products/rollup-banners/desktop-mini-tabletop-rollup-banner.svg'
import rollupShowcaseImg from './products/rollup_banner_showcase.jpg'
`

const mapEntries = `  'standard-rollup-banner-85x200': [standardRollupBannerImg, rollupShowcaseImg],
  'luxury-teardrop-rollup-banner': [luxuryTeardropRollupBannerImg, rollupShowcaseImg],
  'wide-exhibition-rollup-banner-100x200': [wideExhibitionRollupBannerImg, rollupShowcaseImg],
  'giant-backdrop-rollup-banner-120x200': [giantBackdropRollupBannerImg, rollupShowcaseImg],
  'double-sided-rollup-banner-85x200': [doubleSidedRollupBannerImg, rollupShowcaseImg],
  'desktop-mini-rollup-banner': [desktopMiniRollupBannerImg, rollupShowcaseImg],
  'rollup-banners': [rollupShowcaseImg, standardRollupBannerImg, luxuryTeardropRollupBannerImg, wideExhibitionRollupBannerImg],
  'roll-up-banners': [rollupShowcaseImg, standardRollupBannerImg, luxuryTeardropRollupBannerImg],
`

if (!content.includes('standardRollupBannerImg')) {
  content = imports + '\n' + content
  content = content.replace(/export const PRODUCT_IMAGE_MAP = {/, `export const PRODUCT_IMAGE_MAP = {\n${mapEntries}`)
  fs.writeFileSync(imgJsPath, content, 'utf8')
  console.log('Successfully updated productImages.js')
}
