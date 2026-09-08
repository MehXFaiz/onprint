const https = require('https')
const { pool } = require('../config/database')
const internalLinkingService = require('./internalLinkingService')

/**
 * Clean text by stripping HTML tags and trimming
 */
function stripHtml(html = '') {
  return String(html || '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Generate clean URL slug
 */
function generateSlug(text = '') {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

/**
 * Calculate Flesch Reading Ease score (0 to 100)
 */
function calculateReadability(text = '') {
  const clean = stripHtml(text)
  if (!clean) return 70

  const words = clean.split(/\s+/).filter(Boolean)
  const sentences = clean.split(/[.!?]+/).filter((s) => s.trim().length > 0)
  const totalWords = Math.max(1, words.length)
  const totalSentences = Math.max(1, sentences.length)

  let syllables = 0
  words.forEach((word) => {
    const w = word.toLowerCase().replace(/[^a-z]/g, '')
    if (w.length <= 3) {
      syllables += 1
    } else {
      const matches = w.match(/[aeiouy]{1,2}/g)
      syllables += matches ? matches.length : 1
    }
  })

  const score = Math.round(206.835 - 1.015 * (totalWords / totalSentences) - 84.6 * (syllables / totalWords))
  return Math.max(10, Math.min(100, score))
}

/**
 * Calculate keyword frequency and density in percentage
 */
function calculateKeywordDensity(content = '', keyword = '') {
  if (!content || !keyword) return 0
  const cleanContent = stripHtml(content).toLowerCase()
  const cleanKeyword = keyword.toLowerCase().trim()
  if (!cleanKeyword) return 0

  const words = cleanContent.split(/\s+/).filter(Boolean)
  if (words.length === 0) return 0

  // Count exact occurrences of multi-word or single-word keyword
  const regex = new RegExp(`\\b${cleanKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi')
  const matches = cleanContent.match(regex) || []
  const keywordWordCount = cleanKeyword.split(/\s+/).filter(Boolean).length

  const density = ((matches.length * keywordWordCount) / words.length) * 100
  return parseFloat(density.toFixed(2))
}

class BlogSeoAiService {
  /**
   * Safe HTTPS POST helper
   */
  _httpsPost(url, data, headers = {}) {
    return new Promise((resolve, reject) => {
      const parsedUrl = new URL(url)
      const payload = JSON.stringify(data)

      const options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || 443,
        path: parsedUrl.pathname + parsedUrl.search,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
          ...headers,
        },
        timeout: 30000,
      }

      const req = https.request(options, (res) => {
        let responseBody = ''
        res.on('data', (chunk) => {
          responseBody += chunk
        })
        res.on('end', () => {
          try {
            if (res.statusCode >= 200 && res.statusCode < 300) {
              resolve(JSON.parse(responseBody))
            } else {
              reject(new Error(`AI HTTP ${res.statusCode}: ${responseBody.slice(0, 250)}`))
            }
          } catch (err) {
            reject(new Error(`Failed to parse AI JSON response: ${err.message}`))
          }
        })
      })

      req.on('error', (err) => reject(err))
      req.on('timeout', () => {
        req.destroy()
        reject(new Error('AI request timed out'))
      })

      req.write(payload)
      req.end()
    })
  }

  /**
   * Get AI Provider configuration from DB or process.env
   */
  async getAiConfig() {
    let apiKey = process.env.AI_API_KEY || process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY || ''
    let provider = process.env.AI_PROVIDER || 'gemini'
    let model = 'gemini-2.5-flash'

    try {
      const [rows] = await pool.query(
        `SELECT setting_key, setting_value FROM seo_settings WHERE setting_key IN ('ai_provider', 'ai_model', 'ai_api_key')`
      )
      rows.forEach((r) => {
        if (r.setting_key === 'ai_provider' && r.setting_value) provider = r.setting_value
        if (r.setting_key === 'ai_model' && r.setting_value) model = r.setting_value
        if (r.setting_key === 'ai_api_key' && r.setting_value) apiKey = r.setting_value
      })
    } catch {}

    return { apiKey, provider, model }
  }

  /**
   * Algorithmic 16-point 0–100 SEO Score Evaluator
   */
  calculateSeoScore(blogData = {}) {
    const {
      title = '',
      content = '',
      meta_title = '',
      seo_title = '',
      meta_description = '',
      focus_keyword = '',
      secondary_keywords = '',
      slug = '',
      canonical_url = '',
      featured_image = '',
      image_alt = '',
      faqs = [],
      robots_index = 'index',
      robots_follow = 'follow',
    } = blogData

    const cleanTitle = (title || '').trim()
    const cleanMetaTitle = (meta_title || seo_title || '').trim()
    const cleanMetaDesc = (meta_description || '').trim()
    const cleanKeyword = (focus_keyword || '').toLowerCase().trim()
    const cleanContent = stripHtml(content)
    const words = cleanContent.split(/\s+/).filter(Boolean)
    const wordCount = words.length
    const cleanSlug = (slug || '').toLowerCase().trim()
    const rawContent = String(content || '')

    // Extract headings
    const h1Matches = rawContent.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || []
    const h2Matches = rawContent.match(/<h2[^>]*>([\s\S]*?)<\/h2>/gi) || []
    const h3Matches = rawContent.match(/<h3[^>]*>([\s\S]*?)<\/h3>/gi) || []

    // Extract internal links
    const linkMatches = rawContent.match(/href=["'](\/[^"']+|https?:\/\/(?:www\.)?0nprint\.com[^"']*)["']/gi) || []
    const internalLinksCount = linkMatches.length

    // Extract FAQs
    let parsedFaqs = []
    if (Array.isArray(faqs)) {
      parsedFaqs = faqs
    } else if (typeof faqs === 'string' && faqs.trim().startsWith('[')) {
      try {
        parsedFaqs = JSON.parse(faqs)
      } catch {}
    }
    const approvedFaqsCount = parsedFaqs.filter((f) => f.is_approved !== false).length

    // Readability & Keyword density
    const readabilityScore = calculateReadability(content)
    const keywordDensity = cleanKeyword ? calculateKeywordDensity(content, cleanKeyword) : 0

    let score = 0
    const checklist = []
    const recommendations = []

    // 1. Title Optimization (Max 10 pts)
    let titlePts = 0
    if (cleanTitle.length >= 35 && cleanTitle.length <= 75) {
      titlePts += 5
    } else if (cleanTitle.length > 0) {
      titlePts += 2
      recommendations.push({
        id: 'title-length',
        field: 'title',
        severity: 'medium',
        problem: `Title length (${cleanTitle.length} chars) is outside optimal range (40–70 chars).`,
        whyItMatters: 'Search engines may truncate overly long titles or consider short titles uninformative.',
        suggestedSolution: 'Craft an engaging headline between 45 and 65 characters describing the core benefit.',
        proposedValue: cleanTitle.length > 70 ? cleanTitle.slice(0, 65).trim() + '…' : cleanTitle,
        canApply: false,
      })
    } else {
      recommendations.push({
        id: 'title-missing',
        field: 'title',
        severity: 'critical',
        problem: 'Article title is missing.',
        whyItMatters: 'Page title is the single most critical on-page ranking and CTR signal.',
        suggestedSolution: 'Provide a compelling, keyword-rich article title.',
        canApply: false,
      })
    }

    if (cleanKeyword && cleanTitle.toLowerCase().includes(cleanKeyword)) {
      titlePts += 5
    } else if (cleanKeyword) {
      recommendations.push({
        id: 'keyword-in-title',
        field: 'title',
        severity: 'high',
        problem: `Focus keyword "${cleanKeyword}" does not appear in the title.`,
        whyItMatters: 'Keyword in title confirms immediate relevance for Google and prospective readers.',
        suggestedSolution: `Naturally incorporate "${cleanKeyword}" into the title.`,
        canApply: false,
      })
    }
    score += titlePts

    // 2. Meta Title (Max 8 pts)
    let metaTitlePts = 0
    if (cleanMetaTitle.length >= 40 && cleanMetaTitle.length <= 65) {
      metaTitlePts += 4
    } else if (cleanMetaTitle.length > 0) {
      metaTitlePts += 2
      recommendations.push({
        id: 'meta-title-length',
        field: 'meta_title',
        severity: 'medium',
        problem: `Meta title is ${cleanMetaTitle.length} characters (optimal: 45–60 chars).`,
        whyItMatters: 'SERP snippets truncate titles over 60 characters with an ellipsis.',
        suggestedSolution: 'Shorten meta title to under 60 characters including "| ONPRINT Dubai".',
        proposedValue: cleanMetaTitle.slice(0, 58).trim(),
        canApply: true,
      })
    } else {
      recommendations.push({
        id: 'meta-title-missing',
        field: 'meta_title',
        severity: 'critical',
        problem: 'Custom SEO Meta Title is missing.',
        whyItMatters: 'Without a meta title, search engines guess the title from page headings.',
        suggestedSolution: `Set a dedicated meta title: "${cleanTitle} | ONPRINT Dubai".`,
        proposedValue: `${cleanTitle} | ONPRINT Dubai`.slice(0, 60),
        canApply: true,
      })
    }

    if (cleanKeyword && cleanMetaTitle.toLowerCase().includes(cleanKeyword)) {
      metaTitlePts += 4
    }
    score += metaTitlePts

    // 3. Meta Description (Max 10 pts)
    let metaDescPts = 0
    if (cleanMetaDesc.length >= 120 && cleanMetaDesc.length <= 165) {
      metaDescPts += 6
    } else if (cleanMetaDesc.length > 0) {
      metaDescPts += 3
      recommendations.push({
        id: 'meta-desc-length',
        field: 'meta_description',
        severity: 'medium',
        problem: `Meta description is ${cleanMetaDesc.length} characters (recommended: 135–160 chars).`,
        whyItMatters: 'Search result snippets truncate descriptions over 160 characters.',
        suggestedSolution: 'Keep the description between 135 and 155 characters with a clear call-to-action.',
        proposedValue: cleanMetaDesc.slice(0, 155).trim(),
        canApply: true,
      })
    } else {
      recommendations.push({
        id: 'meta-desc-missing',
        field: 'meta_description',
        severity: 'critical',
        problem: 'Meta description is missing.',
        whyItMatters: 'Meta descriptions directly influence search click-through rate (CTR).',
        suggestedSolution: 'Write a persuasive summary of what readers will learn.',
        canApply: false,
      })
    }

    if (cleanKeyword && cleanMetaDesc.toLowerCase().includes(cleanKeyword)) {
      metaDescPts += 4
    } else if (cleanKeyword && cleanMetaDesc.length > 0) {
      recommendations.push({
        id: 'keyword-in-desc',
        field: 'meta_description',
        severity: 'medium',
        problem: `Focus keyword "${cleanKeyword}" is missing from the meta description.`,
        whyItMatters: 'Google bolds matching search terms in the snippet, drawing user attention.',
        suggestedSolution: `Weave "${cleanKeyword}" into the meta description naturally.`,
        canApply: false,
      })
    }
    score += metaDescPts

    // 4. Focus Keyword Definition (Max 5 pts)
    if (cleanKeyword.length >= 3) {
      score += 5
    } else {
      recommendations.push({
        id: 'focus-keyword-missing',
        field: 'focus_keyword',
        severity: 'high',
        problem: 'No primary focus keyword assigned.',
        whyItMatters: 'Without a target keyword, topical alignment cannot be optimized.',
        suggestedSolution: 'Define a specific commercial printing keyword (e.g. "business cards printing dubai").',
        canApply: false,
      })
    }

    // 5. Keyword Placement Checks (Max 15 pts)
    let placementPts = 0
    const inTitle = Boolean(cleanKeyword && cleanTitle.toLowerCase().includes(cleanKeyword))
    const inH1 = Boolean(cleanKeyword && h1Matches.some((h) => h.toLowerCase().includes(cleanKeyword)))
    const inH2 = Boolean(cleanKeyword && h2Matches.some((h) => h.toLowerCase().includes(cleanKeyword)))
    const inSlug = Boolean(cleanKeyword && cleanSlug.includes(cleanKeyword.replace(/\s+/g, '-')))

    // Check introduction (first 120 words)
    const introSnippet = words.slice(0, 120).join(' ').toLowerCase()
    const inIntro = Boolean(cleanKeyword && introSnippet.includes(cleanKeyword))

    if (inTitle) placementPts += 3
    if (inH1 || inTitle) placementPts += 3
    if (inIntro) placementPts += 3
    if (inSlug) placementPts += 3
    if (inH2) placementPts += 3

    if (cleanKeyword && !inIntro) {
      recommendations.push({
        id: 'keyword-in-intro',
        field: 'content',
        severity: 'high',
        problem: `Focus keyword "${cleanKeyword}" does not appear in the introduction.`,
        whyItMatters: 'Topical clarity within the first 100 words signals content relevance to search engines.',
        suggestedSolution: `Mention "${cleanKeyword}" early in your opening paragraph.`,
        canApply: false,
      })
    }

    if (cleanKeyword && !inH2) {
      recommendations.push({
        id: 'keyword-in-h2',
        field: 'content',
        severity: 'medium',
        problem: `Focus keyword "${cleanKeyword}" does not appear in any H2 subheading.`,
        whyItMatters: 'Subheadings guide crawlers through the topical depth of your guide.',
        suggestedSolution: `Add "${cleanKeyword}" naturally into at least one H2 section.`,
        canApply: false,
      })
    }

    if (cleanKeyword && !inSlug) {
      recommendations.push({
        id: 'keyword-in-slug',
        field: 'slug',
        severity: 'medium',
        problem: 'URL slug does not include the target keyword.',
        whyItMatters: 'Keywords in URL slugs provide clear topical cues to searchers and crawlers.',
        suggestedSolution: `Update slug to include keyword (e.g. /blog/${cleanKeyword.replace(/\s+/g, '-')}).`,
        proposedValue: cleanKeyword.replace(/\s+/g, '-'),
        canApply: true,
      })
    }
    score += placementPts

    // 6. Content Length / Word Count (Max 10 pts)
    let contentLenPts = 0
    if (wordCount >= 1000) {
      contentLenPts = 10
    } else if (wordCount >= 600) {
      contentLenPts = 8
    } else if (wordCount >= 300) {
      contentLenPts = 5
      recommendations.push({
        id: 'thin-content',
        field: 'content',
        severity: 'medium',
        problem: `Article length (${wordCount} words) is somewhat concise.`,
        whyItMatters: 'Comprehensive guides (600–1200+ words) rank higher and answer user questions in depth.',
        suggestedSolution: 'Expand with practical print specifications, paper GSM comparisons, and pre-press tips.',
        canApply: false,
      })
    } else {
      contentLenPts = 1
      recommendations.push({
        id: 'very-thin-content',
        field: 'content',
        severity: 'critical',
        problem: `Article is very short (${wordCount} words). Thin content risk.`,
        whyItMatters: 'Google penalizes or de-indexes thin pages that offer minimal original value.',
        suggestedSolution: 'Expand article body to at least 400–600 words of authentic technical advice.',
        canApply: false,
      })
    }
    score += contentLenPts

    // 7. Heading Structure (Max 8 pts)
    let headingPts = 0
    if (h2Matches.length >= 3) {
      headingPts += 6
      if (h3Matches.length >= 1) headingPts += 2
    } else if (h2Matches.length >= 1) {
      headingPts += 4
      recommendations.push({
        id: 'few-headings',
        field: 'content',
        severity: 'medium',
        problem: `Article has only ${h2Matches.length} H2 heading(s).`,
        whyItMatters: 'Clear hierarchy with multiple H2s improves scannability and eligibility for featured snippets.',
        suggestedSolution: 'Break your article into 3–5 logical sections with descriptive H2 headings.',
        canApply: false,
      })
    } else {
      recommendations.push({
        id: 'no-headings',
        field: 'content',
        severity: 'high',
        problem: 'No H2 headings detected in article content.',
        whyItMatters: 'Walls of unstructured text suffer high bounce rates and lower search rankings.',
        suggestedSolution: 'Add <h2> subheadings to divide major concepts.',
        canApply: false,
      })
    }
    score += headingPts

    // 8. Readability Score (Max 8 pts)
    let readPts = 0
    if (readabilityScore >= 60 && readabilityScore <= 80) {
      readPts = 8
    } else if (readabilityScore >= 50) {
      readPts = 6
    } else {
      readPts = 3
      recommendations.push({
        id: 'low-readability',
        field: 'content',
        severity: 'low',
        problem: `Flesch Reading Ease score (${readabilityScore}/100) suggests complex phrasing.`,
        whyItMatters: 'Clear, conversational language improves reader engagement and dwell time.',
        suggestedSolution: 'Shorten compound sentences and replace dense jargon with straightforward explanations.',
        canApply: false,
      })
    }
    score += readPts

    // 9. Keyword Density (Max 6 pts)
    let densityPts = 0
    if (cleanKeyword) {
      if (keywordDensity >= 0.8 && keywordDensity <= 2.2) {
        densityPts = 6
      } else if (keywordDensity > 2.2 && keywordDensity <= 3.5) {
        densityPts = 4
        recommendations.push({
          id: 'high-keyword-density',
          field: 'content',
          severity: 'medium',
          problem: `Keyword density is high (${keywordDensity}%). Approaching keyword-stuffing threshold.`,
          whyItMatters: 'Google algorithms penalize unnatural keyword repetition.',
          suggestedSolution: 'Replace some exact repetitions with synonyms and natural phrasing.',
          canApply: false,
        })
      } else if (keywordDensity > 3.5) {
        densityPts = 1
        recommendations.push({
          id: 'keyword-stuffing',
          field: 'content',
          severity: 'critical',
          problem: `Keyword density is excessive (${keywordDensity}%). Critical keyword stuffing risk.`,
          whyItMatters: 'Violates Google Search Essentials and can lead to algorithmic ranking suppression.',
          suggestedSolution: 'Dramatically reduce exact match keyword repetitions.',
          canApply: false,
        })
      } else {
        densityPts = 3
        recommendations.push({
          id: 'low-keyword-density',
          field: 'content',
          severity: 'low',
          problem: `Keyword density is low (${keywordDensity}%).`,
          whyItMatters: 'Mentions might be too sparse for search engines to establish strong topical relevance.',
          suggestedSolution: `Use "${cleanKeyword}" naturally a couple more times across your body paragraphs.`,
          canApply: false,
        })
      }
    } else {
      densityPts = 3
    }
    score += densityPts

    // 10. Internal Links (Max 6 pts)
    let internalLinkPts = 0
    if (internalLinksCount >= 2) {
      internalLinkPts = 6
    } else if (internalLinksCount === 1) {
      internalLinkPts = 4
      recommendations.push({
        id: 'few-internal-links',
        field: 'content',
        severity: 'low',
        problem: 'Only 1 internal link detected in article body.',
        whyItMatters: 'Internal links distribute page authority and guide users to relevant catalog items.',
        suggestedSolution: 'Add another link to related ONPRINT categories, products, or quote request page.',
        canApply: false,
      })
    } else {
      recommendations.push({
        id: 'missing-internal-links',
        field: 'content',
        severity: 'high',
        problem: 'No internal links found in article content.',
        whyItMatters: 'Contextual internal links pass PageRank to commercial product pages and prevent orphan content.',
        suggestedSolution: 'Link relevant phrases to ONPRINT service pages (e.g. /services, /categories).',
        canApply: false,
      })
    }
    score += internalLinkPts

    // 11. Image & Alt Text (Max 5 pts)
    let imagePts = 0
    const hasImage = Boolean(featured_image && featured_image.trim().length > 0)
    const hasAlt = Boolean(image_alt && image_alt.trim().length > 0)

    if (hasImage && hasAlt) {
      imagePts = 5
    } else if (hasImage && !hasAlt) {
      imagePts = 2
      recommendations.push({
        id: 'missing-image-alt',
        field: 'image_alt',
        severity: 'high',
        problem: 'Featured image is missing descriptive ALT text.',
        whyItMatters: 'Image ALT text is required for Google Image search ranking and screen reader accessibility.',
        suggestedSolution: `Add descriptive ALT text: "${cleanTitle} commercial printing in Dubai | ONPRINT".`,
        proposedValue: `${cleanTitle} commercial printing in Dubai | ONPRINT`,
        canApply: true,
      })
    } else {
      recommendations.push({
        id: 'missing-featured-image',
        field: 'featured_image',
        severity: 'high',
        problem: 'No featured image set for this article.',
        whyItMatters: 'Articles with high-resolution imagery achieve significantly higher CTR and social shares.',
        suggestedSolution: 'Upload a relevant photograph showcasing print finishes or materials.',
        canApply: false,
      })
    }
    score += imagePts

    // 12. URL / Slug Optimization (Max 5 pts)
    let slugPts = 0
    if (cleanSlug && cleanSlug.length >= 3 && cleanSlug.length <= 60 && !/[^a-z0-9\-]/.test(cleanSlug)) {
      slugPts = 5
    } else if (cleanSlug) {
      slugPts = 3
    } else {
      recommendations.push({
        id: 'missing-slug',
        field: 'slug',
        severity: 'critical',
        problem: 'URL slug is not specified.',
        whyItMatters: 'Valid slugs are required to construct clean canonical URLs.',
        suggestedSolution: `Set slug to: "${generateSlug(cleanTitle)}"`,
        proposedValue: generateSlug(cleanTitle),
        canApply: true,
      })
    }
    score += slugPts

    // 13. Canonical URL (Max 4 pts)
    let canonicalPts = 0
    if (canonical_url && canonical_url.startsWith('http')) {
      canonicalPts = 4
    } else {
      const defaultCanon = `https://0nprint.com/blog/${cleanSlug || generateSlug(cleanTitle)}`
      recommendations.push({
        id: 'canonical-url',
        field: 'canonical_url',
        severity: 'medium',
        problem: 'Canonical URL is not explicitly defined.',
        whyItMatters: 'Canonical URLs prevent duplicate content penalties across protocol and query parameter variations.',
        suggestedSolution: `Set canonical URL to: ${defaultCanon}`,
        proposedValue: defaultCanon,
        canApply: true,
      })
    }
    score += canonicalPts

    // 14. FAQs Presence (Max 5 pts)
    let faqPts = 0
    if (approvedFaqsCount >= 2) {
      faqPts = 5
    } else if (approvedFaqsCount === 1) {
      faqPts = 3
    } else {
      recommendations.push({
        id: 'missing-faqs',
        field: 'faqs',
        severity: 'medium',
        problem: 'No approved FAQs added to this article.',
        whyItMatters: 'FAQs enhance user dwell time and make the article eligible for FAQ rich results.',
        suggestedSolution: 'Use the "Suggest FAQs with AI" feature to generate and approve 2–3 questions.',
        canApply: false,
      })
    }
    score += faqPts

    // Cap score at 100
    const finalScore = Math.min(100, Math.max(0, Math.round(score)))

    // Determine status label
    let statusLabel = 'Poor'
    let statusColor = 'red'
    if (finalScore >= 90) {
      statusLabel = 'Excellent'
      statusColor = 'emerald'
    } else if (finalScore >= 75) {
      statusLabel = 'Good'
      statusColor = 'blue'
    } else if (finalScore >= 50) {
      statusLabel = 'Needs Improvement'
      statusColor = 'amber'
    }

    const breakdown = {
      titleLength: { score: titlePts, passed: titlePts >= 5, note: cleanTitle.length >= 40 && cleanTitle.length <= 70 ? `${cleanTitle.length} chars (optimal)` : `${cleanTitle.length} chars` },
      metaTitle: { score: metaTitlePts, passed: metaTitlePts >= 6, note: cleanMetaTitle.length >= 45 && cleanMetaTitle.length <= 65 ? `${cleanMetaTitle.length} chars (optimal)` : cleanMetaTitle ? `${cleanMetaTitle.length} chars` : 'Missing' },
      metaDescription: { score: metaDescPts, passed: metaDescPts >= 6, note: cleanMetaDesc.length >= 120 && cleanMetaDesc.length <= 165 ? `${cleanMetaDesc.length} chars (optimal)` : cleanMetaDesc ? `${cleanMetaDesc.length} chars` : 'Missing' },
      focusKeyword: { score: cleanKeyword.length >= 3 ? 5 : 0, passed: cleanKeyword.length >= 3, note: cleanKeyword || 'Not defined' },
      keywordInTitle: { score: inTitle ? 3 : 0, passed: inTitle, note: inTitle ? 'Present in title' : 'Missing from title' },
      keywordInH1: { score: (inH1 || inTitle) ? 3 : 0, passed: inH1 || inTitle, note: inH1 || inTitle ? 'Found in H1/Title' : 'Missing from H1' },
      keywordInIntro: { score: inIntro ? 3 : 0, passed: inIntro, note: inIntro ? 'Present in first 120 words' : 'Missing from intro' },
      keywordInUrl: { score: inSlug ? 3 : 0, passed: inSlug, note: inSlug ? 'Included in URL slug' : 'Missing from slug' },
      keywordInH2: { score: inH2 ? 3 : 0, passed: inH2, note: inH2 ? 'Present in subheadings' : 'Missing from H2' },
      contentLength: { score: contentLenPts, passed: words.length >= 600, note: `${words.length} words` },
      headingStructure: { score: headingPts, passed: (h2Matches.length + h3Matches.length) >= 3, note: `${h2Matches.length} H2s, ${h3Matches.length} H3s` },
      readability: { score: readPts, passed: readabilityScore >= 50, note: `${readabilityScore}/100 Flesch Ease` },
      keywordDensity: { score: densityPts, passed: keywordDensity >= 0.8 && keywordDensity <= 2.5, note: `${keywordDensity}%` },
      internalLinks: { score: internalLinkPts, passed: internalLinksCount >= 2, note: `${internalLinksCount} internal links` },
      featuredImage: { score: imagePts, passed: hasImage && hasAlt, note: hasImage ? (hasAlt ? 'Image with ALT' : 'Missing ALT text') : 'Missing image' },
      urlSlug: { score: slugPts, passed: slugPts >= 4, note: cleanSlug || 'Missing' },
      canonicalUrl: { score: canonicalPts, passed: canonicalPts >= 4, note: canonical_url ? 'Configured' : 'Missing' },
      faqSchema: { score: faqPts, passed: approvedFaqsCount >= 2, note: `${approvedFaqsCount} approved FAQs` },
    }

    return {
      score: finalScore,
      statusLabel,
      statusColor,
      readabilityScore,
      keywordDensity,
      wordCount,
      breakdown,
      keywordChecks: {
        inTitle,
        inH1,
        inIntro,
        inUrl: inSlug,
        inH2,
      },
      contentChecks: {
        wordCount,
        readabilityScore,
        headingCount: h2Matches.length + h3Matches.length,
        internalLinksCount,
        faqCount: approvedFaqsCount,
        hasFeaturedImage: hasImage,
        hasAltText: hasAlt,
      },
      recommendations,
    }
  }

  /**
   * AI SEO Generator: Analyzes title, content, category, and target keyword
   * Returns all 15 required fields
   */
  async generateBlogSeo(params = {}) {
    const {
      title = '',
      content = '',
      category_id,
      product_id,
      focus_keyword,
      target_location = 'Dubai',
    } = params

    // Fetch category and product context from MySQL
    let categoryName = 'Commercial Printing'
    let productName = ''
    try {
      if (category_id) {
        const [cats] = await pool.query('SELECT name FROM categories WHERE id = ?', [category_id])
        if (cats.length > 0) categoryName = cats[0].name
      }
      if (product_id) {
        const [prods] = await pool.query('SELECT name FROM products WHERE id = ?', [product_id])
        if (prods.length > 0) productName = prods[0].name
      }
    } catch {}

    const cleanTitle = (title || `${categoryName} Guide for Dubai Businesses`).trim()
    const cleanContent = stripHtml(content)
    const loc = target_location || 'Dubai'
    const keyword = (focus_keyword || `${categoryName.toLowerCase()} ${loc.toLowerCase()}`).trim()

    // 1. Get internal linking candidates from existing database
    const linkOpportunities = await this.getInternalLinkSuggestions(content)

    // 2. Try external AI API (Gemini / OpenAI) if configured
    const { apiKey, provider, model } = await this.getAiConfig()
    let aiOutput = null

    if (apiKey && apiKey.length > 5) {
      try {
        aiOutput = await this._callAiModel({
          title: cleanTitle,
          content: cleanContent.slice(0, 1500),
          categoryName,
          productName,
          keyword,
          location: loc,
          config: { apiKey, provider, model },
        })
      } catch (err) {
        console.warn('[BlogSeoAiService] Remote AI error, using deterministic generator:', err.message)
      }
    }

    // 3. Fallback to deterministic Dubai printing generator if AI returned null
    if (!aiOutput) {
      aiOutput = this._generateDeterministicSeo({
        title: cleanTitle,
        categoryName,
        productName,
        keyword,
        location: loc,
      })
    }

    // Calculate baseline SEO and readability score on the generated/current values
    const generatedMetaTitle = aiOutput.meta_title || `${cleanTitle} | ONPRINT ${loc}`.slice(0, 60)
    const generatedMetaDesc = aiOutput.meta_description || `Expert guide on ${keyword} in ${loc}. Quality card stocks, finishes, and fast UAE delivery.`.slice(0, 155)
    const generatedSlug = aiOutput.suggested_slug || generateSlug(aiOutput.seo_title || cleanTitle)

    const evaluation = this.calculateSeoScore({
      title: aiOutput.seo_title || cleanTitle,
      content,
      meta_title: generatedMetaTitle,
      meta_description: generatedMetaDesc,
      focus_keyword: aiOutput.focus_keyword || keyword,
      secondary_keywords: aiOutput.secondary_keywords,
      slug: generatedSlug,
      canonical_url: `https://0nprint.com/blog/${generatedSlug}`,
      featured_image: '/assets/products/1 (1).jpg',
      image_alt: aiOutput.image_alt,
      faqs: aiOutput.suggested_faqs || [],
    })

    return {
      seo_title: aiOutput.seo_title || cleanTitle,
      meta_title: generatedMetaTitle,
      meta_description: generatedMetaDesc,
      focus_keyword: aiOutput.focus_keyword || keyword,
      secondary_keywords: aiOutput.secondary_keywords || `${categoryName.toLowerCase()}, commercial printing dubai, luxury stationery uae`,
      suggested_slug: generatedSlug,
      suggested_h2_headings: aiOutput.suggested_h2_headings || [
        `Why Quality ${categoryName} Matters in ${loc}`,
        `Material Specifications and Paper Weights`,
        `Luxury Finishing Options: Foil, Embossing & UV`,
        `Pre-Press Preparation & Artwork Best Practices`,
      ],
      suggested_faqs: (aiOutput.suggested_faqs || []).map((faq, idx) => ({
        id: `faq-${Date.now()}-${idx}`,
        question: faq.question,
        answer: faq.answer,
        is_approved: false, // Requires admin approval
      })),
      internal_linking_suggestions: linkOpportunities,
      image_alt: aiOutput.image_alt || `${cleanTitle} — ONPRINT Dubai`,
      og_title: aiOutput.og_title || generatedMetaTitle,
      og_description: aiOutput.og_description || generatedMetaDesc,
      seo_score: evaluation.score,
      readability_score: evaluation.readabilityScore,
      seo_recommendations: evaluation.recommendations,
      search_intent: 'Commercial / Informational Guide',
    }
  }

  /**
   * Internal Linking Engine for Blogs
   */
  async getInternalLinkSuggestions(content = '') {
    const suggestions = []
    try {
      const cleanContent = stripHtml(content).toLowerCase()

      // Fetch published categories, products, and other published blogs
      const [categories] = await pool.query('SELECT name, slug FROM categories WHERE active = 1 LIMIT 10')
      const [products] = await pool.query('SELECT name, slug FROM products WHERE active = 1 LIMIT 10')
      const [blogs] = await pool.query('SELECT id, title, slug, focus_keyword FROM blogs WHERE status = "published" LIMIT 10')

      // Check categories
      categories.forEach((cat) => {
        const catNameLower = cat.name.toLowerCase()
        if (cleanContent.includes(catNameLower) || cleanContent.includes(cat.slug.replace(/-/g, ' '))) {
          suggestions.push({
            id: `link-cat-${cat.slug}`,
            target_url: `/categories/${cat.slug}`,
            target_title: cat.name,
            anchor_text: cat.name.toLowerCase(),
            rationale: `Connects guide to the "${cat.name}" category catalog for users looking to browse available options.`,
          })
        }
      })

      // Check products
      products.forEach((prod) => {
        const prodNameLower = prod.name.toLowerCase()
        if (cleanContent.includes(prodNameLower) || cleanContent.includes(prod.slug.replace(/-/g, ' '))) {
          suggestions.push({
            id: `link-prod-${prod.slug}`,
            target_url: `/products/${prod.slug}`,
            target_title: prod.name,
            anchor_text: `our ${prod.name.toLowerCase()}`,
            rationale: `Direct commercial conversion link to "${prod.name}" product detail page.`,
          })
        }
      })

      // Standard high-intent links if body has general printing mentions
      if (cleanContent.includes('quote') || cleanContent.includes('price') || cleanContent.includes('order')) {
        suggestions.push({
          id: 'link-quote',
          target_url: '/get-a-quote',
          target_title: 'Custom Printing Quote',
          anchor_text: 'request a custom printing quote',
          rationale: 'High-converting call to action guiding commercial clients to the quote form.',
        })
      }

      if (cleanContent.includes('service') || cleanContent.includes('commercial')) {
        suggestions.push({
          id: 'link-services',
          target_url: '/services',
          target_title: 'Commercial Printing Services',
          anchor_text: 'commercial printing services',
          rationale: 'Builds authority connection between blog guides and core service offerings.',
        })
      }
    } catch (err) {
      console.warn('[BlogSeoAiService] Internal links note:', err.message)
    }

    // Deduplicate suggestions by target_url
    const seen = new Set()
    return suggestions.filter((s) => {
      if (seen.has(s.target_url)) return false
      seen.add(s.target_url)
      return true
    }).slice(0, 5)
  }

  /**
   * External AI API Caller (Gemini / OpenAI)
   */
  async _callAiModel({ title, content, categoryName, productName, keyword, location, config }) {
    const { apiKey, provider, model } = config

    const systemPrompt = `You are a World-Class White-Hat Technical SEO Architect for ONPRINT, a premier commercial printing company in Dubai, UAE.
Analyze the article topic and generate strictly fact-based, search-optimized SEO metadata and suggestions adhering to Google Search Essentials.

CRITICAL RULES:
1. Output MUST be strictly valid JSON without markdown fences.
2. STRICTLY NO KEYWORD STUFFING. Keep keyword density natural and contextual.
3. STRICTLY NO FAKE REVIEWS, FAKE CLIENTS, FAKE STATISTICS OR MISLEADING CLAIMS.
4. Titles must be 45-60 characters ending with "| ONPRINT" or "Dubai | ONPRINT".
5. Meta descriptions must be 135-155 characters with a clear value proposition.
6. Provide 2-3 genuine, practical customer FAQs regarding materials, turnarounds, and pre-press standards in Dubai.

REQUIRED JSON FORMAT:
{
  "seo_title": "Optimized Article Title",
  "meta_title": "45-60 char meta title | ONPRINT",
  "meta_description": "135-155 char meta description with CTA",
  "focus_keyword": "primary target keyword",
  "secondary_keywords": "comma, separated, related, terms",
  "suggested_slug": "clean-kebab-case-slug",
  "suggested_h2_headings": [
    "Subheading 1",
    "Subheading 2",
    "Subheading 3"
  ],
  "suggested_faqs": [
    {
      "question": "What is the standard production turnaround in Dubai?",
      "answer": "Standard turnaround is 24-48 hours with express same-day delivery available across Dubai."
    },
    {
      "question": "Can I inspect physical paper and finish swatches?",
      "answer": "Yes, ONPRINT provides complimentary sample swatches of card stocks, laminations, and foil stamping."
    }
  ],
  "image_alt": "Descriptive image ALT text with context",
  "og_title": "Open Graph Title",
  "og_description": "Open Graph Description"
}`

    const userPayload = {
      title,
      category: categoryName,
      product: productName,
      focusKeyword: keyword,
      targetLocation: location,
      contentSnippet: content.slice(0, 1000),
    }

    if (provider === 'gemini') {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
      const body = {
        contents: [
          {
            role: 'user',
            parts: [
              { text: systemPrompt },
              { text: `Analyze the following printing article data and generate SEO:\n\n${JSON.stringify(userPayload, null, 2)}` },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.2,
          maxOutputTokens: 1200,
        },
      }

      const response = await this._httpsPost(endpoint, body)
      const text = response?.candidates?.[0]?.content?.parts?.[0]?.text
      if (!text) throw new Error('Empty response from Gemini API')
      return JSON.parse(text)
    } else {
      const endpoint = `https://api.openai.com/v1/chat/completions`
      const body = {
        model: model || 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Analyze the following printing article data and generate SEO:\n\n${JSON.stringify(userPayload, null, 2)}` },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.2,
      }

      const response = await this._httpsPost(endpoint, body, { Authorization: `Bearer ${apiKey}` })
      const text = response?.choices?.[0]?.message?.content
      if (!text) throw new Error('Empty response from OpenAI API')
      return JSON.parse(text)
    }
  }

  /**
   * Deterministic high-quality fallback generator
   */
  _generateDeterministicSeo({ title, categoryName, productName, keyword, location }) {
    const cleanTitle = title.replace(/\s+/g, ' ').trim()
    const slug = generateSlug(cleanTitle)

    const metaTitle = `${cleanTitle} | ONPRINT ${location}`.slice(0, 60)
    const metaDesc = `Expert guide on ${keyword} in ${location}. Learn about luxury card stocks, foiling, Pantone fidelity, and express UAE delivery from ONPRINT.`.slice(0, 155)

    return {
      seo_title: cleanTitle,
      meta_title: metaTitle,
      meta_description: metaDesc,
      focus_keyword: keyword,
      secondary_keywords: `${categoryName.toLowerCase()}, commercial printing ${location.toLowerCase()}, luxury stationery uae, print finishing dubai`,
      suggested_slug: slug,
      suggested_h2_headings: [
        `Why Premium ${categoryName} Matters for ${location} Corporate Brands`,
        `Substrate Selection: Coated vs Uncoated Paper GSM Weights`,
        `Luxury Finishing Techniques: Foiling, Spot UV & Lamination`,
        `Pre-Press Checklist: Bleed, CMYK Profiles & PDF/X Standards`,
        `Ordering Commercial Printing with ONPRINT Dubai`,
      ],
      suggested_faqs: [
        {
          question: `What is the standard turnaround time for ${categoryName.toLowerCase()} in ${location}?`,
          answer: `Standard production is 24 to 48 hours, with express same-day dispatch available across Dubai for urgent corporate deadlines.`,
        },
        {
          question: `Can I view paper stock and finishing samples before bulk production?`,
          answer: `Yes, ONPRINT provides complimentary sample swatch books featuring our cotton card stocks, velvet laminations, and foil stamping.`,
        },
        {
          question: `What file format is required for print-ready artwork?`,
          answer: `We recommend vector PDF/X-1a with CMYK color profiles, 300 DPI image resolution, and a minimum of 3mm bleed on all sides.`,
        },
      ],
      image_alt: `${cleanTitle} — Commercial Printing Dubai | ONPRINT`,
      og_title: metaTitle,
      og_description: metaDesc,
    }
  }
}

module.exports = new BlogSeoAiService()
