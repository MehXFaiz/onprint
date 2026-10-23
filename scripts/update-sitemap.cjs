const fs = require('fs');
const path = require('path');

const sitemapPaths = [
  path.resolve(__dirname, '../client/public/sitemap.xml'),
  path.resolve(__dirname, '../sitemap.xml'),
];

const stampUrls = [
  {
    loc: 'https://www.0nprint.com/categories/stamps-printing-dubai',
    priority: '0.9',
    changefreq: 'weekly',
  },
  {
    loc: 'https://www.0nprint.com/stamps',
    priority: '0.9',
    changefreq: 'weekly',
  },
  {
    loc: 'https://www.0nprint.com/products/self-inking-company-stamps',
    priority: '0.8',
    changefreq: 'weekly',
  },
  {
    loc: 'https://www.0nprint.com/products/round-company-stamps',
    priority: '0.8',
    changefreq: 'weekly',
  },
  {
    loc: 'https://www.0nprint.com/products/rectangular-company-stamps',
    priority: '0.8',
    changefreq: 'weekly',
  },
  {
    loc: 'https://www.0nprint.com/products/heavy-duty-dater-stamps',
    priority: '0.8',
    changefreq: 'weekly',
  },
  {
    loc: 'https://www.0nprint.com/products/pocket-mobile-stamps',
    priority: '0.8',
    changefreq: 'weekly',
  },
  {
    loc: 'https://www.0nprint.com/products/name-signature-stamps',
    priority: '0.8',
    changefreq: 'weekly',
  },
  {
    loc: 'https://www.0nprint.com/products/custom-logo-stamps',
    priority: '0.8',
    changefreq: 'weekly',
  },
  {
    loc: 'https://www.0nprint.com/products/vat-trn-stamps',
    priority: '0.8',
    changefreq: 'weekly',
  },
  {
    loc: 'https://www.0nprint.com/products/luxury-brass-wax-seal-stamps',
    priority: '0.8',
    changefreq: 'weekly',
  },
  {
    loc: 'https://www.0nprint.com/products/bulk-corporate-stamp-orders',
    priority: '0.8',
    changefreq: 'weekly',
  },
];

const today = new Date().toISOString().split('T')[0];

sitemapPaths.forEach((p) => {
  if (!fs.existsSync(p)) return;
  let content = fs.readFileSync(p, 'utf8');

  stampUrls.forEach((u) => {
    if (!content.includes(u.loc)) {
      const entry = `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>\n`;
      content = content.replace('</urlset>', `${entry}</urlset>`);
    }
  });

  fs.writeFileSync(p, content, 'utf8');
  console.log(`Updated sitemap: ${p}`);
});
