/**
 * Unit & Integration Tests for ONPRINT Dubai Business Card SEO & White-Hat Backlink System
 * Run with: node tests/businessCardSeoLinkBuilding.test.js
 */

const assert = require('assert')
const fs = require('fs')
const path = require('path')

const businessCardService = require('../src/services/businessCardLinkBuildingService')
const persistentStore = require('../src/data/persistentStore')
const DUBAI_BLOGS = require('../src/data/dubaiBlogsData')

console.log('=================================================================')
console.log('Running ONPRINT Dubai Business Card SEO & Backlink Suite Tests...')
console.log('=================================================================\n')

// 1. Verify all 20 requested target business card keywords are present & have zero fabricated metrics
console.log('Test 1: Verifying 20 prioritized Dubai Business Card keywords & truthful metrics...')
const requiredKeywords = [
  'business card printing Dubai',
  'business cards Dubai',
  'business card printing UAE',
  'custom business cards Dubai',
  'premium business cards Dubai',
  'luxury business cards Dubai',
  'cheap business card printing Dubai',
  'affordable business cards Dubai',
  'business card design Dubai',
  'same day business card printing Dubai',
  'express business card printing Dubai',
  'corporate business cards Dubai',
  'personalized business cards Dubai',
  'embossed business cards Dubai',
  'matte and glossy business cards Dubai',
  'business card printing near me Dubai',
  'online business card printing Dubai',
  'business card suppliers Dubai',
  'business card printing Abu Dhabi',
  'business card printing Sharjah',
]

assert.strictEqual(
  businessCardService.PRIORITIZED_BUSINESS_CARD_KEYWORDS.length,
  20,
  'Should contain all 20 prioritized business card keywords'
)

for (const reqKw of requiredKeywords) {
  const match = businessCardService.PRIORITIZED_BUSINESS_CARD_KEYWORDS.find(
    (k) => k.keyword.toLowerCase() === reqKw.toLowerCase()
  )
  assert.ok(match, `Missing required keyword: ${reqKw}`)
  assert.strictEqual(match.search_volume, null, `Keyword "${reqKw}" must not have fabricated search_volume`)
  assert.strictEqual(match.keyword_difficulty, null, `Keyword "${reqKw}" must not have fabricated keyword_difficulty`)
  assert.ok(match.target_url.startsWith('/'), `Keyword "${reqKw}" must map to a valid internal target_url`)
}
console.log('  ✓ Passed: All 20 keywords verified with truthful unverified metric labels and real target URLs.\n')

// 2. Verify Qualified & Rejected Backlink Prospects and Risk Scores
console.log('Test 2: Verifying risk-assessed Dubai/UAE backlink prospects & anti-spam rejections...')
const allProspects = persistentStore.getBusinessCardBacklinkProspects()
const qualified = allProspects.filter((p) => p.qualification_status === 'qualified')
const rejected = allProspects.filter((p) => p.qualification_status === 'rejected')

assert.ok(qualified.length >= 10, 'Should include at least 10 vetted Dubai/UAE backlink prospects')
assert.ok(rejected.length >= 3, 'Should include explicitly rejected/disqualified spam/scraper domains')

for (const p of allProspects) {
  assert.ok(p.risk_score > 0, `Prospect ${p.domain} must not claim 0/100 risk-free status`)
  assert.ok(p.inclusion_or_rejection_reason && p.inclusion_or_rejection_reason.length > 15, `Prospect ${p.domain} must have detailed inclusion/rejection rationale`)
  assert.notStrictEqual(p.outreach_status, 'Acquired', `Prospect ${p.domain} must not be pre-marked Acquired without verification`)
}

const twoIp = rejected.find((p) => p.domain === '2ip.io')
assert.ok(twoIp, '2ip.io reverse-IP scraper from SEMrush export should be explicitly listed as rejected for link building')
console.log(`  ✓ Passed: ${qualified.length} qualified prospects and ${rejected.length} rejected domains verified.\n`)

// 3. Verify Natural Anchor Text Strategy Distribution
console.log('Test 3: Verifying Natural Anchor Text Strategy distribution & exact-match cap...')
const dist = businessCardService.ANCHOR_TEXT_STRATEGY.distribution_targets
const totalPct = dist.reduce((acc, item) => acc + item.target_percentage, 0)
assert.strictEqual(totalPct, 100, 'Anchor text distribution percentages must sum to 100%')
const exactMatchBucket = dist.find((d) => d.category.toLowerCase().includes('exact-match'))
assert.ok(exactMatchBucket && exactMatchBucket.target_percentage <= 5, 'Exact-match commercial anchors must be capped at <= 5%')
console.log('  ✓ Passed: Natural anchor distribution sums to 100% with <= 5% exact-match cap.\n')

// 4. Verify all 5 Link-Worthy Business Card Guides are published in persistentStore and DUBAI_BLOGS
console.log('Test 4: Verifying all 5 link-worthy business card guides are seeded and accessible...')
const expectedSlugs = [
  'how-to-choose-business-card-paper-dubai',
  'business-card-design-guide-dubai-businesses',
  'business-card-printing-checklist-uae-startups',
  'premium-vs-standard-business-cards-dubai-guide',
  'business-branding-networking-materials-dubai-companies',
]

for (const slug of expectedSlugs) {
  const fromStore = persistentStore.getBlogBySlug(slug)
  assert.ok(fromStore, `Blog guide "${slug}" should be retrievable from persistentStore.getBlogBySlug`)
  assert.ok(
    fromStore.content.includes('/business-card-printing-dubai'),
    `Blog guide "${slug}" must contain contextual internal link to /business-card-printing-dubai`
  )
  const fromCatalog = DUBAI_BLOGS.find((b) => b.slug === slug)
  assert.ok(fromCatalog, `Blog guide "${slug}" should be present in DUBAI_BLOGS catalog`)
}
console.log('  ✓ Passed: All 5 link-worthy guides are live and internally linked to /business-card-printing-dubai.\n')

// 5. Verify Safety Rules on Prospect Updates (Approval & Live URL Verification)
console.log('Test 5: Verifying strict safety rules on outreach approval and Acquired status...')
const sampleProspect = qualified[0]

// Should block marking Outreach Sent without owner approval
let blockedUnapproved = false
try {
  persistentStore.updateBusinessCardBacklinkProspect(sampleProspect.id, {
    approved_by_owner: false,
    outreach_status: 'Outreach Sent',
  })
} catch (err) {
  blockedUnapproved = true
}
assert.strictEqual(blockedUnapproved, true, 'Must block setting status to Outreach Sent without owner approval')

// Should block marking Acquired without a verified live URL
let blockedFakeAcquired = false
try {
  persistentStore.updateBusinessCardBacklinkProspect(sampleProspect.id, {
    approved_by_owner: true,
    outreach_status: 'Acquired',
    live_backlink_url: '',
    verified_live: false,
  })
} catch (err) {
  blockedFakeAcquired = true
}
assert.strictEqual(blockedFakeAcquired, true, 'Must block marking a backlink as Acquired without a verified live URL')

// Should block outreach to a rejected domain
let blockedRejected = false
try {
  persistentStore.updateBusinessCardBacklinkProspect(twoIp.id, {
    approved_by_owner: true,
    outreach_status: 'Outreach Sent',
  })
} catch (err) {
  blockedRejected = true
}
assert.strictEqual(blockedRejected, true, 'Must block outreach to a rejected/disqualified domain')
console.log('  ✓ Passed: Safety guards prevent unapproved outreach, unverified acquisitions, and spam domains.\n')

// 6. Export CSV Deliverables to Repository Root
console.log('Test 6: Exporting CSV spreadsheets to repository root...')
const prospectsCsv = businessCardService.exportProspectsCsv(allProspects)
const keywordsCsv = businessCardService.exportKeywordsCsv()

const prospectsCsvPath = path.join(__dirname, '..', 'dubai-business-card-backlink-prospects.csv')
const keywordsCsvPath = path.join(__dirname, '..', 'dubai-business-card-keywords-research.csv')

fs.writeFileSync(prospectsCsvPath, prospectsCsv, 'utf8')
fs.writeFileSync(keywordsCsvPath, keywordsCsv, 'utf8')

assert.ok(fs.existsSync(prospectsCsvPath), 'dubai-business-card-backlink-prospects.csv should exist')
assert.ok(fs.existsSync(keywordsCsvPath), 'dubai-business-card-keywords-research.csv should exist')
console.log('  ✓ Passed: Exported dubai-business-card-backlink-prospects.csv and dubai-business-card-keywords-research.csv.\n')

console.log('=================================================================')
console.log('ALL DUBAI BUSINESS CARD SEO & BACKLINK TESTS PASSED (6/6)')
console.log('=================================================================')
