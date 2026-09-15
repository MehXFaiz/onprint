const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '..', 'src', 'data', 'initialData.js');
const outputPath = inputPath;

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

function findMatchingBracket(str, start) {
  const openCh = str[start];
  const closeCh = openCh === '{' ? '}' : ']';
  let depth = 1;
  let i = start + 1;
  while (i < str.length && depth > 0) {
    if (str[i] === openCh) depth++;
    if (str[i] === closeCh) depth--;
    if (depth > 0) i++;
  }
  return i;
}

const productsStart = rawCode.indexOf('const products = [');
if (productsStart < 0) { console.error('Products array not found'); process.exit(1); }

const productsArrOpen = rawCode.indexOf('[', productsStart);
const productsArrClose = findMatchingBracket(rawCode, productsArrOpen);
const productsContent = rawCode.substring(productsArrOpen + 1, productsArrClose);

const newProductsItems = [];
let cursor = 0;
let prodCount = 0;
let imgCount = 0;

while (cursor < productsContent.length) {
  const objOpen = productsContent.indexOf('{', cursor);
  if (objOpen < 0) {
    newProductsItems.push(productsContent.substring(cursor));
    break;
  }
  const objClose = findMatchingBracket(productsContent, objOpen);
  const before = productsContent.substring(cursor, objOpen);
  const productObjStr = productsContent.substring(objOpen, objClose + 1);

  const nameMatch = productObjStr.match(/\n(\s+)name:\s*'([^']+)'/);
  const indent = nameMatch ? nameMatch[1] : '        ';

  const prodSlugMatch = productObjStr.match(/slug:\s*'([^']+)'/);
  const prodNameMatch = productObjStr.match(/(?<!seoHeading)(?<!seoTitle)(?<!seoDescription)(?<!seoKeywords)(?<!imageAlt)(?<!canonicalUrl)\n\s+name:\s*'([^']+)'/);
  const prodName = (prodNameMatch && prodNameMatch[1]) || 'Print Product';

  const catArrOpen = productObjStr.indexOf('categories: [');
  let newProductObjStr = productObjStr;

  if (catArrOpen >= 0) {
    const catBracketOpen = productObjStr.indexOf('[', catArrOpen);
    const catBracketClose = findMatchingBracket(productObjStr, catBracketOpen);
    const catArrContent = productObjStr.substring(catBracketOpen + 1, catBracketClose);

    const catEntries = [];
    let catCursor = 0;
    while (catCursor < catArrContent.length) {
      const catObjOpen = catArrContent.indexOf('{', catCursor);
      if (catObjOpen < 0) { break; }
      const catObjClose = findMatchingBracket(catArrContent, catObjOpen);
      const catEntryBefore = catArrContent.substring(catCursor, catObjOpen);
      const catObjStr = catArrContent.substring(catObjOpen, catObjClose + 1);

      const catNameMatch = catObjStr.match(/name:\s*'([^']+)'/);
      const catName = catNameMatch ? catNameMatch[1] : 'Print Category';

      const imgs = generateCategoryImages(prodName, catName);
      imgCount += imgs.length;

      const baseIndent = '          ';
      const imgIndent = '            ';
      const imgLines = imgs.map((u, i) => `${imgIndent}'${u}'${i < imgs.length - 1 ? ',' : ''}`).join('\n');

      const newCatObjStr = catObjStr.replace(/(\s+)(slug:\s*'[^']+')/,
        `$1$2,\n${baseIndent}images: [\n${imgLines}\n${baseIndent}]`
      );

      catEntries.push(catEntryBefore + newCatObjStr);
      catCursor = catObjClose + 1;
    }
    catEntries.push(catArrContent.substring(catCursor));

    const newCatArrContent = catEntries.join('');
    const beforeCat = productObjStr.substring(0, catBracketOpen);
    const afterCat = productObjStr.substring(catBracketClose);
    newProductObjStr = beforeCat + '[' + newCatArrContent + afterCat;
    prodCount++;
  }

  newProductsItems.push(before + newProductObjStr);
  cursor = objClose + 1;
}

const newProductsContent = newProductsItems.join('');
const newRawCode =
  rawCode.substring(0, productsArrOpen) +
  '[' + newProductsContent + ']' +
  rawCode.substring(productsArrClose + 1);

fs.writeFileSync(outputPath, newRawCode, 'utf8');
console.log(`Updated ${prodCount} products in initialData.js`);
console.log(`Injected ${imgCount} category images total`);
console.log(`Expected: 45 products × 3 categories × 3 images = 405`);
