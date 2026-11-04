const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '..', 'src', 'app.js');
let appContent = fs.readFileSync(appPath, 'utf8');

const targetStr = `  // API Routes
  app.use('/api/auth', authRoutes)
  app.use('/api/categories', categoryRoutes)
  app.use('/api/services', serviceRoutes)
  app.use('/api/products', productRoutes)`;

const replacementStr = `  // Public Catalog API Cache Middleware (2 min cache, 5 min stale-while-revalidate for GET)
  const catalogCacheMiddleware = (req, res, next) => {
    if (req.method === 'GET' && !req.headers['authorization']) {
      res.setHeader('Cache-Control', 'public, max-age=120, stale-while-revalidate=300')
    }
    next()
  }

  // API Routes
  app.use('/api/auth', authRoutes)
  app.use('/api/categories', catalogCacheMiddleware, categoryRoutes)
  app.use('/api/services', catalogCacheMiddleware, serviceRoutes)
  app.use('/api/products', catalogCacheMiddleware, productRoutes)`;

if (appContent.includes(targetStr)) {
  appContent = appContent.replace(targetStr, replacementStr);
} else if (appContent.includes(targetStr.replace(/\n/g, '\r\n'))) {
  appContent = appContent.replace(targetStr.replace(/\n/g, '\r\n'), replacementStr.replace(/\n/g, '\r\n'));
} else {
  console.error('Target string not found in src/app.js');
  process.exit(1);
}

fs.writeFileSync(appPath, appContent, 'utf8');
console.log('Successfully added API caching middleware to src/app.js');
