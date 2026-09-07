/**
 * SEO Safety & Pre-Publish Validation Service
 * Enforces strict Google Webmaster / Search Essentials compliance.
 * Validates any AI recommendation or proposed SEO change before publication.
 * If validation fails, changes are rejected from auto-publishing and sent to "SEO REVIEW REQUIRED".
 */

class SeoSafetyService {
  /**
   * Validate a proposed SEO change against Google Search Essentials guidelines.
   * @param {Object} change - The proposed change object
   * @param {string} change.url - The target URL
   * @param {string} [change.title] - Proposed SEO title
   * @param {string} [change.metaDescription] - Proposed meta description
   * @param {string} [change.h1] - Proposed H1 heading
   * @param {string} [change.canonicalUrl] - Proposed canonical URL
   * @param {string} [change.content] - Proposed content or description
   * @param {Array<string>} [change.keywords] - Target keywords
   * @param {Object} [existingContext] - Existing site context for collision checks
   * @returns {Object} { isValid: boolean, status: 'PASSED' | 'REVIEW_REQUIRED', violations: Array<string>, warnings: Array<string> }
   */
  validateChange(change = {}, existingContext = {}) {
    const violations = []
    const warnings = []

    const {
      url = '',
      title = '',
      metaDescription = '',
      h1 = '',
      canonicalUrl = '',
      content = '',
      keywords = [],
    } = change

    const { existingTitles = [], existingDescriptions = [], existingUrls = [] } = existingContext

    // 1. Keyword Stuffing Detection (< 2.5% max density)
    if (content && Array.isArray(keywords) && keywords.length > 0) {
      const words = content.toLowerCase().split(/\s+/).filter(Boolean)
      const totalWords = words.length

      if (totalWords > 0) {
        keywords.forEach((kw) => {
          if (!kw || typeof kw !== 'string') return
          const cleanKw = kw.toLowerCase().trim()
          const kwWords = cleanKw.split(/\s+/).length
          let matches = 0

          const textLower = content.toLowerCase()
          let pos = 0
          while ((pos = textLower.indexOf(cleanKw, pos)) !== -1) {
            matches++
            pos += cleanKw.length
          }

          const density = (matches * kwWords) / totalWords
          if (density > 0.025) {
            violations.push(
              `Keyword stuffing detected: "${kw}" has a density of ${(density * 100).toFixed(1)}% (exceeds safe threshold of 2.5%).`
            )
          } else if (density > 0.018) {
            warnings.push(
              `High keyword density: "${kw}" has ${(density * 100).toFixed(1)}% density. Consider using natural synonyms.`
            )
          }
        })
      }
    }

    // 2. Title Tag Validation
    if (title !== undefined && title !== null) {
      const titleClean = String(title).trim()
      if (titleClean.length === 0) {
        violations.push('Title cannot be empty.')
      } else if (titleClean.length < 20) {
        violations.push(`Title is too short (${titleClean.length} characters). Target 40 to 60 characters.`)
      } else if (titleClean.length > 75) {
        warnings.push(`Title length (${titleClean.length} characters) may be truncated in search results (>65-70 chars).`)
      }

      // Title keyword repetition check
      const titleWords = titleClean.toLowerCase().split(/\s+/)
      const wordCounts = {}
      titleWords.forEach((w) => {
        if (w.length > 3) {
          wordCounts[w] = (wordCounts[w] || 0) + 1
        }
      })
      Object.entries(wordCounts).forEach(([word, count]) => {
        if (count >= 3) {
          violations.push(`Repetitive word in title: "${word}" appears ${count} times. Avoid title stuffing.`)
        }
      })

      // Duplicate title check
      if (existingTitles.includes(titleClean.toLowerCase())) {
        violations.push(`Duplicate title: "${titleClean}" already exists on another page.`)
      }
    }

    // 3. Meta Description Validation
    if (metaDescription !== undefined && metaDescription !== null) {
      const descClean = String(metaDescription).trim()
      if (descClean.length === 0) {
        violations.push('Meta description cannot be empty.')
      } else if (descClean.length < 50) {
        violations.push(`Meta description is too short (${descClean.length} characters). Target 120 to 155 characters.`)
      } else if (descClean.length > 175) {
        warnings.push(`Meta description (${descClean.length} chars) exceeds optimal length of 160 chars and will be clipped.`)
      }

      // Duplicate description check
      if (existingDescriptions.includes(descClean.toLowerCase())) {
        violations.push('Duplicate meta description: This snippet is already used on another page.')
      }
    }

    // 4. Canonical URL Validation
    if (canonicalUrl !== undefined && canonicalUrl !== null && String(canonicalUrl).length > 0) {
      const canonStr = String(canonicalUrl).trim()
      if (!canonStr.startsWith('https://')) {
        violations.push(`Insecure canonical URL: "${canonStr}" must start with https://.`)
      }
      try {
        const parsed = new URL(canonStr)
        if (!parsed.hostname.includes('0nprint.com') && !parsed.hostname.includes('localhost') && !parsed.hostname.includes('onprint')) {
          violations.push(`Cross-domain canonical detected: "${parsed.hostname}" does not match primary domain.`)
        }
      } catch {
        violations.push(`Malformed canonical URL: "${canonStr}".`)
      }
    }

    // 5. H1 Tag Validation
    if (h1 !== undefined && h1 !== null) {
      const h1Clean = String(h1).trim()
      if (h1Clean.length === 0) {
        violations.push('Missing H1 heading: Every page must have a single descriptive H1.')
      } else if (h1Clean.length > 100) {
        warnings.push('H1 heading exceeds 100 characters. Keep headings punchy and focused on primary search intent.')
      }
    }

    // 6. Low-Value / Thin Content Detection
    if (content !== undefined && content !== null && String(content).length > 0) {
      const words = String(content).trim().split(/\s+/).filter(Boolean).length
      if (words < 15) {
        violations.push(`Thin content: Proposed text contains only ${words} words. Provide valuable, comprehensive descriptions.`)
      }
    }

    const isValid = violations.length === 0
    return {
      isValid,
      status: isValid ? 'PASSED' : 'REVIEW_REQUIRED',
      violations,
      warnings,
      checkedAt: new Date().toISOString(),
    }
  }

  /**
   * Validate schema markup structure to prevent Google Rich Result penalties.
   */
  validateSchema(schema) {
    const errors = []
    if (!schema || typeof schema !== 'object') {
      return { isValid: false, errors: ['Schema is empty or not a valid JSON object.'] }
    }

    if (schema['@context'] !== 'https://schema.org' && schema['@context'] !== 'http://schema.org') {
      errors.push("Missing or invalid @context: must be 'https://schema.org'.")
    }

    if (!schema['@type']) {
      errors.push('Missing required @type field.')
    }

    // Product schema validation
    if (schema['@type'] === 'Product') {
      if (!schema.name) errors.push('Product schema missing required "name".')
      if (schema.offers) {
        if (!schema.offers.price && schema.offers.price !== 0) errors.push('Product Offer missing "price".')
        if (!schema.offers.priceCurrency) errors.push('Product Offer missing "priceCurrency".')
      }
      if (schema.aggregateRating) {
        const rating = schema.aggregateRating
        if (!rating.ratingValue || !rating.reviewCount) {
          errors.push('Incomplete aggregateRating in Product schema.')
        }
      }
    }

    // Service schema validation
    if (schema['@type'] === 'Service') {
      if (!schema.name) errors.push('Service schema missing required "name".')
      if (!schema.provider) errors.push('Service schema missing "provider".')
    }

    // FAQPage schema validation
    if (schema['@type'] === 'FAQPage') {
      if (!Array.isArray(schema.mainEntity) || schema.mainEntity.length === 0) {
        errors.push('FAQPage schema must contain at least one Question in "mainEntity".')
      } else {
        schema.mainEntity.forEach((q, idx) => {
          if (!q.name) errors.push(`FAQ item #${idx + 1} missing question name.`)
          if (!q.acceptedAnswer || !q.acceptedAnswer.text) {
            errors.push(`FAQ item #${idx + 1} missing acceptedAnswer text.`)
          }
        })
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }
}

module.exports = new SeoSafetyService()
