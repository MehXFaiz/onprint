const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '..');

const TARGET_CATEGORY_NAMES = [
  'Luxury Packaging & Boxes',
  'Luxury Packaging & Custom Boxes',
  'Luxury Packaging',
];
const TARGET_CATEGORY_SLUGS = [
  'luxury-packaging-boxes',
  'luxury-packaging-custom-boxes',
];
const TARGET_CATEGORY_IDS = ['cat-luxury-packaging-boxes'];

// ============================================================
// 1. Process catalogProducts.json
// ============================================================
function processCatalogProducts() {
  const catalogPath = path.join(PROJECT_ROOT, 'client', 'src', 'data', 'catalogProducts.json');
  if (!fs.existsSync(catalogPath)) {
    console.log('[SKIP] catalogProducts.json not found at', catalogPath);
    return;
  }

  console.log('\n=== Processing catalogProducts.json ===');
  const raw = fs.readFileSync(catalogPath, 'utf8');
  let data;
  try {
    data = JSON.parse(raw);
  } catch (err) {
    console.error('[ERROR] Failed to parse catalogProducts.json:', err.message);
    return;
  }

  let removedCategories = 0;
  let removedProducts = 0;
  let renumberedCategories = 0;
  let renumberedProducts = 0;

  // Determine if data is the categories array directly or has nested products
  let categories = Array.isArray(data) ? data : (data.categories || []);
  let products = Array.isArray(data.products) ? data.products : [];

  // Helper to check if a category object matches the target
  const isTargetCategory = (cat) => {
    if (!cat) return false;
    const name = cat.name || cat.category_name || '';
    const slug = cat.slug || cat.category_slug || '';
    const id = cat._id || cat.id || '';
    return (
      TARGET_CATEGORY_NAMES.includes(name) ||
      TARGET_CATEGORY_SLUGS.includes(slug) ||
      TARGET_CATEGORY_IDS.includes(id)
    );
  };

  // Filter out the target categories
  const newCategories = categories.filter((cat) => {
    if (isTargetCategory(cat)) {
      removedCategories++;
      return false;
    }
    return true;
  });

  // Re-number category id and display_order
  const finalCategories = newCategories.map((cat, idx) => {
    const newCat = { ...cat };
    const order = idx + 1;
    if (typeof newCat.id === 'number' && newCat.id !== order) {
      newCat.id = order;
      renumberedCategories++;
    }
    if (
      (typeof newCat.display_order === 'number' && newCat.display_order !== order) ||
      (typeof newCat.displayOrder === 'number' && newCat.displayOrder !== order)
    ) {
      newCat.display_order = order;
      newCat.displayOrder = order;
      renumberedCategories++;
    }
    return newCat;
  });

  // Get remaining valid category names/slugs/ids for product validation
  const remainingCatNames = new Set(finalCategories.map((c) => c.name).filter(Boolean));
  const remainingCatSlugs = new Set(finalCategories.map((c) => c.slug).filter(Boolean));
  const remainingCatIds = new Set(finalCategories.map((c) => c._id || c.id).filter(Boolean));

  // Helper to check if a product references a removed category
  const productHasRemovedCategory = (prod) => {
    if (!prod) return false;
    // Check category_name
    const catName = prod.category_name || prod.categoryName || (prod.category && prod.category.name) || '';
    const catSlug = prod.category_slug || prod.categorySlug || (prod.category && prod.category.slug) || '';
    const catId = prod.category_id || prod.categoryId || (prod.category && (prod.category._id || prod.category.id)) || '';

    if (TARGET_CATEGORY_NAMES.includes(catName)) return true;
    if (TARGET_CATEGORY_SLUGS.includes(catSlug)) return true;
    if (TARGET_CATEGORY_IDS.includes(catId)) return true;

    // Also check if the product has a "category" array or categories field
    if (Array.isArray(prod.categories)) {
      for (const c of prod.categories) {
        const cn = typeof c === 'string' ? c : (c.name || c.category_name || '');
        const cs = typeof c === 'string' ? '' : (c.slug || c.category_slug || '');
        const ci = typeof c === 'string' ? '' : (c._id || c.id || '');
        if (TARGET_CATEGORY_NAMES.includes(cn) || TARGET_CATEGORY_SLUGS.includes(cs) || TARGET_CATEGORY_IDS.includes(ci)) {
          return true;
        }
      }
    }
    return false;
  };

  // Filter products - remove those belonging to removed category
  const finalProducts = products.filter((prod) => {
    if (productHasRemovedCategory(prod)) {
      removedProducts++;
      return false;
    }
    return true;
  });

  // If products were nested inside each category, clean those up too
  for (const cat of finalCategories) {
    if (Array.isArray(cat.products)) {
      const before = cat.products.length;
      cat.products = cat.products.filter((p) => !productHasRemovedCategory(p));
      removedProducts += (before - cat.products.length);
      // Re-number nested product ids
      cat.products = cat.products.map((p, idx) => {
        const np = { ...p };
        if (typeof np.id === 'number') {
          // Keep original id unless we really need to renumber; skip for now
        }
        return np;
      });
    }
  }

  // Write result
  let output;
  if (Array.isArray(data)) {
    output = JSON.stringify(finalCategories, null, 2);
  } else {
    const outObj = { ...data };
    if ('categories' in outObj) outObj.categories = finalCategories;
    if ('products' in outObj) outObj.products = finalProducts;
    output = JSON.stringify(outObj, null, 2);
  }

  fs.writeFileSync(catalogPath, output, 'utf8');
  console.log(`  Removed categories: ${removedCategories}`);
  console.log(`  Renumbered category fields: ${renumberedCategories}`);
  console.log(`  Removed products: ${removedProducts}`);
}

// ============================================================
// 2. Process initialData.js (JS module with exports)
// ============================================================
function processInitialData() {
  const initialDataPath = path.join(PROJECT_ROOT, 'src', 'data', 'initialData.js');
  if (!fs.existsSync(initialDataPath)) {
    console.log('\n[SKIP] initialData.js not found at', initialDataPath);
    return;
  }

  console.log('\n=== Processing initialData.js ===');

  // Try to require the file to get the actual data
  let moduleData;
  try {
    // Clear require cache
    delete require.cache[require.resolve(initialDataPath)];
    moduleData = require(initialDataPath);
  } catch (err) {
    console.error('[ERROR] Failed to require initialData.js:', err.message);
    console.log('[INFO] Falling back to string-based removal approach.');
    processInitialDataStringFallback(initialDataPath);
    return;
  }

  // The module exports many keys - find the ones with categories/products
  const keysHandled = [];
  let totalCategoriesRemoved = 0;
  let totalProductsRemoved = 0;

  const isTargetCategory = (cat) => {
    if (!cat) return false;
    const name = cat.name || cat.category_name || '';
    const slug = cat.slug || cat.category_slug || '';
    const id = cat._id || cat.id || '';
    return (
      TARGET_CATEGORY_NAMES.includes(name) ||
      TARGET_CATEGORY_SLUGS.includes(slug) ||
      TARGET_CATEGORY_IDS.includes(id)
    );
  };

  const productHasRemovedCategory = (prod) => {
    if (!prod) return false;
    const catName = prod.category_name || prod.categoryName || (prod.category && prod.category.name) || '';
    const catSlug = prod.category_slug || prod.categorySlug || (prod.category && prod.category.slug) || '';
    const catId = prod.category_id || prod.categoryId || (prod.category && (prod.category._id || prod.category.id)) || '';

    if (TARGET_CATEGORY_NAMES.includes(catName)) return true;
    if (TARGET_CATEGORY_SLUGS.includes(catSlug)) return true;
    if (TARGET_CATEGORY_IDS.includes(catId)) return true;

    if (Array.isArray(prod.categories)) {
      for (const c of prod.categories) {
        const cn = typeof c === 'string' ? c : (c.name || c.category_name || '');
        if (TARGET_CATEGORY_NAMES.includes(cn)) return true;
      }
    }
    return false;
  };

  // Recursively walk the exports and clean arrays containing category/product-like objects
  function processArray(arr, keyPath) {
    if (!Array.isArray(arr) || arr.length === 0) return { array: arr, removedCats: 0, removedProds: 0, changed: false };

    // Sample a few items to detect if this is a categories array or products array
    const sample = arr.slice(0, 3);
    const hasCategoryName = sample.some((item) => item && typeof item === 'object' && 'name' in item && ('slug' in item || '_id' in item));
    const hasProductCategory = sample.some((item) => item && typeof item === 'object' && ('category_name' in item || 'category_id' in item || 'category' in item));

    let removedCats = 0;
    let removedProds = 0;
    let newArr = arr;
    let changed = false;

    if (hasCategoryName) {
      // Likely a categories array
      const before = arr.length;
      newArr = arr.filter((item) => {
        if (isTargetCategory(item)) {
          removedCats++;
          return false;
        }
        return true;
      });
      if (removedCats > 0) {
        changed = true;
        // Renumber
        newArr = newArr.map((cat, idx) => {
          const nc = { ...cat };
          const order = idx + 1;
          if (typeof nc.id === 'number') nc.id = order;
          if ('display_order' in nc) nc.display_order = order;
          if ('displayOrder' in nc) nc.displayOrder = order;
          return nc;
        });
      }

      // Recurse into nested products inside each category
      newArr = newArr.map((cat) => {
        if (Array.isArray(cat.products)) {
          const pBefore = cat.products.length;
          const newProducts = cat.products.filter((p) => !productHasRemovedCategory(p));
          const pRemoved = pBefore - newProducts.length;
          if (pRemoved > 0) {
            removedProds += pRemoved;
            changed = true;
            return { ...cat, products: newProducts };
          }
        }
        return cat;
      });
    } else if (hasProductCategory) {
      // Likely a products array
      const before = arr.length;
      newArr = arr.filter((item) => {
        if (productHasRemovedCategory(item)) {
          removedProds++;
          return false;
        }
        return true;
      });
      if (removedProds > 0) changed = true;
    } else {
      // Unknown array - recursively check each object item
      newArr = arr.map((item) => {
        if (item && typeof item === 'object' && !Array.isArray(item)) {
          const { obj, rC, rP, ch } = processObject(item, keyPath);
          if (rC) removedCats += rC;
          if (rP) removedProds += rP;
          if (ch) changed = true;
          return obj;
        }
        return item;
      });
    }

    return { array: newArr, removedCats, removedProds, changed };
  }

  function processObject(obj, keyPath) {
    if (!obj || typeof obj !== 'object') return { obj, rC: 0, rP: 0, ch: false };

    let newObj = { ...obj };
    let rC = 0;
    let rP = 0;
    let ch = false;

    for (const key of Object.keys(newObj)) {
      const val = newObj[key];
      if (Array.isArray(val)) {
        const { array, removedCats, removedProds, changed } = processArray(val, `${keyPath}.${key}`);
        if (changed) {
          newObj[key] = array;
          ch = true;
          rC += removedCats;
          rP += removedProds;
        }
      } else if (val && typeof val === 'object') {
        const { obj: nestedObj, rC: nestedRC, rP: nestedRP, ch: nestedCh } = processObject(val, `${keyPath}.${key}`);
        if (nestedCh) {
          newObj[key] = nestedObj;
          ch = true;
          rC += nestedRC;
          rP += nestedRP;
        }
      }
    }

    return { obj: newObj, rC, rP, ch };
  }

  // Process each export key
  const newModuleData = {};
  for (const key of Object.keys(moduleData)) {
    const val = moduleData[key];
    if (Array.isArray(val)) {
      const { array, removedCats, removedProds, changed } = processArray(val, key);
      if (changed) {
        keysHandled.push(`${key} (cats:${removedCats}, prods:${removedProds})`);
        totalCategoriesRemoved += removedCats;
        totalProductsRemoved += removedProds;
      }
      newModuleData[key] = array;
    } else if (val && typeof val === 'object') {
      const { obj, rC, rP, ch } = processObject(val, key);
      if (ch) {
        keysHandled.push(`${key} (cats:${rC}, prods:${rP})`);
        totalCategoriesRemoved += rC;
        totalProductsRemoved += rP;
      }
      newModuleData[key] = obj;
    } else {
      newModuleData[key] = val;
    }
  }

  // Reconstruct the module file string by reading original, stripping comments, regenerating exports
  // Since initialData.js likely uses `module.exports = { ... }` or exports, we'll use a safer approach:
  // read the original file, and do targeted regex removal of category objects plus a string replacement for module.exports.
  // But since we have the processed object, let's generate a fresh file using util.inspect-like serialization.
  console.log(`  Keys with changes: ${keysHandled.length ? keysHandled.join(', ') : '(none detected via require)'}`);
  console.log(`  Total categories removed (require-based pass): ${totalCategoriesRemoved}`);
  console.log(`  Total products removed (require-based pass): ${totalProductsRemoved}`);

  // Now use the string-based approach as the primary approach because it preserves exact file formatting
  processInitialDataStringFallback(initialDataPath);
}

function processInitialDataStringFallback(filePath) {
  console.log('\n  [String-based removal pass on initialData.js]');
  let content = fs.readFileSync(filePath, 'utf8');
  let removed = 0;

  // Remove explicit category references: entire objects with "name": "Luxury Packaging..." 
  // Strategy: for category definitions, remove the full object entry from the categories array.
  // We'll do repeated regex matches to find category objects and remove them.

  // Pattern 1: Category object with name "Luxury Packaging & Boxes" (client form)
  // Pattern 2: Category object with name "Luxury Packaging & Custom Boxes" (backend form)
  const categoryNamePatterns = [
    '"name":\\s*"Luxury Packaging & Boxes"',
    '"name":\\s*"Luxury Packaging & Custom Boxes"',
    '"name":\\s*\'Luxury Packaging & Boxes\'',
    '"name":\\s*\'Luxury Packaging & Custom Boxes\'',
    'name:\\s*"Luxury Packaging & Boxes"',
    'name:\\s*"Luxury Packaging & Custom Boxes"',
    'name:\\s*\'Luxury Packaging & Boxes\'',
    'name:\\s*\'Luxury Packaging & Custom Boxes\'',
  ];

  // For each match, find the enclosing object { ... } and remove it (with surrounding comma)
  for (const pattern of categoryNamePatterns) {
    const re = new RegExp(pattern, 'g');
    let match;
    const matches = [];
    while ((match = re.exec(content)) !== null) {
      matches.push(match.index);
    }
    // Process matches in reverse order to preserve indices
    for (let i = matches.length - 1; i >= 0; i--) {
      const idx = matches[i];
      // Find the opening brace of the object containing this property
      let openBrace = -1;
      let depth = 0;
      for (let j = idx; j >= 0; j--) {
        const ch = content[j];
        if (ch === '}') depth++;
        else if (ch === '{') {
          if (depth === 0) { openBrace = j; break; }
          depth--;
        }
      }
      if (openBrace === -1) continue;

      // Find the closing brace
      let closeBrace = -1;
      depth = 0;
      for (let j = openBrace; j < content.length; j++) {
        const ch = content[j];
        if (ch === '{') depth++;
        else if (ch === '}') {
          depth--;
          if (depth === 0) { closeBrace = j; break; }
        }
      }
      if (closeBrace === -1) continue;

      // Also remove surrounding comma and whitespace
      let start = openBrace;
      let end = closeBrace + 1;

      // Try to include preceding comma
      let s = start - 1;
      while (s >= 0 && /\s/.test(content[s])) s--;
      if (s >= 0 && content[s] === ',') {
        start = s;
      } else {
        // Try including trailing comma instead
        let e = end;
        while (e < content.length && /\s/.test(content[e])) e++;
        if (e < content.length && content[e] === ',') {
          end = e + 1;
        }
      }

      const slice = content.slice(start, end);
      if (slice.length > 0 && slice.length < 5000) {
        content = content.slice(0, start) + content.slice(end);
        removed++;
      }
    }
  }

  // Now remove products that have category_name: "Luxury Packaging..."
  const productCatPatterns = [
    '"category_name":\\s*"Luxury Packaging"',
    '"category_name":\\s*"Luxury Packaging & Boxes"',
    '"category_name":\\s*"Luxury Packaging & Custom Boxes"',
    'category_name:\\s*"Luxury Packaging"',
    'category_name:\\s*"Luxury Packaging & Boxes"',
    'category_name:\\s*"Luxury Packaging & Custom Boxes"',
  ];

  for (const pattern of productCatPatterns) {
    const re = new RegExp(pattern, 'g');
    let match;
    const matches = [];
    while ((match = re.exec(content)) !== null) {
      matches.push(match.index);
    }
    for (let i = matches.length - 1; i >= 0; i--) {
      const idx = matches[i];
      let openBrace = -1;
      let depth = 0;
      for (let j = idx; j >= 0; j--) {
        const ch = content[j];
        if (ch === '}') depth++;
        else if (ch === '{') {
          if (depth === 0) { openBrace = j; break; }
          depth--;
        }
      }
      if (openBrace === -1) continue;
      let closeBrace = -1;
      depth = 0;
      for (let j = openBrace; j < content.length; j++) {
        const ch = content[j];
        if (ch === '{') depth++;
        else if (ch === '}') {
          depth--;
          if (depth === 0) { closeBrace = j; break; }
        }
      }
      if (closeBrace === -1) continue;

      let start = openBrace;
      let end = closeBrace + 1;
      let s = start - 1;
      while (s >= 0 && /\s/.test(content[s])) s--;
      if (s >= 0 && content[s] === ',') {
        start = s;
      } else {
        let e = end;
        while (e < content.length && /\s/.test(content[e])) e++;
        if (e < content.length && content[e] === ',') {
          end = e + 1;
        }
      }

      const slice = content.slice(start, end);
      if (slice.length > 0 && slice.length < 20000) {
        content = content.slice(0, start) + content.slice(end);
        removed++;
      }
    }
  }

  // Also remove inline `"name": "Luxury Packaging & Boxes"` references that are nested inside products as category.name
  // (These would show up as "name": "Luxury Packaging..." within a product's "category" sub-object)
  // Rather than removing the whole product, just remove those category references carefully:
  // We'll find the category sub-object and if its name matches, remove that category field.
  // For simplicity, we'll rely on the passes above; now write the file.

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`  String-based removal operations applied: ${removed}`);
  console.log(`  Wrote updated file to: ${filePath}`);
}

// ============================================================
// 3. Quick syntax check
// ============================================================
function syntaxCheck(filePath, label) {
  try {
    if (filePath.endsWith('.json')) {
      JSON.parse(fs.readFileSync(filePath, 'utf8'));
      console.log(`  [OK] ${label} JSON parse succeeded`);
    } else if (filePath.endsWith('.js')) {
      const { execSync } = require('child_process');
      try {
        execSync(`node --check "${filePath}"`, { stdio: 'pipe' });
        console.log(`  [OK] ${label} node --check passed`);
      } catch (e) {
        console.log(`  [WARN] ${label} node --check failed: ${e.message.split('\n')[0]}`);
      }
    }
  } catch (err) {
    console.log(`  [ERROR] ${label} validation failed: ${err.message}`);
  }
}

// ============================================================
// Run
// ============================================================
console.log('Starting Luxury Packaging category removal...');
console.log('Project root:', PROJECT_ROOT);

processCatalogProducts();
processInitialData();

console.log('\n=== Syntax / Parse Checks ===');
syntaxCheck(path.join(PROJECT_ROOT, 'client', 'src', 'data', 'catalogProducts.json'), 'catalogProducts.json');
syntaxCheck(path.join(PROJECT_ROOT, 'src', 'data', 'initialData.js'), 'initialData.js');

console.log('\nDone. Review the files carefully for any edge cases.');
