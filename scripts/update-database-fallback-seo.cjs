const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'src', 'config', 'database.js');
let content = fs.readFileSync(dbPath, 'utf8');

// Ensure persistentStore is imported
if (!content.includes('const persistentStore = require(\'../data/persistentStore\')')) {
  content = content.replace(
    `const { categories: initialCategories, products: initialProducts, services: initialServices } = require('../data/initialData')`,
    `const { categories: initialCategories, products: initialProducts, services: initialServices } = require('../data/initialData')
const persistentStore = require('../data/persistentStore')`
  );
}

// Add fallback table handlers before return [[], []] at line 367
const oldTargetCheck = `    if (target === 'users' && upperSql.includes('SELECT')) {
      return [[{
        id: 1,
        name: process.env.ADMIN_NAME || 'ONPRINT Admin',
        email: (process.env.ADMIN_EMAIL || 'admin@onprint.ae').toLowerCase(),
        role: 'admin',
        status: 'active',
      }], []]
    }
    return [[], []]`;

const newTargetCheck = `    if (target === 'users' && upperSql.includes('SELECT')) {
      return [[{
        id: 1,
        name: process.env.ADMIN_NAME || 'ONPRINT Admin',
        email: (process.env.ADMIN_EMAIL || 'admin@onprint.ae').toLowerCase(),
        role: 'admin',
        status: 'active',
      }], []]
    }
    if (target === 'page_seo') {
      if (upperSql.includes('GROUP BY LOWER(TRIM(FOCUS_KEYWORD))') || upperSql.includes('GROUP BY LOWER(TRIM(FOCUS_KEYWORD))')) {
        const list = persistentStore.getPageSeoList ? persistentStore.getPageSeoList() : []
        const counts = {}
        list.forEach(p => {
          const kw = (p.focus_keyword || '').toLowerCase().trim()
          if (kw) {
            counts[kw] = counts[kw] || []
            counts[kw].push(p.url)
          }
        })
        const cannibalRows = Object.entries(counts)
          .filter(([kw, urls]) => urls.length > 1)
          .map(([kw, urls]) => ({ kw, cnt: urls.length, urls: urls.join('|||') }))
        return [cannibalRows, []]
      }
      let list = persistentStore.getPageSeoList ? persistentStore.getPageSeoList() : []
      if (params.length > 0 && (upperSql.includes('URL = ?') || upperSql.includes('URL=?'))) {
        const val = String(params[0]).toLowerCase()
        const match = list.find(p => p.url && p.url.toLowerCase() === val)
        return [match ? [match] : [], []]
      }
      if (params.length > 0 && (upperSql.includes('ID = ?') || upperSql.includes('ID=?'))) {
        const val = String(params[0])
        const match = list.find(p => String(p.id) === val)
        return [match ? [match] : [], []]
      }
      if (upperSql.includes('PAGE_TYPE = ?')) {
        const val = String(params[0]).toLowerCase()
        list = list.filter(p => p.page_type && p.page_type.toLowerCase() === val)
      }
      return [list, []]
    }
    if (target === 'blogs' || target === 'blog_posts') {
      const blogs = persistentStore.getBlogs ? persistentStore.getBlogs() : []
      if (params.length > 0 && (upperSql.includes('WHERE') || upperSql.includes('LIMIT 1'))) {
        const val = String(params[0]).toLowerCase()
        const match = blogs.find(b => (b.slug && b.slug.toLowerCase() === val) || String(b.id) === val)
        return [match ? [match] : [], []]
      }
      return [blogs, []]
    }
    if (target === 'seo_keywords' || target === 'keywords') {
      return [persistentStore.getKeywords ? persistentStore.getKeywords() : [], []]
    }
    if (target === 'seo_backlinks' || target === 'backlinks') {
      return [persistentStore.getBacklinks ? persistentStore.getBacklinks() : [], []]
    }
    if (target === 'geo_faqs') {
      return [persistentStore.getGeoFaqs ? persistentStore.getGeoFaqs() : [], []]
    }
    if (target === 'geo_content') {
      return [persistentStore.getGeoContent ? persistentStore.getGeoContent() : [], []]
    }
    if (target === 'seo_ai_visibility_tracking' || target === 'ai_visibility') {
      return [persistentStore.getAiVisibilityList ? persistentStore.getAiVisibilityList() : [], []]
    }
    if (target === 'seo_tasks') {
      return [persistentStore.getSeoTasks ? persistentStore.getSeoTasks() : [], []]
    }
    if (target === 'seo_conversions') {
      return [persistentStore.getSeoConversions ? persistentStore.getSeoConversions() : [], []]
    }
    return [[], []]`;

if (content.includes(oldTargetCheck)) {
  content = content.replace(oldTargetCheck, newTargetCheck);
  fs.writeFileSync(dbPath, content, 'utf8');
  console.log('Successfully updated src/config/database.js with fallback SEO handlers.');
} else {
  console.error('Target string not found in database.js');
}
