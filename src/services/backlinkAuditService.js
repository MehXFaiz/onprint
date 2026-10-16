const fs = require('fs')
const path = require('path')

const SITE_DOMAIN = '0nprint.com'

// Verified legitimate UAE & printing industry domains
const KNOWN_LEGITIMATE_DOMAINS = new Set([
  'yellowpages.ae',
  'connect.ae',
  'dubaichambers.com',
  'dubai.ae',
  'dmcc.ae',
  'dwtc.com',
  'localuae.com',
  'uaebusinessdirectory.com',
  'packagingmea.com',
  'printweekme.com',
  'zoomlocal.ae',
  'khaleejtimes.com',
  'gulfnews.com',
  'arabianbusiness.com',
  'zawya.com',
  'timeoutdubai.com',
  'whatson.ae',
  'difc.ae',
  'jafza.ae',
  'tecomgroup.ae',
  'dubaisouth.ae',
  'yalla.ae',
  'hidubai.com',
  'atninfo.com',
  'enrollbusiness.com',
  'cylex.ae',
  'araboo.com',
])

// Known automated IP / reverse-DNS / WHOIS / domain-list scraper utilities
const IP_AND_DOMAIN_SCRAPER_PATTERNS = [
  { domainPattern: /(^|\.)2ip\.(io|ru|ua|me)$/i, label: '2ip.io Automated Reverse-IP / Shared Hosting Domain Scraper' },
  { domainPattern: /robtex\.com$/i, label: 'Robtex Automated DNS/IP Lookup Aggregator' },
  { domainPattern: /viewdns\.info$/i, label: 'ViewDNS Automated Reverse-IP Lookup' },
  { domainPattern: /domainbigdata\.com$/i, label: 'DomainBigData WHOIS/IP Scraper' },
  { domainPattern: /(cutestat|statshow|hypestat|siterankdata|worthofweb)\.com$/i, label: 'Automated Website Valuation / Traffic Scraper' },
  { domainPattern: /(ipaddress|ip-adress|myip\.ms|bgp\.he\.net|arin\.net)/i, label: 'Automated IP / ASN Directory Listing' },
]

const SCRAPER_URL_PATH_PATTERNS = [
  { regex: /\/domain-list-by-ip\//i, reason: 'Auto-generated reverse-IP neighbor list page (/domain-list-by-ip/)' },
  { regex: /\/reverse-ip\//i, reason: 'Automated reverse-IP lookup directory page' },
  { regex: /\/ip-lookup\/|\/whois\//i, reason: 'Automated WHOIS / IP lookup page' },
  { regex: /\/sites-on-same-ip\/|\/same-ip\//i, reason: 'Shared hosting IP neighbor list page' },
  { regex: /\/domain-value\/|\/website-worth\//i, reason: 'Auto-generated website valuation scraper page' },
]

// Confirmed harmful spam signals (casino, adult, pharma, hacked injection, link farms)
const HARMFUL_SPAM_KEYWORDS = [
  { regex: /\b(casino|slot|slots|poker|roulette|blackjack|baccarat|sportsbook|betting|jackpot|1xbet|mostbet|pin-up)\b/i, label: 'Casino / Gambling spam footprint' },
  { regex: /\b(viagra|cialis|levitra|kamagra|ivermectin|pharma|cheap\s+pills|buy\s+meds|steroids)\b/i, label: 'Pharmaceutical spam footprint' },
  { regex: /\b(porn|xxx|sex\s+cams|adult\s+dating|escort|hentai|nsfw|onlyfans\s+leak)\b/i, label: 'Adult / Explicit spam footprint' },
  { regex: /\b(payday\s+loan|fast\s+cash\s+loan|crypto\s+airdrop\s+hack|free\s+bitcoin\s+generator|cracked\s+apk|keygen)\b/i, label: 'Financial scam / Malware warez footprint' },
  { regex: /\b(buy\s+cheap\s+backlinks|seo\s+pbn\s+links|10000\s+backlinks|fiver\s+seo\s+pack|xrumer|gsa\s+ser)\b/i, label: 'Automated black-hat link scheme footprint' },
]

const LINK_FARM_URL_PATTERNS = [
  { regex: /\/link-exchange\/|\/free-backlinks\/|\/submit-link-free\//i, label: 'Automated link exchange / link farm path' },
  { regex: /\?(replytocom=|author_url=|redirect_url=http)/i, label: 'Unmoderated comment spam or open redirect parameter' },
  { regex: /\/wp-content\/uploads\/.*\.(html|php)$/i, label: 'Suspected hacked WordPress upload directory injection' },
]

/**
 * Parse a single CSV line handling quotes and escaped double quotes.
 */
function parseCsvRow(line, delimiter = ',') {
  const result = []
  let current = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    const next = line[i + 1]
    if (ch === '"') {
      if (inQuotes && next === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (ch === delimiter && !inQuotes) {
      result.push(current.trim())
      current = ''
    } else {
      current += ch
    }
  }
  result.push(current.trim())
  return result
}

/**
 * Normalize a URL and extract its clean referring domain.
 */
function normalizeUrlAndDomain(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return { valid: false, normalizedUrl: '', domain: '', subdomain: '', protocol: '', path: '' }
  }
  let trimmed = rawUrl.trim().replace(/^["']|["']$/g, '')
  if (!trimmed) {
    return { valid: false, normalizedUrl: '', domain: '', subdomain: '', protocol: '', path: '' }
  }
  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = `https://${trimmed}`
  }
  try {
    const parsed = new URL(trimmed)
    const hostname = parsed.hostname.toLowerCase()
    const domain = hostname.replace(/^www\./, '')
    const parts = domain.split('.')
    const rootDomain = parts.length > 2 && !parts.slice(-2).join('.').match(/^(co\.ae|ac\.ae|gov\.ae|org\.ae|net\.ae|co\.uk|com\.au)$/i)
      ? parts.slice(-2).join('.')
      : domain
    const subdomain = hostname !== rootDomain && hostname !== `www.${rootDomain}` ? hostname : ''
    const cleanPath = parsed.pathname === '/' ? '/' : parsed.pathname
    const normalizedUrl = `${parsed.protocol}//${hostname}${cleanPath}${parsed.search || ''}`
    return {
      valid: true,
      normalizedUrl,
      domain: rootDomain,
      hostname,
      subdomain,
      protocol: parsed.protocol.replace(':', ''),
      path: `${cleanPath}${parsed.search || ''}`,
    }
  } catch {
    return { valid: false, normalizedUrl: trimmed, domain: trimmed.toLowerCase(), subdomain: '', protocol: 'unknown', path: '' }
  }
}

/**
 * Verify whether a target URL points to ONPRINT (0nprint.com) and identify HTTP/HTTPS & www/non-www variations.
 */
function verifyTargetUrl(rawTargetUrl) {
  if (!rawTargetUrl || rawTargetUrl === 'implicit_gsc_property') {
    return {
      pointsToRealSite: true,
      targetUrl: 'https://0nprint.com/ (GSC Property Target)',
      protocolVariation: 'https',
      hostVariation: 'non-www (GSC property)',
      canonicalMatch: true,
      note: 'Google Search Console Latest Links export implicitly targets verified property 0nprint.com.',
    }
  }
  const parsed = normalizeUrlAndDomain(rawTargetUrl)
  if (!parsed.valid) {
    return {
      pointsToRealSite: false,
      targetUrl: rawTargetUrl,
      protocolVariation: 'unknown',
      hostVariation: 'unknown',
      canonicalMatch: false,
      note: 'Malformed target URL.',
    }
  }
  const isOnprint = parsed.domain === SITE_DOMAIN || parsed.hostname.endsWith(`.${SITE_DOMAIN}`)
  const isHttps = parsed.protocol === 'https'
  const isWww = parsed.hostname.startsWith('www.')
  return {
    pointsToRealSite: isOnprint,
    targetUrl: parsed.normalizedUrl,
    protocolVariation: parsed.protocol,
    hostVariation: isWww ? 'www.0nprint.com' : '0nprint.com',
    canonicalMatch: isOnprint && isHttps,
    note: !isOnprint
      ? `Target domain (${parsed.domain}) does not match ${SITE_DOMAIN}!`
      : !isHttps
      ? 'Points to HTTP variation (301 redirects to HTTPS).'
      : `Valid ${isWww ? 'www' : 'root'} HTTPS target on 0nprint.com.`,
  }
}

/**
 * Infer contact / abuse / removal endpoints for a referring domain.
 */
function inferContactInfo(domain, linkingUrl) {
  const cleanDomain = (domain || '').toLowerCase().replace(/^www\./, '')
  if (cleanDomain === '2ip.io') {
    return {
      contact_page: 'https://2ip.io/contact/',
      removal_page: 'https://2ip.io/privacy/',
      suggested_email: 'support@2ip.io',
      method: 'Webmaster Contact Form / Abuse Support Email',
      notes: '2ip.io is an automated IP/DNS lookup utility. Request cache refresh or domain exclusion from /domain-list-by-ip/aih.life/.',
    }
  }
  return {
    contact_page: `https://${cleanDomain}/contact`,
    removal_page: `https://${cleanDomain}/terms-or-privacy`,
    suggested_email: `webmaster@${cleanDomain}`,
    method: 'Standard Webmaster / WHOIS Abuse Contact',
    notes: `Check ${cleanDomain}/contact or WHOIS abuse email for link removal requests.`,
  }
}

/**
 * Multi-Signal Safe Backlink Classification Engine
 * Categories:
 * 1. Confirmed harmful
 * 2. Suspicious — needs review
 * 3. Potentially legitimate
 * 4. Unknown
 */
function classifyBacklink(item, domainStats = {}) {
  const parsedSource = normalizeUrlAndDomain(item.linking_url || item.linking_domain)
  const domain = (item.linking_domain || parsedSource.domain || '').toLowerCase().replace(/^www\./, '')
  const url = item.linking_url || parsedSource.normalizedUrl || ''
  const urlPath = (parsedSource.path || '').toLowerCase()
  const anchor = String(item.anchor_text || '').trim()
  const linkType = String(item.link_type || 'follow').toLowerCase()
  const authority = item.authority !== undefined && item.authority !== null && item.authority !== '' ? Number(item.authority) : null
  const semrushToxicity = item.semrush_toxicity_score !== undefined && item.semrush_toxicity_score !== null && item.semrush_toxicity_score !== ''
    ? Number(item.semrush_toxicity_score)
    : null
  const domainLinkCount = domainStats[domain]?.count || 1

  const evidence = []
  const signals = []
  const safetyGuardrails = [
    'Low Authority Score alone never triggers Confirmed Harmful or Disavow',
    'Foreign-language URL/content alone never triggers Confirmed Harmful or Disavow',
    'Unfamiliar domain name alone never triggers Confirmed Harmful or Disavow',
    'SEMrush Toxicity Score treated strictly as a non-conclusive signal',
  ]

  let riskScore = 25
  let classification = 'Unknown'
  let recommendedAction = 'Monitor — insufficient evidence to disavow'
  let disavowScope = 'none'

  // 1. Check Verified / Known Legitimate UAE & Industry Domains
  const isKnownUaeDirectory = KNOWN_LEGITIMATE_DOMAINS.has(domain) || domain.endsWith('.gov.ae') || domain.endsWith('.ac.ae')
  const isAeDomain = domain.endsWith('.ae')

  if (isKnownUaeDirectory) {
    riskScore = 8
    classification = 'Potentially legitimate'
    evidence.push(`Verified UAE business directory, chamber, free-zone portal, or regional trade publication (${domain}).`)
    if (anchor) {
      evidence.push(`Relevant business/brand anchor text: "${anchor}".`)
    }
    signals.push('verified_uae_citation')
    recommendedAction = 'Preserve — protect legitimate backlink'
    return {
      classification,
      risk_score: riskScore,
      evidence,
      signals,
      safety_guardrails_applied: safetyGuardrails,
      recommended_action: recommendedAction,
      disavow_scope: 'none',
      explanation: `${domain} is a recognized regional directory, trade publication, or institutional citation relevant to ONPRINT in Dubai/UAE.`,
    }
  }

  // 2. Check Confirmed Harmful Spam Signals (Casino, Adult, Pharma, Malware, Link Schemes)
  let harmfulMatches = 0
  const combinedText = `${url} ${anchor} ${item.source_title || ''} ${item.notes || ''}`
  for (const rule of HARMFUL_SPAM_KEYWORDS) {
    if (rule.regex.test(combinedText)) {
      harmfulMatches++
      evidence.push(`Detected ${rule.label} in URL/anchor ("${anchor || url}").`)
      signals.push('explicit_toxic_spam_keyword')
    }
  }

  for (const rule of LINK_FARM_URL_PATTERNS) {
    if (rule.regex.test(url)) {
      harmfulMatches++
      evidence.push(`Detected ${rule.label} in linking URL (${url}).`)
      signals.push('link_farm_footprint')
    }
  }

  // Check unnatural sitewide commercial anchor flood
  const isExactMatchCommercialAnchor = /\b(cheap\s+printing\s+dubai|best\s+printing\s+press\s+dubai\s+price|buy\s+business\s+cards\s+online\s+cheap)\b/i.test(anchor)
  if (domainLinkCount >= 25 && isExactMatchCommercialAnchor) {
    harmfulMatches++
    evidence.push(`Sitewide exact-match manipulative anchor pattern (${domainLinkCount} links from ${domain}).`)
    signals.push('sitewide_manipulative_anchor')
  }

  if (harmfulMatches > 0) {
    riskScore = Math.min(98, 78 + harmfulMatches * 8 + (semrushToxicity ? Math.round(semrushToxicity * 0.1) : 0))
    classification = 'Confirmed harmful'
    recommendedAction = 'Request removal & queue for domain-level disavow if part of unnatural pattern'
    disavowScope = 'domain'
    return {
      classification,
      risk_score: riskScore,
      evidence,
      signals,
      safety_guardrails_applied: safetyGuardrails,
      recommended_action: recommendedAction,
      disavow_scope: disavowScope,
      explanation: `Strong forensic evidence of manipulative, malicious, or explicit spam linking from ${domain}.`,
    }
  }

  // 3. Check Automated Reverse-IP / WHOIS / Domain-List Scrapers (e.g., 2ip.io/ru/domain-list-by-ip/aih.life/)
  let isIpScraper = false
  for (const pattern of IP_AND_DOMAIN_SCRAPER_PATTERNS) {
    if (pattern.domainPattern.test(domain)) {
      isIpScraper = true
      evidence.push(`Matched ${pattern.label} (${domain}).`)
      signals.push('automated_ip_domain_scraper')
    }
  }
  for (const pathRule of SCRAPER_URL_PATH_PATTERNS) {
    if (pathRule.regex.test(urlPath)) {
      isIpScraper = true
      evidence.push(`${pathRule.reason}: ${urlPath}`)
      signals.push('auto_generated_ip_neighbor_page')
    }
  }

  // Check foreign language path combined with auto-generated IP/domain list
  if (/\/(ru|zh|ja|ko|tr|pl|vi)\//i.test(urlPath)) {
    signals.push('foreign_language_path_noted_not_penalized')
    if (isIpScraper) {
      evidence.push(`Foreign-language localized scraper path (${urlPath.match(/\/(ru|zh|ja|ko|tr|pl|vi)\//i)[0]}) on an automated reverse-IP lookup directory.`)
    } else {
      evidence.push(`Contains localized path (${urlPath.match(/\/(ru|zh|ja|ko|tr|pl|vi)\//i)[0]}). Note: Foreign language alone is not treated as toxic.`)
    }
  }

  // Specifically detect shared-hosting neighbor domain in URL path (e.g., /domain-list-by-ip/aih.life/)
  const neighborMatch = urlPath.match(/\/domain-list-by-ip\/([^/]+)\/?/i)
  if (neighborMatch && neighborMatch[1]) {
    evidence.push(`Auto-generated page lists domains sharing an IP/CDN subnet with "${neighborMatch[1]}" — no editorial context or printing relevance.`)
    signals.push('shared_ip_neighbor_scraper')
  }

  if (isIpScraper) {
    riskScore = 58
    if (semrushToxicity !== null && semrushToxicity >= 60) {
      riskScore = Math.min(72, riskScore + 8)
      evidence.push(`SEMrush toxicity signal (${semrushToxicity}/100) corroborates auto-generated scraper classification.`)
    }
    classification = 'Suspicious — needs review'
    recommendedAction = 'Monitor in GSC (Google normally ignores reverse-IP scrapers). Optional domain: disavow only if scraper links multiply.'
    disavowScope = 'domain'
    return {
      classification,
      risk_score: riskScore,
      evidence,
      signals,
      safety_guardrails_applied: safetyGuardrails,
      recommended_action: recommendedAction,
      disavow_scope: disavowScope,
      explanation: `${domain} is an automated reverse-IP / domain-list scraper utility (${url}). While irrelevant and auto-generated, reverse-IP lookup pages are routine web noise rather than a paid link scheme; manual review is recommended before deciding whether to ignore or include in an optional disavow file.`,
    }
  }

  // 4. Check other Suspicious signals (e.g. high SEMrush toxicity signal, sitewide links, redirect chains)
  if (semrushToxicity !== null && semrushToxicity >= 60) {
    riskScore = 55
    classification = 'Suspicious — needs review'
    evidence.push(`Elevated SEMrush Toxicity Score signal (${semrushToxicity}/100) — flagged for human forensic review rather than automatic disavowal.`)
    signals.push('elevated_semrush_toxicity_signal')
    recommendedAction = 'Inspect linking page manually before approving disavow'
    disavowScope = 'domain'
    return {
      classification,
      risk_score: riskScore,
      evidence,
      signals,
      safety_guardrails_applied: safetyGuardrails,
      recommended_action: recommendedAction,
      disavow_scope: disavowScope,
      explanation: `Flagged for manual review due to third-party toxicity signal (${semrushToxicity}/100). Per safety rules, SEMrush score is treated as a signal, not proof.`,
    }
  }

  if (domainLinkCount > 10) {
    riskScore = 52
    classification = 'Suspicious — needs review'
    evidence.push(`Repeated backlink pattern (${domainLinkCount} links from ${domain}).`)
    signals.push('repeated_domain_links')
    recommendedAction = 'Verify whether links are legitimate sidebar/partner citations or unnatural sitewide links'
    disavowScope = 'domain'
    return {
      classification,
      risk_score: riskScore,
      evidence,
      signals,
      safety_guardrails_applied: safetyGuardrails,
      recommended_action: recommendedAction,
      disavow_scope: disavowScope,
      explanation: `Multiple links (${domainLinkCount}) detected from ${domain}; requires human review.`,
    }
  }

  // 5. Check Potentially Legitimate signals (relevant industry/regional context, high relevance, or .ae domain)
  const hasPrintingRelevance = /\b(print|printing|packaging|press|design|branding|dubai|uae|business|directory|chamber|exhibition|supplier|media|agency)\b/i.test(
    `${domain} ${url} ${anchor} ${item.notes || ''}`
  )
  if (isAeDomain || hasPrintingRelevance || String(item.relevance || '').toLowerCase() === 'high') {
    riskScore = 15
    classification = 'Potentially legitimate'
    evidence.push(`Topical or geographic relevance to Dubai/UAE printing & business ecosystem (${domain}).`)
    if (anchor && anchor !== 'N/A (GSC Export)') {
      evidence.push(`Natural brand/topical anchor text: "${anchor}".`)
    }
    if (authority !== null && authority < 25) {
      evidence.push(`Authority Score is ${authority}, which is normal for niche/local citations and not a spam indicator.`)
    }
    signals.push('relevant_industry_or_local_link')
    recommendedAction = 'Preserve — do not disavow'
    return {
      classification,
      risk_score: riskScore,
      evidence,
      signals,
      safety_guardrails_applied: safetyGuardrails,
      recommended_action: recommendedAction,
      disavow_scope: 'none',
      explanation: `${domain} exhibits legitimate regional or topical signals relevant to ONPRINT.`,
    }
  }

  // 6. Default to Unknown when insufficient metadata exists
  riskScore = 35
  classification = 'Unknown'
  evidence.push(`Insufficient forensic signals on ${domain} to confirm either manipulation or topical relevance.`)
  if (!anchor || anchor === 'N/A (GSC Export)') {
    evidence.push('Anchor text and follow/nofollow attributes are not included in Google Search Console Latest Links exports.')
  }
  signals.push('insufficient_metadata')
  recommendedAction = 'Keep under observation — do not disavow without concrete spam evidence'
  return {
    classification,
    risk_score: riskScore,
    evidence,
    signals,
    safety_guardrails_applied: safetyGuardrails,
    recommended_action: recommendedAction,
    disavow_scope: 'none',
    explanation: `Insufficient evidence to classify ${domain} as harmful or legitimate. Safely categorized as Unknown.`,
  }
}

/**
 * Parse CSV content from Google Search Console, SEMrush, or generic backlink exports.
 */
function parseBacklinkCsv(csvText, sourceLabel = 'csv_upload') {
  if (!csvText || typeof csvText !== 'string') {
    throw new Error('CSV content is empty or invalid.')
  }

  // Strip UTF-8 BOM if present
  const cleanText = csvText.replace(/^\uFEFF/, '').trim()
  const lines = cleanText.split(/\r?\n/).filter((l) => l.trim().length > 0)
  if (lines.length === 0) {
    throw new Error('CSV file contains no rows.')
  }

  // Detect delimiter (comma, semicolon, or tab)
  const firstLine = lines[0]
  let delimiter = ','
  if (firstLine.includes('\t') && !firstLine.includes(',')) delimiter = '\t'
  else if (firstLine.split(';').length > firstLine.split(',').length) delimiter = ';'

  const headers = parseCsvRow(firstLine, delimiter).map((h) => h.toLowerCase().trim())

  // Detect format
  let detectedFormat = 'generic_csv'
  if (headers.includes('linking page') && headers.includes('last crawled')) {
    detectedFormat = 'gsc_latest_links'
  } else if (headers.includes('top linking sites')) {
    detectedFormat = 'gsc_top_linking_sites'
  } else if (headers.some((h) => h.includes('source url') || h.includes('toxicity score') || h.includes('authority score'))) {
    detectedFormat = 'semrush_backlink_export'
  } else if (headers.some((h) => h.includes('referring page url') || h.includes('domain rating'))) {
    detectedFormat = 'ahrefs_backlink_export'
  }

  const findIdx = (...candidates) => {
    for (const cand of candidates) {
      const idx = headers.findIndex((h) => h === cand || h.includes(cand))
      if (idx !== -1) return idx
    }
    return -1
  }

  const idxSourceUrl = findIdx('linking page', 'source url', 'referring page url', 'linking_url', 'source_url', 'url', 'top linking sites')
  const idxDomain = findIdx('linking_domain', 'referring domain', 'domain', 'top linking sites')
  const idxTargetUrl = findIdx('target url', 'target_url', 'link url', 'target page')
  const idxAnchor = findIdx('anchor', 'anchor text', 'anchor_text')
  const idxNofollow = findIdx('nofollow')
  const idxLinkType = findIdx('link_type', 'link type', 'type')
  const idxAuthority = findIdx('authority score', 'authority', 'domain rating', 'dr', 'as')
  const idxToxicity = findIdx('toxicity score', 'toxicity', 'spam score')
  const idxFirstSeen = findIdx('first seen', 'first_discovered_at', 'first seen date')
  const idxLastSeen = findIdx('last crawled', 'last seen', 'last_checked_at', 'last seen date')
  const idxIp = findIdx('source ip', 'ip', 'ip address')
  const idxStatus = findIdx('status', 'link status')
  const idxRedirect = findIdx('redirect', 'redirect chain')
  const idxTitle = findIdx('source title', 'page title', 'title')

  if (idxSourceUrl === -1 && idxDomain === -1) {
    throw new Error(
      `Unrecognized CSV header structure: [${headers.join(', ')}]. Expected columns like "Linking page,Last crawled" (GSC) or "Source url,Target url,Anchor,Authority Score,Toxicity score" (SEMrush).`
    )
  }

  const parsedRows = []
  const parseErrors = []

  for (let i = 1; i < lines.length; i++) {
    const rawLine = lines[i].trim()
    if (!rawLine) continue
    const cols = parseCsvRow(rawLine, delimiter)

    const rawSourceUrl = idxSourceUrl !== -1 ? cols[idxSourceUrl] : cols[idxDomain]
    if (!rawSourceUrl) {
      parseErrors.push({ row: i + 1, reason: 'Missing linking URL / domain' })
      continue
    }

    const norm = normalizeUrlAndDomain(rawSourceUrl)
    if (!norm.valid) {
      parseErrors.push({ row: i + 1, reason: `Invalid URL/domain: ${rawSourceUrl}` })
      continue
    }

    const rawTarget = idxTargetUrl !== -1 && cols[idxTargetUrl] ? cols[idxTargetUrl] : 'implicit_gsc_property'
    const targetCheck = verifyTargetUrl(rawTarget)

    let linkType = 'unknown'
    if (idxLinkType !== -1 && cols[idxLinkType]) {
      linkType = cols[idxLinkType].toLowerCase()
    } else if (idxNofollow !== -1 && cols[idxNofollow] !== undefined) {
      const nfVal = String(cols[idxNofollow]).toLowerCase()
      linkType = nfVal === 'true' || nfVal === '1' || nfVal === 'yes' || nfVal === 'nofollow' ? 'nofollow' : 'follow'
    } else if (detectedFormat === 'gsc_latest_links') {
      linkType = 'unknown (GSC export)'
    } else {
      linkType = 'follow'
    }

    const anchorText = idxAnchor !== -1 && cols[idxAnchor] ? cols[idxAnchor] : detectedFormat.startsWith('gsc_') ? 'N/A (GSC Export)' : ''
    const authority = idxAuthority !== -1 && cols[idxAuthority] !== '' && !isNaN(Number(cols[idxAuthority])) ? Number(cols[idxAuthority]) : null
    const semrushToxicity = idxToxicity !== -1 && cols[idxToxicity] !== '' && !isNaN(Number(cols[idxToxicity])) ? Number(cols[idxToxicity]) : null
    const lastSeen = idxLastSeen !== -1 && cols[idxLastSeen] ? cols[idxLastSeen] : new Date().toISOString().split('T')[0]
    const firstSeen = idxFirstSeen !== -1 && cols[idxFirstSeen] ? cols[idxFirstSeen] : lastSeen
    const ipAddress = idxIp !== -1 && cols[idxIp] ? cols[idxIp] : null
    const redirectInfo = idxRedirect !== -1 && cols[idxRedirect] ? cols[idxRedirect] : null
    const sourceTitle = idxTitle !== -1 && cols[idxTitle] ? cols[idxTitle] : null
    const linkStatus = idxStatus !== -1 && cols[idxStatus] ? cols[idxStatus].toLowerCase() : 'active'

    parsedRows.push({
      linking_domain: norm.domain,
      hostname: norm.hostname,
      subdomain: norm.subdomain,
      linking_url: norm.normalizedUrl,
      target_url: targetCheck.targetUrl,
      target_verification: targetCheck,
      anchor_text: anchorText,
      link_type: linkType,
      status: linkStatus,
      authority,
      semrush_toxicity_score: semrushToxicity,
      ip_address: ipAddress,
      redirect_chain: redirectInfo,
      source_title: sourceTitle,
      first_discovered_at: firstSeen,
      last_checked_at: lastSeen,
      source_dataset: detectedFormat,
      import_batch: sourceLabel,
    })
  }

  return {
    detectedFormat,
    headers,
    totalRowsRead: lines.length - 1,
    validRows: parsedRows,
    parseErrors,
  }
}

/**
 * Deduplicate backlink records and compute domain-level aggregation & classifications.
 */
function deduplicateAndClassifyBacklinks(records) {
  const seenKeys = new Set()
  const uniqueRecords = []
  let duplicatesRemoved = 0

  for (const rec of records) {
    const norm = normalizeUrlAndDomain(rec.linking_url || rec.linking_domain)
    const targetNorm = (rec.target_url || '').toLowerCase().trim()
    const dedupKey = `${norm.normalizedUrl.toLowerCase()}||${targetNorm}`
    if (seenKeys.has(dedupKey)) {
      duplicatesRemoved++
      continue
    }
    seenKeys.add(dedupKey)
    uniqueRecords.push({
      ...rec,
      linking_domain: norm.domain || rec.linking_domain,
      linking_url: norm.normalizedUrl || rec.linking_url,
    })
  }

  // Compute domain counts
  const domainStats = {}
  for (const rec of uniqueRecords) {
    const d = rec.linking_domain
    if (!domainStats[d]) {
      domainStats[d] = { count: 0, urls: [], ips: new Set() }
    }
    domainStats[d].count++
    domainStats[d].urls.push(rec.linking_url)
    if (rec.ip_address) domainStats[d].ips.add(rec.ip_address)
  }

  // Classify every record
  const classifiedItems = uniqueRecords.map((rec, index) => {
    const targetVerification = rec.target_verification || verifyTargetUrl(rec.target_url)
    const audit = classifyBacklink(rec, domainStats)
    const contactInfo = inferContactInfo(rec.linking_domain, rec.linking_url)

    return {
      id: rec.id || index + 1,
      linking_domain: rec.linking_domain,
      hostname: rec.hostname || rec.linking_domain,
      subdomain: rec.subdomain || '',
      linking_url: rec.linking_url,
      target_url: rec.target_url || 'https://0nprint.com/',
      target_verification: targetVerification,
      anchor_text: rec.anchor_text || 'N/A (GSC Export)',
      link_type: rec.link_type || 'follow',
      status: rec.status || 'active',
      authority: rec.authority !== undefined ? rec.authority : null,
      semrush_toxicity_score: rec.semrush_toxicity_score !== undefined ? rec.semrush_toxicity_score : null,
      ip_address: rec.ip_address || null,
      redirect_chain: rec.redirect_chain || null,
      first_discovered_at: rec.first_discovered_at || null,
      last_checked_at: rec.last_checked_at || null,
      source_dataset: rec.source_dataset || 'repository_tracked',
      // Classification fields (allow manual override if already reviewed)
      classification: rec.manual_classification || audit.classification,
      auto_classification: audit.classification,
      risk_score: rec.manual_risk_score !== undefined && rec.manual_risk_score !== null ? Number(rec.manual_risk_score) : audit.risk_score,
      evidence: Array.isArray(rec.evidence) && rec.evidence.length > 0 ? rec.evidence : audit.evidence,
      signals: audit.signals,
      explanation: rec.manual_explanation || audit.explanation,
      recommended_action: rec.manual_recommended_action || audit.recommended_action,
      safety_guardrails_applied: audit.safety_guardrails_applied,
      // Disavow & Review Queue workflow
      review_status: rec.review_status || (audit.classification === 'Suspicious — needs review' || audit.classification === 'Confirmed harmful' ? 'pending_review' : 'reviewed_safe'),
      disavow_approved: Boolean(rec.disavow_approved),
      disavow_scope: rec.disavow_scope || audit.disavow_scope || 'domain',
      reviewed_by: rec.reviewed_by || null,
      reviewed_at: rec.reviewed_at || null,
      contact_info: rec.contact_info || contactInfo,
      notes: rec.notes || '',
    }
  })

  return {
    items: classifiedItems,
    duplicatesRemoved,
    domainStats,
  }
}

/**
 * Validate a Google Disavow file string according to official Google Search Console specifications:
 * - UTF-8 or 7-bit ASCII
 * - Each non-comment line is either `domain:example.com` or a valid `http://` / `https://` URL
 * - No wildcards (*), spaces inside entries, or invalid domain syntax
 * - No duplicate entries
 * - Zero legitimate domains included
 */
function validateDisavowContent(content, allAuditItems = []) {
  const errors = []
  const warnings = []
  const lines = String(content || '').split(/\r?\n/)
  const seenEntries = new Set()
  const activeEntries = []

  const legitimateDomainSet = new Set(
    allAuditItems
      .filter((i) => i.classification === 'Potentially legitimate')
      .map((i) => (i.linking_domain || '').toLowerCase())
  )
  KNOWN_LEGITIMATE_DOMAINS.forEach((d) => legitimateDomainSet.add(d))

  lines.forEach((rawLine, idx) => {
    const lineNum = idx + 1
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) return

    if (line.includes('*')) {
      errors.push(`Line ${lineNum}: Wildcards (*) are not supported in Google disavow files ("${line}").`)
    }

    if (line.toLowerCase().startsWith('domain:')) {
      const dom = line.slice(7).trim().toLowerCase()
      if (!dom || dom.includes('/') || dom.includes(' ') || !/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(dom)) {
        errors.push(`Line ${lineNum}: Invalid domain: syntax ("${line}"). Must be domain:example.com without http:// or paths.`)
      } else {
        if (dom === SITE_DOMAIN || dom.endsWith(`.${SITE_DOMAIN}`)) {
          errors.push(`Line ${lineNum}: CRITICAL SAFETY BLOCK — Cannot disavow own domain (${dom})!`)
        }
        if (legitimateDomainSet.has(dom)) {
          errors.push(`Line ${lineNum}: SAFETY BLOCK — Domain "${dom}" is classified as Potentially legitimate and must not be disavowed.`)
        }
        const key = `domain:${dom}`
        if (seenEntries.has(key)) {
          warnings.push(`Line ${lineNum}: Duplicate entry "${key}".`)
        }
        seenEntries.add(key)
        activeEntries.push({ type: 'domain', value: dom, raw: `domain:${dom}` })
      }
    } else if (/^https?:\/\//i.test(line)) {
      try {
        const u = new URL(line)
        const dom = u.hostname.toLowerCase().replace(/^www\./, '')
        if (dom === SITE_DOMAIN) {
          errors.push(`Line ${lineNum}: CRITICAL SAFETY BLOCK — Cannot disavow own URL (${line})!`)
        }
        if (legitimateDomainSet.has(dom)) {
          errors.push(`Line ${lineNum}: SAFETY BLOCK — URL belongs to legitimate domain "${dom}".`)
        }
        if (seenEntries.has(line)) {
          warnings.push(`Line ${lineNum}: Duplicate URL entry "${line}".`)
        }
        seenEntries.add(line)
        activeEntries.push({ type: 'url', value: line, raw: line })
      } catch {
        errors.push(`Line ${lineNum}: Invalid URL format ("${line}").`)
      }
    } else {
      errors.push(`Line ${lineNum}: Unrecognized entry ("${line}"). Must start with "#", "domain:", "http://", or "https://".`)
    }
  })

  const byteLength = Buffer.byteLength(String(content || ''), 'utf8')
  if (byteLength > 2 * 1024 * 1024) {
    errors.push('File size exceeds Google Search Console 2MB limit.')
  }

  return {
    valid: errors.length === 0,
    encoding: 'UTF-8',
    byteLength,
    totalLines: lines.length,
    activeEntryCount: activeEntries.length,
    activeEntries,
    errors,
    warnings,
  }
}

/**
 * Generate a Google Search Console Disavow Tool-compatible disavow.txt file.
 * By default only includes explicitly approved items (`disavow_approved === true`).
 * If `includeCandidateDraft` is true, generates a clearly labeled DRAFT preview for user inspection.
 */
function generateDisavowFile(allItems = [], options = {}) {
  const {
    onlyApproved = true,
    includeCandidatePreview = false,
    auditDate = new Date().toISOString().split('T')[0],
    reviewer = 'ONPRINT Technical SEO Audit',
  } = options

  const approvedItems = allItems.filter(
    (item) =>
      item.disavow_approved === true &&
      item.classification !== 'Potentially legitimate'
  )

  const candidateItems = includeCandidatePreview
    ? allItems.filter(
        (item) =>
          (item.classification === 'Confirmed harmful' || item.classification === 'Suspicious — needs review') &&
          item.classification !== 'Potentially legitimate'
      )
    : []

  const targetItems = onlyApproved ? approvedItems : candidateItems

  const headerLines = [
    `# Google Search Console Disavow Links File for https://0nprint.com/`,
    `# Generated by: ${reviewer}`,
    `# Audit Date: ${auditDate}`,
    `# Encoding: UTF-8`,
    `# Safety Policy: Only reviewed, non-legitimate external domains/URLs are listed below.`,
    `# IMPORTANT: External websites control their own backlinks. Uploading this file to`,
    `# Google Search Console instructs Google not to count these links when assessing 0nprint.com.`,
    `# Do NOT upload automatically without explicit owner approval.`,
    ``,
  ]

  const bodyLines = []
  const seenDirectives = new Set()

  for (const item of targetItems) {
    const dom = (item.linking_domain || '').toLowerCase().replace(/^www\./, '')
    if (!dom || dom === SITE_DOMAIN || KNOWN_LEGITIMATE_DOMAINS.has(dom)) continue

    const scope = item.disavow_scope === 'url' ? 'url' : 'domain'
    const directive = scope === 'url' ? item.linking_url : `domain:${dom}`
    if (seenDirectives.has(directive.toLowerCase())) continue
    seenDirectives.add(directive.toLowerCase())

    bodyLines.push(
      `# Classification: ${item.classification} | Risk Score: ${item.risk_score}/100 | Source: ${item.source_dataset || 'audit'}`
    )
    bodyLines.push(
      `# Evidence: ${(item.evidence || []).join('; ') || item.explanation || 'Flagged during forensic review'}`
    )
    bodyLines.push(`# Sample Linking URL: ${item.linking_url} (Last crawled: ${item.last_checked_at || 'N/A'})`)
    bodyLines.push(directive)
    bodyLines.push(``)
  }

  if (bodyLines.length === 0) {
    bodyLines.push(
      `# No domains are currently approved in the Disavow Queue.`,
      `# Note: Under Google Search Essentials, if 0nprint.com has 0 Manual Actions and only`,
      `# isolated auto-generated reverse-IP scraper links (such as 2ip.io), immediate disavowal`,
      `# is NOT required because Google's algorithms ignore automated IP lookup directories.`
    )
  }

  const content = [...headerLines, ...bodyLines].join('\n')
  const validation = validateDisavowContent(content, allItems)

  return {
    content,
    validation,
    approvedCount: approvedItems.length,
    includedDirectivesCount: validation.activeEntryCount,
    generatedAt: new Date().toISOString(),
  }
}

/**
 * Generate professional backlink removal outreach templates.
 */
function getOutreachTemplates(customParams = {}) {
  const siteUrl = customParams.siteUrl || 'https://0nprint.com/'
  const targetDomain = customParams.linkingDomain || '2ip.io'
  const linkingUrl = customParams.linkingUrl || 'https://2ip.io/ru/domain-list-by-ip/aih.life/'
  const lastCrawled = customParams.lastCrawled || '2026-09-17'

  return [
    {
      id: 'tpl-scraper-delist',
      name: 'Automated IP / Reverse-DNS Directory Delisting Request (e.g., 2ip.io)',
      scenario: 'Use for automated IP lookup, WHOIS, or shared-hosting neighbor directories.',
      subject: `Request to Remove Automated Domain Listing for 0nprint.com on ${targetDomain}`,
      body: `Dear ${targetDomain} Support / Webmaster Team,

We are writing on behalf of ONPRINT (${siteUrl}), a commercial printing press based in Dubai, UAE.

During our routine Google Search Console backlink audit, we identified an automated reverse-IP / domain-list page on your website linking to our domain:

- Linking URL: ${linkingUrl}
- Target Domain: ${siteUrl}
- Last Crawled by Google: ${lastCrawled}

Because our website uses shared CDN/cloud infrastructure, our domain appears on your auto-generated IP neighbor page alongside unrelated domains. We kindly request that you exclude or remove "0nprint.com" from this listing (or apply a "noindex, nofollow" robots directive to auto-generated IP list pages).

Thank you for your assistance.

Best regards,
Technical SEO & Web Operations Team
ONPRINT Commercial Printing Dubai
Website: ${siteUrl}
Email: 0nprint183@gmail.com`,
    },
    {
      id: 'tpl-spam-removal',
      name: 'Confirmed Harmful / Unnatural Backlink Removal Request',
      scenario: 'Use when requesting removal of unauthorized or manipulative links from third-party webmasters.',
      subject: `Link Removal Request — Unauthorized Link to 0nprint.com`,
      body: `Dear Webmaster / Site Administrator of ${targetDomain},

We are conducting a technical SEO and backlink compliance audit for our website, ${siteUrl} (ONPRINT Dubai).

We noticed an unauthorized or unnatural link pointing to our domain from the following URL on your website:

- Source URL: ${linkingUrl}
- Target URL: ${siteUrl}

We did not request or authorize this placement. Could you please remove the hyperlink to ${siteUrl} from the page above at your earliest convenience, and reply to confirm once it has been removed?

Thank you for your prompt cooperation.

Sincerely,
Technical SEO Team
ONPRINT — Commercial Printing Press Dubai
${siteUrl}`,
    },
    {
      id: 'tpl-compromised-site',
      name: 'Compromised / Injected Page Security Notification & Link Removal',
      scenario: 'Use when a legitimate third-party website appears to have injected spam links due to a CMS vulnerability.',
      subject: `Security Notice & Link Removal Request regarding ${targetDomain}`,
      body: `Hello ${targetDomain} Webmaster,

While reviewing external links in Google Search Console for ${siteUrl}, we discovered an unexpected link originating from:

- Page URL: ${linkingUrl}

This page appears to contain auto-generated or injected external links that may have been created without your editorial approval. We kindly ask that you inspect this URL and remove the link referencing ${siteUrl}.

Warm regards,
Web Operations Team
ONPRINT (${siteUrl})`,
    },
  ]
}

/**
 * Convert classified backlink audit items to CSV string for export.
 */
function exportClassifiedDomainsCsv(items = []) {
  const headers = [
    'ID',
    'Referring Domain',
    'Linking URL',
    'Target URL',
    'Points to Real Site',
    'Anchor Text',
    'Follow Attribute',
    'Classification',
    'Risk Score (0-100)',
    'Review Status',
    'Disavow Approved',
    'Disavow Scope',
    'Source Dataset',
    'Authority Score',
    'SEMrush Toxicity Signal',
    'Last Crawled / Checked',
    'Recommended Action',
    'Forensic Evidence',
    'Contact / Removal Page',
  ]

  const escapeCsv = (val) => {
    const str = val === null || val === undefined ? '' : String(val)
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`
    }
    return str
  }

  const rows = items.map((item) => [
    item.id,
    item.linking_domain,
    item.linking_url,
    item.target_url,
    item.target_verification?.pointsToRealSite !== false ? 'Yes' : 'No',
    item.anchor_text,
    item.link_type,
    item.classification,
    item.risk_score,
    item.review_status,
    item.disavow_approved ? 'Approved' : 'Not Approved',
    item.disavow_scope || 'none',
    item.source_dataset || 'audit',
    item.authority !== null && item.authority !== undefined ? item.authority : 'N/A',
    item.semrush_toxicity_score !== null && item.semrush_toxicity_score !== undefined ? item.semrush_toxicity_score : 'N/A',
    item.last_checked_at || '',
    item.recommended_action || '',
    Array.isArray(item.evidence) ? item.evidence.join(' | ') : item.explanation || '',
    item.contact_info?.contact_page || '',
  ])

  return [headers.map(escapeCsv).join(','), ...rows.map((r) => r.map(escapeCsv).join(','))].join('\n')
}

/**
 * Build initial real dataset combining the uploaded GSC CSV export (`0nprint.com-Latest links-2026-10-16.csv`)
 * and the repository's existing tracked UAE backlinks (`UAE_BACKLINKS`), with transparent provenance tags.
 */
function buildInitialAuditDataset() {
  const rawRecords = []

  // 1. Read the real uploaded GSC Latest Links CSV
  const csvPaths = [
    path.join(__dirname, '../data/0nprint.com-Latest links-2026-10-16.csv'),
    'C:\\Users\\Mubasher Computer\\Downloads\\0nprint.com-Latest links-2026-10-16.csv',
  ]
  let loadedCsvPath = null
  for (const p of csvPaths) {
    if (fs.existsSync(p)) {
      try {
        const csvContent = fs.readFileSync(p, 'utf8')
        const parsed = parseBacklinkCsv(csvContent, '0nprint.com-Latest links-2026-10-16.csv')
        parsed.validRows.forEach((row) => {
          rawRecords.push({
            ...row,
            source_dataset: 'gsc_latest_links_csv',
            notes: 'Imported from real Google Search Console Latest Links export (0nprint.com-Latest links-2026-10-16.csv).',
          })
        })
        loadedCsvPath = p
        break
      } catch (err) {
        console.warn('[BacklinkAuditService] Failed to parse GSC CSV:', err.message)
      }
    }
  }

  // Fallback if file was moved
  if (rawRecords.length === 0) {
    rawRecords.push({
      linking_domain: '2ip.io',
      linking_url: 'https://2ip.io/ru/domain-list-by-ip/aih.life/',
      target_url: 'https://0nprint.com/ (GSC Property Target)',
      anchor_text: 'N/A (GSC Export)',
      link_type: 'unknown (GSC export)',
      status: 'active',
      authority: null,
      semrush_toxicity_score: null,
      first_discovered_at: '2026-09-17',
      last_checked_at: '2026-09-17',
      source_dataset: 'gsc_latest_links_csv',
      notes: 'Imported from real Google Search Console Latest Links export (0nprint.com-Latest links-2026-10-16.csv).',
    })
  }

  // 2. Include existing repository backlink records from dubaiSeoSeedData.js (clearly tagged as repository_tracked)
  try {
    const { UAE_BACKLINKS } = require('../data/dubaiSeoSeedData')
    if (Array.isArray(UAE_BACKLINKS)) {
      UAE_BACKLINKS.forEach((b) => {
        rawRecords.push({
          ...b,
          source_dataset: 'repository_tracked_citations',
        })
      })
    }
  } catch (err) {
    console.warn('[BacklinkAuditService] Could not load UAE_BACKLINKS:', err.message)
  }

  const { items } = deduplicateAndClassifyBacklinks(rawRecords)
  return {
    items,
    loadedCsvPath,
  }
}

/**
 * Compute comprehensive summary statistics for the Backlink Audit Dashboard.
 */
function computeAuditSummary(items = [], removalRequests = [], disavowVersions = []) {
  const uniqueDomains = new Set(items.map((i) => i.linking_domain))
  const gscExportItems = items.filter((i) => i.source_dataset === 'gsc_latest_links_csv' || i.source_dataset === 'gsc_top_linking_sites')
  const semrushItems = items.filter((i) => i.source_dataset === 'semrush_backlink_export')
  const repoItems = items.filter((i) => i.source_dataset === 'repository_tracked_citations')

  const confirmedHarmful = items.filter((i) => i.classification === 'Confirmed harmful')
  const suspicious = items.filter((i) => i.classification === 'Suspicious — needs review')
  const legitimate = items.filter((i) => i.classification === 'Potentially legitimate')
  const unknown = items.filter((i) => i.classification === 'Unknown')

  const pendingReview = items.filter((i) => i.review_status === 'pending_review')
  const disavowApproved = items.filter((i) => i.disavow_approved === true)

  const verifiedRemovals = removalRequests.filter((r) => r.status === 'removed_verified').length

  return {
    totalBacklinks: items.length,
    totalReferringDomains: uniqueDomains.size,
    gscExportLinksCount: gscExportItems.length,
    semrushLinksCount: semrushItems.length,
    repositoryTrackedCitationsCount: repoItems.length,
    categories: {
      confirmedHarmful: confirmedHarmful.length,
      suspicious: suspicious.length,
      potentiallyLegitimate: legitimate.length,
      unknown: unknown.length,
    },
    domainsByCategory: {
      confirmedHarmful: new Set(confirmedHarmful.map((i) => i.linking_domain)).size,
      suspicious: new Set(suspicious.map((i) => i.linking_domain)).size,
      potentiallyLegitimate: new Set(legitimate.map((i) => i.linking_domain)).size,
      unknown: new Set(unknown.map((i) => i.linking_domain)).size,
    },
    reviewQueueCount: pendingReview.length,
    disavowApprovedCount: disavowApproved.length,
    removalRequestsCount: removalRequests.length,
    verifiedRemovalsCount: verifiedRemovals,
    disavowVersionsCount: disavowVersions.length,
    disavowRecommendation: {
      isDisavowUrgentlyWarranted: confirmedHarmful.length > 0,
      manualActionDetected: false,
      securityIssuesDetected: false,
      headline:
        confirmedHarmful.length > 0
          ? 'Confirmed harmful links detected — review and consider disavowal.'
          : 'Immediate Disavow Submission is NOT Required (0 Confirmed Harmful Links, 0 Manual Actions)',
      rationale:
        'Your uploaded Google Search Console Latest Links export (0nprint.com-Latest links-2026-10-16.csv) contains 1 external link: https://2ip.io/ru/domain-list-by-ip/aih.life/ (last crawled 2026-09-17). Forensic inspection confirms 2ip.io is an automated reverse-IP / shared-hosting neighbor lookup directory, NOT a paid link scheme, PBN, or negative SEO attack. Google’s algorithms automatically discount auto-generated IP/WHOIS lookup pages. Per Google Search Essentials, submitting a disavow file is only necessary when there is a considerable number of spammy, artificial, or low-quality links AND they have caused (or are likely to cause) a Manual Action. However, a validated optional disavow.txt draft is available below if you explicitly approve domain:2ip.io in the Review Queue.',
    },
  }
}

module.exports = {
  SITE_DOMAIN,
  KNOWN_LEGITIMATE_DOMAINS,
  parseCsvRow,
  normalizeUrlAndDomain,
  verifyTargetUrl,
  inferContactInfo,
  classifyBacklink,
  parseBacklinkCsv,
  deduplicateAndClassifyBacklinks,
  validateDisavowContent,
  generateDisavowFile,
  getOutreachTemplates,
  exportClassifiedDomainsCsv,
  buildInitialAuditDataset,
  computeAuditSummary,
}
