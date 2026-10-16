const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('fs')
const path = require('path')
const backlinkAuditService = require('../src/services/backlinkAuditService')

test('1. Parses real uploaded Google Search Console Latest Links CSV (0nprint.com-Latest links-2026-10-16.csv)', () => {
  const csvPath = path.join(__dirname, '../src/data/0nprint.com-Latest links-2026-10-16.csv')
  const rawCsv = fs.readFileSync(csvPath, 'utf8')
  const parsed = backlinkAuditService.parseBacklinkCsv(rawCsv, '0nprint.com-Latest links-2026-10-16.csv')

  assert.equal(parsed.detectedFormat, 'gsc_latest_links')
  assert.equal(parsed.validRows.length, 1)
  assert.equal(parsed.validRows[0].linking_domain, '2ip.io')
  assert.equal(parsed.validRows[0].linking_url, 'https://2ip.io/ru/domain-list-by-ip/aih.life/')
  assert.equal(parsed.validRows[0].last_checked_at, '2026-09-17')
})

test('2. Classifies 2ip.io reverse-IP scraper link as "Suspicious — needs review" with concrete evidence', () => {
  const audit = backlinkAuditService.classifyBacklink({
    linking_domain: '2ip.io',
    linking_url: 'https://2ip.io/ru/domain-list-by-ip/aih.life/',
    last_checked_at: '2026-09-17',
  })

  assert.equal(audit.classification, 'Suspicious — needs review')
  assert.ok(audit.risk_score >= 45 && audit.risk_score <= 74, `Expected risk score 45-74, got ${audit.risk_score}`)
  assert.ok(audit.evidence.some((e) => e.includes('2ip.io') || e.includes('domain-list-by-ip')))
  assert.ok(audit.evidence.some((e) => e.includes('aih.life')))
})

test('3. Enforces safety guardrails: Never classifies or disavows a domain solely due to low Authority Score, foreign language, or unfamiliar name', () => {
  // Foreign language + low authority score + unfamiliar domain name, but no spam or scraper signals
  const foreignLowAuth = backlinkAuditService.classifyBacklink({
    linking_domain: 'atelier-graphique-lyon.fr',
    linking_url: 'https://atelier-graphique-lyon.fr/ru/resources/partenaires',
    target_url: 'https://0nprint.com/',
    anchor_text: '0nprint.com',
    authority: 6,
    semrush_toxicity_score: 20,
  })

  assert.notEqual(foreignLowAuth.classification, 'Confirmed harmful')
  assert.equal(foreignLowAuth.disavow_scope, 'none')
  assert.ok(foreignLowAuth.safety_guardrails_applied.length >= 4)
})

test('4. Treats SEMrush toxicity score as a signal (Suspicious — needs review), NEVER as sole proof of "Confirmed harmful"', () => {
  const highSemrushOnly = backlinkAuditService.classifyBacklink({
    linking_domain: 'unfamiliar-blog-portal.org',
    linking_url: 'https://unfamiliar-blog-portal.org/post-123',
    target_url: 'https://0nprint.com/',
    anchor_text: 'visit website',
    authority: 12,
    semrush_toxicity_score: 78,
  })

  assert.equal(highSemrushOnly.classification, 'Suspicious — needs review')
  assert.notEqual(highSemrushOnly.classification, 'Confirmed harmful')
})

test('5. Classifies explicit casino/pharma/link-farm spam as "Confirmed harmful"', () => {
  const casinoSpam = backlinkAuditService.classifyBacklink({
    linking_domain: 'lucky-slots-777.xyz',
    linking_url: 'https://lucky-slots-777.xyz/link-exchange/free-backlinks/',
    target_url: 'https://0nprint.com/',
    anchor_text: 'best online casino slots bonus',
    authority: 8,
    semrush_toxicity_score: 92,
  })

  assert.equal(casinoSpam.classification, 'Confirmed harmful')
  assert.ok(casinoSpam.risk_score >= 75)
  assert.equal(casinoSpam.disavow_scope, 'domain')
})

test('6. Protects legitimate UAE business directories and trade publications as "Potentially legitimate"', () => {
  const legit = backlinkAuditService.classifyBacklink({
    linking_domain: 'dubaichambers.com',
    linking_url: 'https://www.dubaichambers.com/en/business-directory/member-onprint',
    target_url: 'https://www.0nprint.com/about',
    anchor_text: 'ONPRINT Member Profile',
    authority: 82,
  })

  assert.equal(legit.classification, 'Potentially legitimate')
  assert.ok(legit.risk_score < 20)
  assert.equal(legit.disavow_scope, 'none')
})

test('7. Deduplicates backlinks and parses SEMrush CSV format accurately', () => {
  const semrushCsv = [
    'Source url,Target url,Anchor,Nofollow,Authority Score,Toxicity score,First seen,Last seen',
    'https://2ip.io/ru/domain-list-by-ip/aih.life/,https://0nprint.com/,0nprint.com,false,42,58,2026-09-17,2026-09-17',
    'https://2ip.io/ru/domain-list-by-ip/aih.life/,https://0nprint.com/,0nprint.com,false,42,58,2026-09-17,2026-09-17',
    'https://www.yellowpages.ae/company/onprint-printing-press-dubai,https://www.0nprint.com/,ONPRINT Printing Press Dubai,false,68,2,2026-01-15,2026-03-01',
  ].join('\n')

  const parsed = backlinkAuditService.parseBacklinkCsv(semrushCsv, 'semrush_test.csv')
  assert.equal(parsed.detectedFormat, 'semrush_backlink_export')
  assert.equal(parsed.validRows.length, 3)

  const deduped = backlinkAuditService.deduplicateAndClassifyBacklinks(parsed.validRows)
  assert.equal(deduped.duplicatesRemoved, 1)
  assert.equal(deduped.items.length, 2)
})

test('8. Validates Google Disavow file format and blocks disavowing 0nprint.com or legitimate domains', () => {
  const { items } = backlinkAuditService.buildInitialAuditDataset()

  // Candidate draft for 2ip.io should pass validation
  const draft = backlinkAuditService.generateDisavowFile(items, {
    onlyApproved: false,
    includeCandidatePreview: true,
  })
  assert.equal(draft.validation.valid, true)
  assert.ok(draft.content.includes('domain:2ip.io'))

  // Attempting to disavow own domain or legitimate domain must fail validation
  const unsafeDisavow = `# Unsafe test\ndomain:0nprint.com\ndomain:dubaichambers.com\n*.badwildcard.com`
  const unsafeCheck = backlinkAuditService.validateDisavowContent(unsafeDisavow, items)
  assert.equal(unsafeCheck.valid, false)
  assert.ok(unsafeCheck.errors.length >= 3)
})
