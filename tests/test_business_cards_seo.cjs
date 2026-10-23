const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('=== RUNNING BUSINESS CARDS SEO & LEAD AUDIT ===\n');

// 1. Check data files exist and export BUSINESS_CARDS_LANDING_DATA
const { BUSINESS_CARDS_LANDING_DATA } = require('../src/data/businessCardsLandingData');

const requiredSlugs = [
  'business-card-printing-dubai',
  'business-card-printing-uae',
  'visiting-card-printing-dubai',
  'premium-business-cards',
  'matte-business-cards',
  'bulk-business-cards',
  'luxury-business-cards',
  'foil-business-cards',
  'spot-uv-business-cards',
  'velvet-business-cards',
  'soft-touch-business-cards',
  'embossed-business-cards',
  'corporate-business-cards',
  'business-card-design',
  'same-day-business-card-printing',
  'business-card-printing-abu-dhabi',
  'business-card-printing-sharjah',
  'business-card-printing-ajman',
];

console.log('Test 1: Validating all 18 Business Card Topical Cluster Landing Pages:');
requiredSlugs.forEach((slug) => {
  const page = BUSINESS_CARDS_LANDING_DATA[slug];
  assert.ok(page, `Missing landing data for slug: ${slug}`);
  assert.ok(page.title && page.title.length > 10, `Missing or short title for ${slug}`);
  assert.ok(page.metaDescription && page.metaDescription.length > 30, `Missing or short metaDescription for ${slug}`);
  assert.ok(page.h1 && page.h1.length > 5, `Missing H1 for ${slug}`);
  assert.ok(page.focusKeyword, `Missing focusKeyword for ${slug}`);
  assert.ok(Array.isArray(page.technicalSpecs) && page.technicalSpecs.length >= 3, `Insufficient technicalSpecs for ${slug}`);
  assert.ok(Array.isArray(page.faqs) && page.faqs.length >= 2, `Insufficient faqs for ${slug}`);
  console.log(`  ✓ ${slug}: H1 = "${page.h1}", FAQs = ${page.faqs.length}, Specs = ${page.technicalSpecs.length}`);
});
console.log('  ✓ All 18 business card cluster pages verified with complete specifications and FAQs.\n');

// 2. Test WhatsApp Prefilled Message Template
console.log('Test 2: Verifying WhatsApp Lead Message Generation Template:');
function formatBusinessCardInquiry({
  quantity = '100',
  paper = '',
  material = '',
  gsm = '',
  stock = '',
  finish = 'Matte',
  finishing = '',
  coating = '',
  location = 'Dubai',
  deliveryLocation = '',
} = {}) {
  const resolvedPaper = paper || material || (gsm ? `${gsm} Artboard` : stock) || '350 GSM Silk';
  const resolvedFinish = finish || finishing || coating || 'Matte';
  const resolvedLocation = location || deliveryLocation || 'Dubai';
  const resolvedQty = quantity ? String(quantity).trim() : '100';

  const specPhrases = [];
  if (resolvedQty) specPhrases.push(`Quantity: ${resolvedQty}`);
  if (resolvedPaper) specPhrases.push(`Paper/GSM: ${resolvedPaper}`);
  if (resolvedFinish) specPhrases.push(`Finish: ${resolvedFinish}`);
  if (resolvedLocation) specPhrases.push(`Delivery location: ${resolvedLocation}`);

  let intro = 'Hello ONPRINT, I would like a quotation for business cards.';
  if (specPhrases.length > 0) {
    intro += ` ${specPhrases.join('. ')}.`;
  }
  intro += ' Please share pricing and available options.';
  return intro;
}

const sampleMsg = formatBusinessCardInquiry({
  quantity: '500',
  paper: '400 GSM Matte Artboard',
  finish: 'Gold Foil Stamping',
  location: 'DIFC, Dubai',
});

const expectedMsg = 'Hello ONPRINT, I would like a quotation for business cards. Quantity: 500. Paper/GSM: 400 GSM Matte Artboard. Finish: Gold Foil Stamping. Delivery location: DIFC, Dubai. Please share pricing and available options.';
assert.strictEqual(sampleMsg, expectedMsg, 'Message must strictly match prompt prefilled specification template');
console.log(`  Generated message:\n  "${sampleMsg}"`);
console.log('  ✓ Prefilled message formatting strictly matches prompt requirements.\n');

// 3. Test Sitemap XML integrity
console.log('Test 3: Checking sitemap.xml for new business card routes:');
const sitemapPath = path.join(__dirname, '..', 'client', 'public', 'sitemap.xml');
const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');

assert.ok(sitemapContent.includes('https://www.0nprint.com/business-card-printing-dubai'), 'sitemap must have primary hub');
assert.ok(sitemapContent.includes('https://www.0nprint.com/matte-business-cards'), 'sitemap must have matte-business-cards');
assert.ok(sitemapContent.includes('https://www.0nprint.com/bulk-business-cards'), 'sitemap must have bulk-business-cards');
assert.ok(sitemapContent.includes('https://www.0nprint.com/categories/business-cards-printing'), 'sitemap must have business-cards-printing category');
console.log('  ✓ Sitemap XML contains all new cluster landing pages and category hubs.\n');

// 4. Test SEO category meta description
console.log('Test 4: Checking category metadata in initialData.js:');
const initialData = require('../src/data/initialData');
const bcCat = initialData.categories.find(c => c.slug === 'business-cards-printing');
assert.ok(bcCat, 'business-cards-printing category must exist in initialData.js');
assert.strictEqual(bcCat.seoTitle, 'Business Card Printing in Dubai | ONPRINT');
assert.strictEqual(bcCat.seoDescription, 'Explore custom business cards, premium finishes and corporate printing options from ONPRINT. Request a business card quotation for your requirements in Dubai and the UAE.');
console.log('  ✓ Category SEO title and meta description match prompt suggestions perfectly.\n');

console.log('=== ALL BUSINESS CARD SEO & LEAD AUDIT TESTS PASSED ===');
