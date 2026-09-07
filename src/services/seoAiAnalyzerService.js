const https = require('https')
const { pool } = require('../config/database')
const seoScannerService = require('./seoScannerService')
const seoSafetyService = require('./seoSafetyService')

/**
 * SEO AI Analyzer Service
 * Uses AI (Gemini / OpenAI / Deterministic White-Hat NLP) to evaluate:
 * - Primary & secondary keywords (natural placement, strictly no keyword stuffing)
 * - Search intent (Informational, Navigational, Commercial, Transactional)
 * - Topic coverage & content depth
 * - Heading structure (H1 -> H2 -> H3)
 * - Flesch Reading Ease score
 * - Internal link opportunities
 * - FAQ opportunities
 * Enforces pre-publish safety checks via SeoSafetyService.
 */
class SeoAiAnalyzerService {
  /**
   * Helper to make HTTPS JSON requests
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
              reject(new Error(`AI API HTTP ${res.statusCode}: ${responseBody.slice(0, 300)}`))
            }
          } catch (err) {
            reject(new Error(`Failed to parse AI API JSON response: ${err.message}`))
          }
        })
      })

      req.on('error', (err) => reject(err))
      req.on('timeout', () => {
        req.destroy()
        reject(new Error('AI API request timed out (30s)'))
      })

      req.write(payload)
      req.end()
    })
  }

  /**
   * Calculate Flesch Reading Ease score
   */
  _calculateReadability(text = '') {
    if (!text || text.trim().length === 0) return 70
    const words = text.trim().split(/\s+/).filter(Boolean)
    const sentences = text.split(/[.!?]+/).filter(Boolean)
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
    return Math.max(20, Math.min(100, score))
  }

  /**
   * Retrieve active AI configuration
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
   * Run in-depth AI SEO analysis across website entities
   */
  async analyzeSite(options = {}) {
    return this.analyzeEntities(options)
  }

  /**
   * Run in-depth AI SEO analysis across entities detected in audit
   */
  async analyzeEntities(options = {}) {
    const { entityType, entityId, limit = 15, maxEntities = 15 } = options
    const actualLimit = maxEntities || limit

    const auditResult = await seoScannerService.runAudit()
    const entitiesToAnalyze = auditResult.entities
      .filter((e) => {
        if (entityType && e.entityType !== entityType) return false
        if (entityId && e.id !== entityId) return false
        return true
      })
      .slice(0, actualLimit)

    if (entitiesToAnalyze.length === 0) {
      return {
        success: true,
        message: 'No entities require analysis. All pages are within baseline guidelines.',
        recommendationsCount: 0,
        recommendations: [],
      }
    }

    const { apiKey, provider, model } = await this.getAiConfig()
    const generatedRecommendations = []

    for (const entity of entitiesToAnalyze) {
      try {
        const entityIssues = auditResult.issues.filter((i) => i.url === entity.url)

        let aiOutput = null
        if (apiKey && apiKey.length > 5) {
          try {
            aiOutput = await this._callAiModel(entity, entityIssues, { apiKey, provider, model })
          } catch (e) {
            console.warn(`[SeoAiAnalyzerService] Remote API error, using deterministic engine:`, e.message)
            aiOutput = this._generateDeterministicRecommendation(entity, entityIssues)
          }
        } else {
          aiOutput = this._generateDeterministicRecommendation(entity, entityIssues)
        }

        if (aiOutput) {
          // Compute Readability and Search Intent
          const rawText = entity.raw?.description || entity.raw?.short_description || entity.raw?.excerpt || entity.metaDescription || ''
          const readabilityScore = this._calculateReadability(rawText)
          const searchIntent = aiOutput.search_intent || (entity.entityType === 'blog' ? 'Informational' : 'Commercial / Transactional')

          // Run Pre-Publish Safety Check
          const proposedChange = {
            url: entity.url,
            title: aiOutput.suggested_title,
            metaDescription: aiOutput.suggested_meta_description,
            h1: aiOutput.suggested_h1,
            content: rawText,
            keywords: aiOutput.keywords || [],
          }
          const safetyResult = seoSafetyService.validateChange(proposedChange)
          const initialStatus = safetyResult.isValid ? 'NEW' : 'REVIEW_REQUIRED'

          const proposedValueObj = {
            title: aiOutput.suggested_title || entity.title,
            meta_description: aiOutput.suggested_meta_description || entity.metaDescription,
            h1: aiOutput.suggested_h1 || entity.h1,
            image_alt: aiOutput.suggested_image_alt || entity.imageAlt,
            search_intent: searchIntent,
            readability_score: readabilityScore,
            faq_opportunities: aiOutput.faq_opportunities || [],
            safety_status: safetyResult.status,
            safety_violations: safetyResult.violations,
          }

          // Persist in MySQL
          const [recResult] = await pool.query(
            `INSERT INTO seo_recommendations 
             (page_url, entity_type, entity_id, issue, priority, status, current_value, proposed_value, reason, expected_benefit, confidence, keywords, internal_link_suggestions)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              entity.url,
              entity.entityType,
              entity.id,
              aiOutput.issue || 'Metadata & Search Intent Optimization',
              aiOutput.priority || 'MEDIUM',
              initialStatus,
              JSON.stringify({
                title: entity.title,
                meta_description: entity.metaDescription,
                h1: entity.h1,
                image_alt: entity.imageAlt,
              }),
              JSON.stringify(proposedValueObj),
              aiOutput.reason || 'Aligns with Dubai commercial search intent and SERP limits without keyword stuffing.',
              aiOutput.expected_benefit || 'Boosts organic rankings and click-through rates from local search.',
              aiOutput.confidence || 0.88,
              JSON.stringify(aiOutput.keywords || ['printing in dubai', 'commercial printing uae']),
              JSON.stringify(aiOutput.internal_link_suggestions || []),
            ]
          )

          generatedRecommendations.push({
            id: recResult.insertId,
            page_url: entity.url,
            entity_type: entity.entityType,
            entity_id: entity.id,
            issue: aiOutput.issue,
            priority: aiOutput.priority,
            status: initialStatus,
            current_value: {
              title: entity.title,
              meta_description: entity.metaDescription,
              h1: entity.h1,
              image_alt: entity.imageAlt,
            },
            proposed_value: proposedValueObj,
            reason: aiOutput.reason,
            expected_benefit: aiOutput.expected_benefit,
            confidence: aiOutput.confidence,
            keywords: aiOutput.keywords,
            internal_link_suggestions: aiOutput.internal_link_suggestions,
            search_intent: searchIntent,
            readability_score: readabilityScore,
            faq_opportunities: aiOutput.faq_opportunities || [],
            safety: safetyResult,
          })
        }
      } catch (err) {
        console.warn(`[SeoAiAnalyzerService] Error analyzing ${entity.url}:`, err.message)
      }
    }

    return {
      success: true,
      message: `Generated ${generatedRecommendations.length} actionable SEO recommendations.`,
      recommendationsCount: generatedRecommendations.length,
      recommendations: generatedRecommendations,
    }
  }

  /**
   * Call external AI provider (Gemini / OpenAI)
   */
  async _callAiModel(entity, issues, config) {
    const { apiKey, provider, model } = config

    const systemPrompt = `You are a World-Class White-Hat Technical & On-Page SEO Architect for ONPRINT, a premier commercial printing company in Dubai, UAE.
Your mission is to provide high-CTR, high-relevance title tags, meta descriptions, search intent, and keyword enhancements adhering strictly to Google Search Essentials.

CRITICAL RULES:
1. Output MUST be strictly valid JSON without markdown fences.
2. STRICTLY NO KEYWORD STUFFING. Keep keyword usage natural and contextual.
3. Titles must be 45-60 chars ending with "| ONPRINT" or "Dubai | ONPRINT".
4. Meta descriptions must be 135-155 chars with value proposition and clear call-to-action.
5. Identify search intent: "Informational", "Navigational", "Commercial", or "Transactional".
6. Suggest 2-3 natural FAQs if appropriate for this page type.

REQUIRED JSON FORMAT:
{
  "priority": "HIGH" | "MEDIUM" | "LOW",
  "issue": "Specific concise description",
  "reason": "Technical rationale",
  "expected_benefit": "Estimated impact",
  "search_intent": "Commercial / Transactional",
  "suggested_title": "Optimized 45-60 char title",
  "suggested_meta_description": "Optimized 135-155 char description",
  "suggested_h1": "Clean primary heading",
  "suggested_image_alt": "Descriptive image ALT with context",
  "keywords": ["primary keyword", "secondary keyword", "location keyword"],
  "internal_link_suggestions": [{"target_url": "/services", "anchor_text": "commercial printing services"}],
  "faq_opportunities": [{"question": "Real customer question?", "answer": "Concise factual answer"}],
  "confidence": 0.92
}`

    const userPayload = {
      brand: 'ONPRINT',
      location: 'Dubai, UAE',
      page_url: entity.url,
      entity_type: entity.entityType,
      entity_name: entity.name,
      current_title: entity.title,
      current_meta_description: entity.metaDescription,
      current_h1: entity.h1,
      current_image_alt: entity.imageAlt,
      detected_issues: issues.map((i) => i.title),
      content_snippet: (entity.raw?.description || entity.raw?.short_description || entity.raw?.excerpt || '').slice(0, 500),
    }

    if (provider === 'gemini') {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
      const body = {
        contents: [
          {
            role: 'user',
            parts: [
              { text: systemPrompt },
              { text: `Analyze the following webpage entity and generate optimized SEO recommendations:\n\n${JSON.stringify(userPayload, null, 2)}` },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.2,
          maxOutputTokens: 1000,
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
          { role: 'user', content: `Analyze the following webpage entity and generate optimized SEO recommendations:\n\n${JSON.stringify(userPayload, null, 2)}` },
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
   * Deterministic High-Quality Rule Engine for automated SEO recommendations
   */
  _generateDeterministicRecommendation(entity, issues) {
    const name = entity.name || 'Commercial Printing'
    const type = entity.entityType

    let priority = 'MEDIUM'
    let issue = 'Metadata & Search Intent Optimization'

    if (issues.some((i) => i.severity === 'critical' || i.severity === 'high')) {
      priority = 'HIGH'
      issue = issues[0]?.title || 'Critical Missing Metadata'
    }

    let suggestedTitle = `${name} in Dubai | ONPRINT`
    if (type === 'product') {
      suggestedTitle = `${name} in Dubai | Premium Print & Custom Finishing | ONPRINT`
    } else if (type === 'category') {
      suggestedTitle = `${name} in Dubai | Commercial Printing Press | ONPRINT`
    } else if (type === 'service') {
      suggestedTitle = `${name} Dubai | Executive Print Services | ONPRINT`
    } else if (type === 'blog') {
      suggestedTitle = `${name} | ONPRINT Dubai Printing Guide`
    }

    if (suggestedTitle.length > 60) {
      suggestedTitle = `${name} in Dubai | ONPRINT`
    }

    let suggestedDesc = `Order custom ${name.toLowerCase()} in Dubai with ONPRINT. Premium cardstocks, rich Pantone fidelity, express same-day turnaround, and UAE doorstep delivery.`
    if (suggestedDesc.length > 155) {
      suggestedDesc = `Order ${name.toLowerCase()} in Dubai with ONPRINT. High-precision printing, luxury finishes, and fast UAE delivery.`
    }

    const suggestedH1 = `${name} in Dubai`
    const suggestedAlt = `${name} commercial printing in Dubai UAE`

    const keywords = [
      `${name.toLowerCase()} dubai`,
      `${name.toLowerCase()} printing dubai`,
      `commercial ${name.toLowerCase()} uae`,
      'onprint dubai',
    ]

    const linkSuggestions = [
      { target_url: '/get-a-quote', anchor_text: 'request a custom printing quote' },
      { target_url: '/categories', anchor_text: 'explore printing categories in Dubai' },
    ]

    const faqOpportunities = [
      {
        question: `What is the standard turnaround time for ${name.toLowerCase()} in Dubai?`,
        answer: `Standard turnaround is 24 to 48 hours, with express same-day dispatch available across Dubai for urgent orders.`,
      },
      {
        question: `Can I view paper stock and finish samples before production?`,
        answer: `Yes, ONPRINT provides complimentary sample swatches of our cotton card stocks, velvet lamination, and foil stamping across Dubai.`,
      },
    ]

    return {
      priority,
      issue,
      reason: `Optimizes title tag (${suggestedTitle.length} chars) and meta description (${suggestedDesc.length} chars) to maximize SERP click-through rate in UAE.`,
      expected_benefit: 'Improves local search relevance for Dubai corporate buyers and prevents snippet truncation.',
      search_intent: type === 'blog' ? 'Informational' : 'Commercial / Transactional',
      suggested_title: suggestedTitle,
      suggested_meta_description: suggestedDesc,
      suggested_h1: suggestedH1,
      suggested_image_alt: suggestedAlt,
      keywords,
      internal_link_suggestions: linkSuggestions,
      faq_opportunities: faqOpportunities,
      confidence: 0.90,
    }
  }
}

module.exports = new SeoAiAnalyzerService()
