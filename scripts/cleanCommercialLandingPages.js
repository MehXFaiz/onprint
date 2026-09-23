const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const filePath = path.join(PROJECT_ROOT, 'client', 'src', 'data', 'commercialLandingPagesData.js');

delete require.cache[require.resolve(filePath)];
let data = require(filePath);

const keysToRemove = ['packaging-printing-dubai', 'custom-packaging-dubai'];

// Check if landing pages are nested under COMMERCIAL_LANDING_PAGES
let target = null;
if (data.COMMERCIAL_LANDING_PAGES && typeof data.COMMERCIAL_LANDING_PAGES === 'object') {
  target = data.COMMERCIAL_LANDING_PAGES;
} else if (data && Array.isArray(Object.values(data)[0])) {
  // Not the expected structure
  console.log('[WARN] Unexpected module structure - keys:', Object.keys(data).slice(0, 5));
} else {
  target = data;
}

const removed = [];
if (target) {
  for (const k of keysToRemove) {
    if (k in target) {
      delete target[k];
      removed.push(k);
    }
  }
  // Also fix relatedServices links
  function cleanRelatedServices(obj) {
    if (!obj || typeof obj !== 'object') return;
    for (const key of Object.keys(obj)) {
      const val = obj[key];
      if (key === 'relatedServices' && Array.isArray(val)) {
        obj[key] = val.filter((svc) => {
          const p = svc.path || svc.Path || '';
          return !keysToRemove.some((rk) => String(p).includes(rk));
        });
      } else if (Array.isArray(val)) {
        val.forEach(cleanRelatedServices);
      } else if (val && typeof val === 'object') {
        cleanRelatedServices(val);
      }
    }
  }
  cleanRelatedServices(target);
}

// Also clean the FAQ answer with "luxury packaging" already done with string edit earlier - skip

const output = `module.exports = ${JSON.stringify(data, null, 2)};\n`;
fs.writeFileSync(filePath, output, 'utf8');

console.log(`Removed entries: ${removed.length ? removed.join(', ') : '(none found)'}`);
console.log(`Remaining landing page keys: ${target ? Object.keys(target).length : 'N/A'}`);

// Validate
try {
  const { execSync } = require('child_process');
  execSync(`node --check "${filePath}"`, { stdio: 'pipe' });
  console.log('[OK] node --check passed');
  delete require.cache[require.resolve(filePath)];
  require(filePath);
  console.log('[OK] require succeeded');
} catch (e) {
  console.error('[ERROR] Validation failed:', e.message);
}
