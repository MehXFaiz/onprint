const fs = require('fs');
const path = require('path');

const appPath = path.resolve(__dirname, '../client/src/App.jsx');
let content = fs.readFileSync(appPath, 'utf8');

// 1. Add lazy import
const importTarget = `const LocationLandingPage = lazy(() => import('./pages/public/LocationLandingPage'))`;
const importReplacement = `const LocationLandingPage = lazy(() => import('./pages/public/LocationLandingPage'))\r\nconst StampsLandingPage = lazy(() => import('./pages/public/StampsLandingPage'))`;

if (!content.includes('StampsLandingPage')) {
  if (content.includes(importTarget)) {
    content = content.replace(importTarget, importReplacement);
  } else {
    // try with LF
    content = content.replace(
      `const LocationLandingPage = lazy(() => import('./pages/public/LocationLandingPage'))\n`,
      `const LocationLandingPage = lazy(() => import('./pages/public/LocationLandingPage'))\nconst StampsLandingPage = lazy(() => import('./pages/public/StampsLandingPage'))\n`
    );
  }
}

// 2. Replace old stamp redirects with dedicated routes
const oldRoutesRegex = /<Route\s+path="\/stamps"\s+element=\{<Navigate[^>]+>\}\s*\/>\s*<Route\s+path="\/custom-stamps"\s+element=\{<Navigate[^>]+>\}\s*\/>\s*<Route\s+path="\/stamp-maker-dubai"\s+element=\{<Navigate[^>]+>\}\s*\/>\s*<Route\s+path="\/custom-stamp-printing-dubai"\s+element=\{<Navigate[^>]+>\}\s*\/>\s*<Route\s+path="\/company-stamps-dubai"\s+element=\{<Navigate[^>]+>\}\s*\/>/;

const newRoutes = `{/* Dedicated Stamp Products Section & Aliases */}
            <Route path="/categories/custom-stamps-seals" element={<StampsLandingPage />} />
            <Route path="/categories/stamps-printing-dubai" element={<StampsLandingPage />} />
            <Route path="/stamps" element={<StampsLandingPage />} />
            <Route path="/custom-stamps" element={<StampsLandingPage />} />
            <Route path="/company-stamps-dubai" element={<StampsLandingPage />} />
            <Route path="/stamp-maker-dubai" element={<StampsLandingPage />} />
            <Route path="/custom-stamp-printing-dubai" element={<StampsLandingPage />} />
            <Route path="/custom-rubber-stamps" element={<StampsLandingPage />} />
            <Route path="/quote/stamps" element={<StampsLandingPage />}`;

if (oldRoutesRegex.test(content)) {
  content = content.replace(oldRoutesRegex, newRoutes);
} else {
  console.log('Regex did not match old routes, checking manually...');
}

fs.writeFileSync(appPath, content, 'utf8');
console.log('Successfully updated App.jsx routes for Stamps & Seals!');
