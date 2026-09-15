const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, 'src', 'data', 'initialData.js');
const originalContent = fs.readFileSync(filePath, 'utf8');

const data = require(filePath);
const categories = JSON.parse(JSON.stringify(data.categories));
const products = JSON.parse(JSON.stringify(data.products));

const promptTemplate = 'Professional ONPRINT Dubai print shop category hero banner, [CATEGORY NAME] service showcase, wide 16:9 panoramic commercial photography composition, premium luxury stationery and samples arranged on a white marble studio table, warm soft window side lighting, modern minimalist interior, high-end printing industry aesthetic, crisp focus, commercial marketing banner for website category landing, 4K ultra detail';

categories.forEach(cat => {
  const prompt = promptTemplate.replace('[CATEGORY NAME]', cat.name);
  const encodedPrompt = encodeURIComponent(prompt);
  const newUrl = `https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=${encodedPrompt}&image_size=landscape_16_9`;
  cat.image = newUrl;
  cat.image_url = newUrl;
});

const catSlugToObj = {};
categories.forEach(c => {
  catSlugToObj[c.slug] = { _id: c._id, name: c.name, slug: c.slug };
});

const allCategorySlugs = categories.map(c => c.slug);

products.forEach((prod, idx) => {
  const primarySlug = prod.category.slug;
  const primaryCat = catSlugToObj[primarySlug] || { _id: prod.category._id, name: prod.category.name, slug: primarySlug };
  
  const availableSlugs = allCategorySlugs.filter(s => s !== primarySlug);
  
  const secondIdx = idx % availableSlugs.length;
  let thirdIdx = (idx + 1) % availableSlugs.length;
  if (thirdIdx === secondIdx) {
    thirdIdx = (thirdIdx + 1) % availableSlugs.length;
  }
  
  const secondSlug = availableSlugs[secondIdx];
  const thirdSlug = availableSlugs[thirdIdx];
  
  const secondCat = catSlugToObj[secondSlug];
  const thirdCat = catSlugToObj[thirdSlug];
  
  prod.categories = [
    { _id: primaryCat._id, name: primaryCat.name, slug: primaryCat.slug },
    { _id: secondCat._id, name: secondCat.name, slug: secondCat.slug },
    { _id: thirdCat._id, name: thirdCat.name, slug: thirdCat.slug }
  ];
});

function serializeCategories(arr) {
  const items = arr.map(item => {
    const pairs = Object.entries(item).map(([key, value]) => {
      let val;
      if (typeof value === 'string') {
        val = `'${value.replace(/'/g, "\\'")}'`;
      } else if (typeof value === 'number' || typeof value === 'boolean') {
        val = value.toString();
      } else {
        val = value.toString();
      }
      return `    ${key}: ${val}`;
    }).join(',\n');
    return `  {\n${pairs}\n  }`;
  }).join(',\n');
  return `const categories = [\n${items}\n]`;
}

function serializeProducts(arr) {
  const items = arr.map(item => {
    const pairs = Object.entries(item).map(([key, value]) => {
      let val;
      if (typeof value === 'string') {
        val = `'${value.replace(/'/g, "\\'")}'`;
      } else if (typeof value === 'number' || typeof value === 'boolean') {
        val = value.toString();
      } else if (Array.isArray(value)) {
        if (key === 'categories') {
          const nested = value.map(v => {
            const subPairs = Object.entries(v).map(([sk, sv]) => {
              return `          ${sk}: '${sv.replace(/'/g, "\\'")}'`;
            }).join(',\n');
            return `        {\n${subPairs}\n        }`;
          }).join(',\n');
          val = `[\n${nested}\n      ]`;
        } else if (value.length === 0) {
          val = '[]';
        } else if (typeof value[0] === 'string') {
          const nested = value.map(v => {
            return `        '${v.replace(/'/g, "\\'")}'`;
          }).join(',\n');
          val = `[\n${nested}\n      ]`;
        } else {
          const nested = value.map(v => {
            const subPairs = Object.entries(v).map(([sk, sv]) => {
              let subVal;
              if (typeof sv === 'string') subVal = `'${sv.replace(/'/g, "\\'")}'`;
              else subVal = sv.toString();
              return `          ${sk}: ${subVal}`;
            }).join(',\n');
            return `        {\n${subPairs}\n        }`;
          }).join(',\n');
          val = `[\n${nested}\n      ]`;
        }
      } else if (typeof value === 'object' && value !== null) {
        const subPairs = Object.entries(value).map(([sk, sv]) => {
          let subVal;
          if (typeof sv === 'string') subVal = `'${sv.replace(/'/g, "\\'")}'`;
          else subVal = sv.toString();
          return `      ${sk}: ${subVal}`;
        }).join(',\n');
        val = `{\n${subPairs}\n    }`;
      } else {
        val = value.toString();
      }
      return `    ${key}: ${val}`;
    }).join(',\n');
    return `  {\n${pairs}\n  }`;
  }).join(',\n');
  return `const products = [\n${items}\n]`;
}

const newCategoriesStr = serializeCategories(categories);
const newProductsStr = serializeProducts(products);

const catRegex = /const categories = \[[\s\S]*?\n\]/;
const prodRegex = /const products = \[[\s\S]*?\n\]/;

let newContent = originalContent;
newContent = newContent.replace(catRegex, newCategoriesStr);
newContent = newContent.replace(prodRegex, newProductsStr);

fs.writeFileSync(filePath, newContent, 'utf8');

console.log('=== VERIFICATION ===');
console.log('Categories count:', categories.length);
const uniqueCatImages = new Set(categories.map(c => c.image));
console.log('Unique category images:', uniqueCatImages.size);

console.log('\nProducts count:', products.length);
let productsWithCategories = 0;
let allLen3 = true;
let allPrimaryFirst = true;
let allUniquePerProduct = true;
products.forEach(p => {
  if (p.categories && p.categories.length === 3) productsWithCategories++;
  if (!p.categories || p.categories.length !== 3) allLen3 = false;
  if (p.categories && p.categories[0].slug !== p.category.slug) allPrimaryFirst = false;
  if (p.categories) {
    const slugs = p.categories.map(c => c.slug);
    if (new Set(slugs).size !== 3) {
      allUniquePerProduct = false;
      console.log('DUP!', p.id, p.name, slugs);
    }
  }
});
console.log('Products with categories array (len 3):', productsWithCategories);
console.log('All products have len=3:', allLen3);
console.log('All primary first:', allPrimaryFirst);
console.log('All unique per product (no dups):', allUniquePerProduct);

const secondaryCounts = {};
products.forEach(p => {
  if (p.categories) {
    for (let i = 1; i < 3; i++) {
      const s = p.categories[i].slug;
      secondaryCounts[s] = (secondaryCounts[s] || 0) + 1;
    }
  }
});
console.log('\nSecondary/tertiary category representation across products:');
Object.entries(secondaryCounts).forEach(([slug, count]) => {
  const cat = categories.find(c => c.slug === slug);
  console.log(`  ${cat ? cat.name : slug}: ${count} times`);
});
