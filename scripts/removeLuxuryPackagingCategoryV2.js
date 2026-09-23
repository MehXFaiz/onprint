const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '..');

const TARGET_CATEGORY_NAMES = new Set([
  'Luxury Packaging & Boxes',
  'Luxury Packaging & Custom Boxes',
  'Luxury Packaging',
]);
const TARGET_CATEGORY_SLUGS = new Set([
  'luxury-packaging-boxes',
  'luxury-packaging-custom-boxes',
]);
const TARGET_CATEGORY_IDS = new Set([
  'cat-luxury-packaging-boxes',
  'cat-luxury-packaging-custom-boxes',
]);
const TARGET_PRODUCT_SLUGS = new Set([
  'luxury-packaging-custom-boxes',
  'luxury-packaging-boxes',
]);
const TARGET_PRODUCT_IDS = new Set([
  'prod-luxury-packaging-custom-boxes',
  'prod-luxury-packaging-boxes',
]);

function isTargetCategory(cat) {
  if (!cat || typeof cat !== 'object') return false;
  const name = String(cat.name || cat.category_name || '');
  const slug = String(cat.slug || cat.category_slug || '');
  const id = String(cat._id || cat.id || '');
  return (
    TARGET_CATEGORY_NAMES.has(name) ||
    TARGET_CATEGORY_SLUGS.has(slug) ||
    TARGET_CATEGORY_IDS.has(id)
  );
}

function productRefersToRemovedCategory(prod) {
  if (!prod || typeof prod !== 'object') return false;

  // Product id / slug check (for the product being the luxury packaging product itself)
  const pid = String(prod._id || prod.id || '');
  const pslug = String(prod.slug || '');
  if (TARGET_PRODUCT_IDS.has(pid) || TARGET_PRODUCT_SLUGS.has(pslug)) return true;

  // Product name check
  const pname = String(prod.name || '');
  if (TARGET_CATEGORY_NAMES.has(pname)) return true;

  // Direct category fields
  const catName = String(prod.category_name || prod.categoryName || '');
  const catSlug = String(prod.category_slug || prod.categorySlug || '');
  const catId = String(prod.category_id || prod.categoryId || '');
  if (
    TARGET_CATEGORY_NAMES.has(catName) ||
    TARGET_CATEGORY_SLUGS.has(catSlug) ||
    TARGET_CATEGORY_IDS.has(catId)
  ) return true;

  // Nested category object (product.category = {...})
  if (prod.category && typeof prod.category === 'object' && !Array.isArray(prod.category)) {
    if (isTargetCategory(prod.category)) return true;
  }

  // Array of categories
  if (Array.isArray(prod.categories)) {
    for (const c of prod.categories) {
      if (typeof c === 'string') {
        if (TARGET_CATEGORY_NAMES.has(c)) return true;
      } else if (c && typeof c === 'object') {
        if (isTargetCategory(c)) return true;
      }
    }
  }

  // Fallback: look for any value that matches target names as a substring in category fields
  for (const k of Object.keys(prod)) {
    const kLow = String(k).toLowerCase();
    if (kLow.includes('category') || kLow.includes('cat_')) {
      const v = prod[k];
      if (typeof v === 'string') {
        if (TARGET_CATEGORY_NAMES.has(v)) return true;
      }
    }
  }

  return false;
}

function cleanArray(arr) {
  if (!Array.isArray(arr)) return { arr, removedCats: 0, removedProds: 0, changed: false };

  // Probe to determine if array contains categories or products
  const probe = arr.find((x) => x && typeof x === 'object');
  let mode = 'unknown';
  if (probe) {
    const hasCatProps = 'name' in probe && ('slug' in probe || '_id' in probe) && ('seoTitle' in probe || 'seo_title' in probe || 'display_order' in probe || 'active' in probe);
    const hasProdProps = 'category' in probe || 'category_name' in probe || 'price' in probe || 'minimumQuantity' in probe || 'images360' in probe;
    if (hasCatProps && !hasProdProps) mode = 'categories';
    else if (hasProdProps) mode = 'products';
  }

  let removedCats = 0;
  let removedProds = 0;
  let changed = false;
  let newArr = [];

  for (const item of arr) {
    if (item && typeof item === 'object' && !Array.isArray(item)) {
      const cleaned = cleanObject(item);
      if (cleaned.changed) changed = true;
      const keep = cleaned.obj;

      if (mode === 'categories' && isTargetCategory(keep)) {
        removedCats++;
        changed = true;
        continue;
      }
      if (mode === 'products' && productRefersToRemovedCategory(keep)) {
        removedProds++;
        changed = true;
        continue;
      }
      if (mode === 'unknown') {
        if (isTargetCategory(keep)) { removedCats++; changed = true; continue; }
        if (productRefersToRemovedCategory(keep)) { removedProds++; changed = true; continue; }
      }

      // For categories, also clean nested products if any
      if (mode === 'categories' || (!mode && 'products' in keep && Array.isArray(keep.products))) {
        const nested = cleanArray(keep.products);
        if (nested.changed) {
          keep.products = nested.arr;
          removedProds += nested.removedProds;
          removedCats += nested.removedCats;
          changed = true;
        }
      }

      newArr.push(keep);
    } else if (Array.isArray(item)) {
      const nested = cleanArray(item);
      if (nested.changed) changed = true;
      removedCats += nested.removedCats;
      removedProds += nested.removedProds;
      newArr.push(nested.arr);
    } else {
      newArr.push(item);
    }
  }

  // Renumber categories if applicable
  if (mode === 'categories' && newArr.length > 0 && (removedCats > 0)) {
    newArr = newArr.map((cat, idx) => {
      const nc = typeof cat === 'object' && cat ? { ...cat } : cat;
      const order = idx + 1;
      if (nc && typeof nc === 'object') {
        if (typeof nc.id === 'number') nc.id = order;
        if ('display_order' in nc) nc.display_order = order;
        if ('displayOrder' in nc) nc.displayOrder = order;
      }
      return nc;
    });
    changed = true;
  }

  return { arr: newArr, removedCats, removedProds, changed };
}

function cleanObject(obj) {
  if (!obj || typeof obj !== 'object') return { obj, changed: false, removedCats: 0, removedProds: 0 };
  let changed = false;
  let removedCats = 0;
  let removedProds = 0;
  const result = {};
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    if (Array.isArray(val)) {
      const r = cleanArray(val);
      if (r.changed) changed = true;
      removedCats += r.removedCats;
      removedProds += r.removedProds;
      result[key] = r.arr;
    } else if (val && typeof val === 'object') {
      const r = cleanObject(val);
      if (r.changed) changed = true;
      removedCats += r.removedCats;
      removedProds += r.removedProds;
      result[key] = r.obj;
    } else {
      result[key] = val;
    }
  }
  return { obj: result, changed, removedCats, removedProds };
}

function serializeForJsModule(obj, indent = 0) {
  // Use JSON.stringify as base, then convert double quotes to single quotes only for top-level keys if needed.
  // To keep it simple and safe, just emit JSON-based representation. JSON is valid JS when used as an expression.
  return JSON.stringify(obj, null, 2);
}

// ===== Process catalogProducts.json =====
console.log('\n=== Processing catalogProducts.json (object-based) ===');
const catalogPath = path.join(PROJECT_ROOT, 'client', 'src', 'data', 'catalogProducts.json');
if (fs.existsSync(catalogPath)) {
  const raw = fs.readFileSync(catalogPath, 'utf8');
  const data = JSON.parse(raw);
  let cleaned;
  let rc = 0, rp = 0;
  if (Array.isArray(data)) {
    const r = cleanArray(data);
    cleaned = r.arr; rc = r.removedCats; rp = r.removedProds;
  } else {
    const r = cleanObject(data);
    cleaned = r.obj; rc = r.removedCats; rp = r.removedProds;
  }
  fs.writeFileSync(catalogPath, JSON.stringify(cleaned, null, 2), 'utf8');
  console.log(`  Removed categories: ${rc}`);
  console.log(`  Removed products: ${rp}`);
  JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
  console.log(`  [OK] catalogProducts.json valid JSON`);
} else {
  console.log('  [SKIP] File not found');
}

// ===== Process initialData.js (require-based) =====
console.log('\n=== Processing initialData.js (require-based) ===');
const initialDataPath = path.join(PROJECT_ROOT, 'src', 'data', 'initialData.js');
if (fs.existsSync(initialDataPath)) {
  delete require.cache[require.resolve(initialDataPath)];
  let loaded;
  try {
    loaded = require(initialDataPath);
  } catch (e) {
    console.error('  [FATAL] Cannot require initialData.js:', e.message);
    process.exit(1);
  }

  let totalRC = 0;
  let totalRP = 0;
  let anyChanged = false;
  const cleanedExports = {};

  for (const key of Object.keys(loaded)) {
    const val = loaded[key];
    if (Array.isArray(val)) {
      const r = cleanArray(val);
      if (r.changed) anyChanged = true;
      totalRC += r.removedCats;
      totalRP += r.removedProds;
      cleanedExports[key] = r.arr;
    } else if (val && typeof val === 'object') {
      const r = cleanObject(val);
      if (r.changed) anyChanged = true;
      totalRC += r.removedCats;
      totalRP += r.removedProds;
      cleanedExports[key] = r.obj;
    } else {
      cleanedExports[key] = val;
    }
  }

  // Write the cleaned module with proper module.exports
  const serialized = serializeForJsModule(cleanedExports);
  const output = `// Auto-regenerated by removeLuxuryPackagingCategoryV2.js\n// Object-based cleaning: removed Luxury Packaging category & related products\nmodule.exports = ${serialized};\n`;
  fs.writeFileSync(initialDataPath, output, 'utf8');

  console.log(`  Removed categories: ${totalRC}`);
  console.log(`  Removed products: ${totalRP}`);
  console.log(`  Any changes applied: ${anyChanged}`);

  // Validate by re-requiring
  delete require.cache[require.resolve(initialDataPath)];
  try {
    require(initialDataPath);
    console.log(`  [OK] initialData.js require succeeded after rewrite`);
  } catch (e) {
    console.error(`  [ERROR] initialData.js require failed after rewrite:`, e.message);
  }

  // node --check
  try {
    const { execSync } = require('child_process');
    execSync(`node --check "${initialDataPath}"`, { stdio: 'pipe' });
    console.log(`  [OK] initialData.js node --check passed`);
  } catch (e) {
    console.error(`  [ERROR] node --check failed:`, e.stderr ? String(e.stderr).split('\n').slice(0, 5).join('\n') : e.message);
  }
}

console.log('\nDone.');
