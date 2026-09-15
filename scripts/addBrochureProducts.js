const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '..', 'src', 'data', 'initialData.js');
const ENCODE = (s) => encodeURIComponent(s);

const ENDPOINT_HD = (prompt) =>
  `https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=${ENCODE(prompt)}&image_size=square_hd`;

const HERO = (name) =>
  `Professional commercial product photography, ${name} by ONPRINT Dubai printing press, premium luxury quality, clean white seamless studio background, soft diffused studio box lighting, hero eye-level front view, e-commerce catalog hero photo, 4K macro detail, crisp sharp focus, high-end print industry product shot`;

const STUDIO_360 = (name, angleDesc) =>
  `Studio product photography of ${name} ${angleDesc}, clean white seamless background, Dubai print workshop premium quality, razor sharp focus, commercial e-commerce hero shot`;

const CAT_HERO = (prodName, catName) =>
  `Professional commercial product photography of ${prodName} for ${catName} category by ONPRINT Dubai printing, hero front eye-level view, clean white seamless studio background, soft diffused box lighting, premium luxury quality, e-commerce catalog hero photo, 4K macro detail, crisp sharp focus, high-end print industry product shot`;

const CAT_DETAIL = (prodName, catName) =>
  `Close-up detail shot of ${prodName} in ${catName} category, macro photography showing print texture coating and finish, razor sharp detail, clean white studio background, professional commercial lighting, Dubai premium printing quality, high-end catalog detail photo`;

const CAT_LIFESTYLE = (prodName, catName) =>
  `Lifestyle usage shot of ${prodName} for ${catName}, modern corporate office setting in Dubai, natural soft window lighting, professional commercial marketing composition, premium branded atmosphere, high-quality commercial photography, ONPRINT print quality showcase`;

const ANGLES_360 = [
  { desc: 'front view dead center eye level 0 degrees', angle: '0' },
  { desc: 'front-right three-quarter angle 45 degree view, rotated slightly to reveal side edge thickness, soft studio lighting, premium white background, high-end commercial catalog photo', angle: '45' },
  { desc: 'pure right side profile edge view 90 degrees, showing printed substrate thickness and edge detail, clean white seamless studio background, professional commercial lighting', angle: '90' },
  { desc: 'back-right three-quarter angle 135 degree view, revealing reverse side edge, clean white seamless background, premium e-commerce product lighting', angle: '135' },
  { desc: 'full back rear view 180 degrees, showing reverse side artwork back face, clean white studio background, commercial print industry photo', angle: '180' },
  { desc: 'back-left three-quarter angle 225 degree view, revealing reverse side left edge, clean white seamless background, professional commercial studio lighting', angle: '225' },
  { desc: 'pure left side profile edge view 270 degrees, showing printed substrate left edge thickness detail, clean white seamless studio background, product shot', angle: '270' },
  { desc: 'front-left three-quarter angle 315 degree view, rotated slightly to reveal left side edge thickness, soft studio lighting, premium white background, commercial catalog photo', angle: '315' }
];

const CATEGORY_TRIPLETS = [
  { _id: 'cat-brochures-printing', name: 'Brochures Printing', slug: 'brochures-printing' },
  { _id: 'cat-flyers-printing-in-dubai', name: 'Flyers Printing In Dubai', slug: 'flyers-printing-in-dubai' },
  { _id: 'cat-letterheads-printing-dubai', name: 'Letterheads Printing Dubai', slug: 'letterheads-printing-dubai' }
];

function buildCategoriesImages(prodName) {
  return CATEGORY_TRIPLETS.map((c) => ({
    ...c,
    images: [
      ENDPOINT_HD(CAT_HERO(prodName, c.name)),
      ENDPOINT_HD(CAT_DETAIL(prodName, c.name)),
      ENDPOINT_HD(CAT_LIFESTYLE(prodName, c.name))
    ]
  }));
}

const NEW_PRODUCTS = [
  {
    id: 46,
    _id: 'prod-bi-fold-brochures',
    slug: 'bi-fold-brochures-printing',
    name: 'Bi-Fold Brochures Printing',
    categoryGroup: 'Marketing Collateral',
    shortDescription: 'Classic 4-panel bi-fold brochures on 250gsm coated art paper with crisp folding and premium lamination.',
    description: 'Premium 4-panel bi-fold brochures printed on 250gsm to 300gsm silk or gloss coated art paper. Precision machine scored and folded for sharp edges, finished with optional soft-touch matte or gloss lamination. Perfect for corporate introductions, product overviews, and Dubai sales meeting leave-behinds.',
    seoTitle: 'Bi-Fold Brochures Printing Dubai | 4-Panel Corporate Brochures | ONPRINT',
    seoDescription: 'Professional bi-fold brochure printing in Dubai. 4-panel corporate brochures on luxury coated paper with precision folding and fast UAE turnaround.',
    seoKeywords: 'bi fold brochure printing dubai, 4 panel brochures uae, corporate bi-fold leaflets dubai, marketing brochure printing',
    imageAlt: 'Bi-fold 4-panel corporate printed brochures in Dubai',
    price: 95,
    minimumQuantity: 100
  },
  {
    id: 47,
    _id: 'prod-tri-fold-brochures',
    slug: 'tri-fold-brochures-printing',
    name: 'Tri-Fold Brochures Printing',
    categoryGroup: 'Marketing Collateral',
    shortDescription: 'Popular 6-panel tri-fold letter-fold brochures with organized sections and premium matte or gloss finish.',
    description: 'High-impact 6-panel tri-fold (letter-fold) brochures printed on 200gsm to 300gsm coated art paper. Machine scored in two places for crisp parallel folds, creating six organized panels. Ideal for service menus, hotel information sheets, retail promotions, and Dubai event marketing.',
    seoTitle: 'Tri-Fold Brochures Printing Dubai | 6-Panel Marketing Leaflets | ONPRINT',
    seoDescription: 'Tri-fold brochure printing in Dubai with 6 organized panels. Premium coated paper, matte or gloss finish, express same-day delivery available.',
    seoKeywords: 'tri fold brochure dubai, 6 panel leaflets uae, letter-fold brochures dubai, menu brochure printing',
    imageAlt: 'Tri-fold 6-panel marketing brochures printed in Dubai',
    price: 85,
    minimumQuantity: 100
  },
  {
    id: 48,
    _id: 'prod-gate-fold-brochures',
    slug: 'gate-fold-brochures-printing',
    name: 'Gate-Fold Brochures Printing',
    categoryGroup: 'Luxury Marketing',
    shortDescription: 'Dramatic opening gate-fold brochures with two side flaps revealing a full-width inner brand message.',
    description: 'Luxury gate-fold brochures featuring two outer flaps that fold inward like double doors to reveal a dramatic full-width inner spread. Printed on 300gsm to 400gsm premium coated art card with optional hot foil stamping, spot UV varnish, and soft-touch velvet lamination. Exclusive for Dubai real estate launches, luxury brand showcases, and VIP invitations.',
    seoTitle: 'Gate-Fold Brochures Printing Dubai | Luxury Opening Brochures | ONPRINT',
    seoDescription: 'Premium gate-fold brochure printing in Dubai. Dramatic opening style with foil stamping, spot UV and soft-touch lamination for luxury real estate and brands.',
    seoKeywords: 'gate fold brochure dubai, luxury opening brochures uae, real estate gate-fold dubai, premium marketing brochures',
    imageAlt: 'Luxury gate-fold brochures with dramatic opening style in Dubai',
    price: 145,
    minimumQuantity: 50,
    featured: true
  },
  {
    id: 49,
    _id: 'prod-z-fold-leaflets',
    slug: 'z-fold-leaflets-printing',
    name: 'Z-Fold Brochures & Leaflets',
    categoryGroup: 'Menu & Pricing Collateral',
    shortDescription: 'Accordion-style Z-fold leaflets with zig-zag panels for restaurant menus, price lists, and quick-reference guides.',
    description: 'Versatile accordion-style Z-fold (zig-zag) brochures and leaflets where panels fold back and forth alternately, creating multiple compact readable surfaces. Printed on 170gsm to 250gsm paper, ideal for restaurant and cafe menus, salon price lists, product specification sheets, instructional guides, and Dubai tourism maps.',
    seoTitle: 'Z-Fold Brochures & Leaflets Dubai | Accordion Menus & Price Lists | ONPRINT',
    seoDescription: 'Z-fold accordion brochure printing in Dubai. Perfect for menus, price lists, reference guides and maps with multiple zig-zag panels.',
    seoKeywords: 'z fold brochure dubai, accordion leaflets uae, menu printing dubai, price list brochure printing',
    imageAlt: 'Z-fold accordion style brochures leaflets menus in Dubai',
    price: 78,
    minimumQuantity: 100
  }
];

function buildProduct(p) {
  const prodName = p.name;
  const heroUrl = ENDPOINT_HD(HERO(prodName));
  const images360 = ANGLES_360.map((a) => ENDPOINT_HD(STUDIO_360(prodName, a.desc)));
  const categories = buildCategoriesImages(prodName);
  const catBlock = `    category: {
      _id: 'cat-brochures-printing',
      name: '${p.categoryGroup}',
      slug: 'brochures-printing'
    },
    shortDescription: '${p.shortDescription}',
    description: '${p.description}',
    image: '${heroUrl}',
    image_url: '${heroUrl}',
    imageAlt: '${p.imageAlt}',
    seoTitle: '${p.seoTitle}',
    seoDescription: '${p.seoDescription}',
    seoKeywords: '${p.seoKeywords}',
    price: ${p.price},
    minimumQuantity: ${p.minimumQuantity},
    featured: ${p.featured ? 'true' : 'false'},
    active: true,
    images360: [
${images360.map((u) => `        '${u}'`).join(',\n')}
      ],
    categories: [
${categories
  .map(
    (c) =>
      `        {\n          _id: '${c._id}',\n          name: '${c.name}',\n          slug: '${c.slug}',\n          images: [\n${c.images
            .map((u) => `            '${u}'`)
            .join(',\n')}\n          ]\n        }`
  )
  .join(',\n')}
      ]`;
  return `  {
    _id: '${p._id}',
    id: ${p.id},
    name: '${p.name}',
    slug: '${p.slug}',
${catBlock}
  }`;
}

const content = fs.readFileSync(DATA_PATH, 'utf8');
const SPLIT_MARKER = '\nconst services = [\n';
const idx = content.indexOf(SPLIT_MARKER);
if (idx === -1) {
  console.error('ERROR: Could not find "const services = [" insertion marker.');
  process.exit(1);
}

const before = content.slice(0, idx);
const after = content.slice(idx);
const insertionPoint = before.lastIndexOf(']');
if (insertionPoint === -1) {
  console.error('ERROR: Could not find closing products array bracket.');
  process.exit(1);
}

const finalProductsStr = NEW_PRODUCTS.map(buildProduct).join(',\n') + ',\n';

const newContent =
  before.slice(0, insertionPoint) + finalProductsStr + before.slice(insertionPoint) + after;

fs.writeFileSync(DATA_PATH, newContent, 'utf8');

console.log(`✓ Injected ${NEW_PRODUCTS.length} new brochure products`);
console.log(`  - ${NEW_PRODUCTS.map((p) => `#${p.id} ${p.name}`).join('  \n  - ')}`);
console.log(`  Hero images: ${NEW_PRODUCTS.length} (1 each)`);
console.log(`  360 frames: ${NEW_PRODUCTS.length * 8} (8 each)`);
console.log(`  Category images: ${NEW_PRODUCTS.length * 3 * 3} (3 cats × 3 each)`);
