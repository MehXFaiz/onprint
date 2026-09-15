const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '..', 'src', 'data', 'initialData.js');
const outputPath = path.join(__dirname, '..', 'client', 'src', 'assets', 'categoryImageMap.js');

function encodePrompt(str) {
  return encodeURIComponent(str);
}

function generateImageUrl(prompt) {
  return `https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=${encodePrompt(prompt)}&image_size=square_hd`;
}

function generateCategoryImages(productName, categoryName) {
  const cleanProduct = productName.replace(/[^a-zA-Z0-9\s-]/g, '').trim();
  const cleanCategory = categoryName.replace(/[^a-zA-Z0-9\s-]/g, '').trim();

  return [
    generateImageUrl(`Professional commercial product photography of ${cleanProduct} for ${cleanCategory} category by ONPRINT Dubai printing, hero front eye-level view, clean white seamless studio background, soft diffused box lighting, premium luxury quality, e-commerce catalog hero photo, 4K macro detail, crisp sharp focus, high-end print industry product shot`),
    generateImageUrl(`Close-up detail shot of ${cleanProduct} in ${cleanCategory} category, macro photography showing print texture coating and finish, razor sharp detail, clean white studio background, professional commercial lighting, Dubai premium printing quality, high-end catalog detail photo`),
    generateImageUrl(`Lifestyle usage shot of ${cleanProduct} for ${cleanCategory}, modern corporate office setting in Dubai, natural soft window lighting, professional commercial marketing composition, premium branded atmosphere, high-quality commercial photography, ONPRINT print quality showcase`)
  ];
}

const rawCode = fs.readFileSync(inputPath, 'utf8');

const productsStart = rawCode.indexOf('const products = [') + 'const products = ['.length;
let depth = 1;
let i = productsStart;
while (i < rawCode.length && depth > 0) {
  if (rawCode[i] === '[') depth++;
  if (rawCode[i] === ']') depth--;
  i++;
}
const productsCode = rawCode.substring(productsStart, i - 1);

const productBlocks = [];
let objStart = -1;
let braceDepth = 0;
for (let j = 0; j < productsCode.length; j++) {
  if (productsCode[j] === '{') {
    if (braceDepth === 0) objStart = j;
    braceDepth++;
  }
  if (productsCode[j] === '}') {
    braceDepth--;
    if (braceDepth === 0 && objStart >= 0) {
      productBlocks.push(productsCode.substring(objStart, j + 1));
      objStart = -1;
    }
  }
}

console.log(`Extracted ${productBlocks.length} product blocks`);

function extractField(block, field) {
  const re = new RegExp(`${field}:\\s*'([^']*)'`);
  const m = block.match(re);
  return m ? m[1] : null;
}

function extractCategories(block) {
  const cats = [];
  const catStart = block.indexOf('categories: [');
  if (catStart < 0) return cats;

  let d = 1;
  let k = catStart + 'categories: ['.length;
  while (k < block.length && d > 0) {
    if (block[k] === '[') d++;
    if (block[k] === ']') d--;
    k++;
  }
  const catBlock = block.substring(catStart + 'categories: ['.length, k - 1);

  let cObjStart = -1;
  let cBraceDepth = 0;
  for (let m = 0; m < catBlock.length; m++) {
    if (catBlock[m] === '{') {
      if (cBraceDepth === 0) cObjStart = m;
      cBraceDepth++;
    }
    if (catBlock[m] === '}') {
      cBraceDepth--;
      if (cBraceDepth === 0 && cObjStart >= 0) {
        const cObj = catBlock.substring(cObjStart, m + 1);
        const id = extractField(cObj, '_id');
        const name = extractField(cObj, 'name');
        const slug = extractField(cObj, 'slug');
        cats.push({ _id: id, name, slug });
        cObjStart = -1;
      }
    }
  }
  return cats;
}

const categoryImageMap = {};
let totalImages = 0;

for (const block of productBlocks) {
  const slug = extractField(block, 'slug');
  const name = extractField(block, 'name');
  const categories = extractCategories(block);

  if (!slug) continue;

  categoryImageMap[slug] = {};

  for (const cat of categories) {
    if (!cat || !cat.slug) continue;
    const imgs = generateCategoryImages(name || 'Print Product', cat.name || 'Print Category');
    categoryImageMap[slug][cat.slug] = imgs;
    totalImages += imgs.length;
  }
}

console.log(`Generated ${totalImages} images total`);
console.log(`Expected: 45 products × 3 categories × 3 images = 405`);

const allSlugs = Object.keys(categoryImageMap);
console.log(`Products in map: ${allSlugs.length}`);

const mapEntries = [];
for (const slug of allSlugs) {
  const catEntries = [];
  for (const catSlug of Object.keys(categoryImageMap[slug])) {
    const imgs = categoryImageMap[slug][catSlug];
    const imgLines = imgs.map(u => `      '${u}'`).join(',\n');
    catEntries.push(`    '${catSlug}': [\n${imgLines}\n    ]`);
  }
  mapEntries.push(`  '${slug}': {\n${catEntries.join(',\n')}\n  }`);
}

const output = `export const categoryImageMap = {\n${mapEntries.join(',\n')}\n};\n\nexport function getCategoryImages(productSlug, categorySlug) {\n  if (!productSlug || !categorySlug) return [];\n  const productCats = categoryImageMap[productSlug];\n  if (!productCats) return [];\n  return productCats[categorySlug] || [];\n}\n\nexport function getAllCategoryImages(productSlug) {\n  if (!productSlug) return [];\n  const productCats = categoryImageMap[productSlug];\n  if (!productCats) return [];\n  const result = [];\n  for (const catSlug of Object.keys(productCats)) {\n    for (const img of productCats[catSlug]) {\n      result.push({ categorySlug: catSlug, url: img });\n    }\n  }\n  return result;\n}\n`;

fs.writeFileSync(outputPath, output, 'utf8');
console.log(`\nWritten to: ${outputPath}`);
