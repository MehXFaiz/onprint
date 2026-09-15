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

let rawCode = fs.readFileSync(inputPath, 'utf8');

const categoryBlockRegex = /(\s+categories:\s*\[)([\s\S]*?)(\],)/g;

let match;
let newCode = rawCode;
let productCounter = 0;
let imageCounter = 0;

const productNameRegex = /name:\s*'([^']+)'/g;
const productsSectionStart = rawCode.indexOf('const products = [');
const productsSection = rawCode.substring(productsSectionStart);

let nameMatch;
let productNames = [];
let searchFrom = 0;
while ((nameMatch = productNameRegex.exec(productsSection)) !== null) {
  productNames.push(nameMatch[1]);
}

console.log(`Found ${productNames.length} product names`);

let categoriesBlockCount = 0;
let currentProductIndex = -1;

const lines = rawCode.split('\n');
const outputLines = [];
let inCategoriesBlock = false;
let categoriesBraceDepth = 0;
let currentCategoryEntries = [];
let catEntryBuffer = [];
let pendingProductName = null;

function findProductNameAtLine(lines, lineIdx) {
  for (let i = lineIdx; i >= 0; i--) {
    const m = lines[i].match(/name:\s*'([^']+)'/);
    if (m && !lines[i].includes('seoHeading') && !lines[i].includes('seoTitle') && !lines[i].includes('seoDescription') && !lines[i].includes('seoKeywords') && !lines[i].includes('imageAlt') && !lines[i].includes('canonicalUrl')) {
      return m[1];
    }
  }
  return null;
}

let i = 0;
while (i < lines.length) {
  const line = lines[i];

  if (line.match(/categories:\s*\[/) && !inCategoriesBlock) {
    inCategoriesBlock = true;
    categoriesBraceDepth = 0;
    currentCategoryEntries = [];
    catEntryBuffer = [];
    pendingProductName = findProductNameAtLine(lines, i);
    productCounter++;

    const arrMatch = line.match(/(.*categories:\s*\[)(.*)/);
    if (arrMatch) {
      outputLines.push(arrMatch[1]);
      if (arrMatch[2].trim()) {
        catEntryBuffer.push(arrMatch[2]);
      }
    } else {
      outputLines.push(line);
    }
    i++;
    continue;
  }

  if (inCategoriesBlock) {
    const openBraces = (line.match(/{/g) || []).length;
    const closeBraces = (line.match(/}/g) || []).length;
    const openBrackets = (line.match(/\[/g) || []).length;
    const closeBrackets = (line.match(/\]/g) || []).length;

    categoriesBraceDepth += openBraces - closeBraces;

    const entryEnd = line.includes('},') || (line.includes('}') && categoriesBraceDepth === 0 && closeBraces >= openBraces);
    catEntryBuffer.push(line);

    if (entryEnd && categoriesBraceDepth <= 0) {
      const entryText = catEntryBuffer.join('\n');
      const nameMatch = entryText.match(/name:\s*'([^']+)'/);
      const catName = nameMatch ? nameMatch[1] : 'Print Category';

      const catImages = generateCategoryImages(pendingProductName || 'Print Product', catName);
      imageCounter += catImages.length;

      const indentedImages = catImages.map((url, idx) => {
        const comma = idx < catImages.length - 1 ? ',' : '';
        return `              '${url}'${comma}`;
      }).join('\n');

      const modifiedEntry = entryText.replace(/(\s*)(\],?)\s*$/, (m, spaces, ending) => {
        return `,\n${spaces}images: [\n${indentedImages}\n            ]${ending}`;
      });

      outputLines.push(modifiedEntry);
      catEntryBuffer = [];
    }

    const arrCloseMatch = line.match(/^\s*\],/);
    if (arrCloseMatch && categoriesBraceDepth <= 0 && catEntryBuffer.length === 0) {
      inCategoriesBlock = false;
    }

    if (line.trim() === '],') {
      inCategoriesBlock = false;
    }

    i++;
    continue;
  }

  outputLines.push(line);
  i++;
}

const resultCode = outputLines.join('\n');

fs.writeFileSync(outputPath, resultCode, 'utf8');
console.log(`Processed ${productCounter} products with categories`);
console.log(`Generated ${imageCounter} category images total`);
console.log(`Expected: 45 products × 3 categories × 3 images = 405`);
