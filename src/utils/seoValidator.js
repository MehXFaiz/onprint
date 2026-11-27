/**
 * ONPRINT Automated SEO Audit Utility
 * Validates on-page SEO factors in real-time
 */

export function auditCurrentPage() {
  const issues = []
  const passes = []

  // 1. Title Audit
  const title = document.title || ''
  if (!title) {
    issues.push({ level: 'error', rule: 'Page Title', message: 'Page title is missing.' })
  } else if (title.length < 30) {
    issues.push({ level: 'warning', rule: 'Page Title', message: `Title is too short (${title.length} chars). Target: 45–65 chars.` })
  } else if (title.length > 70) {
    issues.push({ level: 'warning', rule: 'Page Title', message: `Title may be truncated in SERPs (${title.length} chars). Target: 45–65 chars.` })
  } else {
    passes.push({ rule: 'Page Title', message: `Title is well-optimized (${title.length} chars): "${title}"` })
  }

  // 2. Meta Description Audit
  const metaDesc = document.querySelector('meta[name="description"]')?.getAttribute('content') || ''
  if (!metaDesc) {
    issues.push({ level: 'error', rule: 'Meta Description', message: 'Meta description is missing.' })
  } else if (metaDesc.length < 70) {
    issues.push({ level: 'warning', rule: 'Meta Description', message: `Meta description is short (${metaDesc.length} chars). Target: 130–165 chars.` })
  } else if (metaDesc.length > 175) {
    issues.push({ level: 'warning', rule: 'Meta Description', message: `Meta description may be truncated (${metaDesc.length} chars). Target: 130–165 chars.` })
  } else {
    passes.push({ rule: 'Meta Description', message: `Meta description length is ideal (${metaDesc.length} chars).` })
  }

  // 3. H1 Heading Audit
  const h1Elements = document.querySelectorAll('h1')
  if (h1Elements.length === 0) {
    issues.push({ level: 'error', rule: 'H1 Heading', message: 'No <h1> heading found on the page.' })
  } else if (h1Elements.length > 1) {
    issues.push({ level: 'warning', rule: 'H1 Heading', message: `Found ${h1Elements.length} <h1> headings. Google recommends exactly ONE primary <h1> per page.` })
  } else {
    passes.push({ rule: 'H1 Heading', message: `Exactly one primary <h1> found: "${h1Elements[0].textContent.trim().substring(0, 60)}..."` })
  }

  // 4. Canonical URL Audit
  const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href') || ''
  if (!canonical) {
    issues.push({ level: 'error', rule: 'Canonical URL', message: 'Canonical tag is missing.' })
  } else if (!canonical.startsWith('https://')) {
    issues.push({ level: 'warning', rule: 'Canonical URL', message: `Canonical should use production HTTPS: "${canonical}"` })
  } else {
    passes.push({ rule: 'Canonical URL', message: `Valid production canonical URL: "${canonical}"` })
  }

  // 5. Open Graph Audit
  const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute('content')
  const ogDesc = document.querySelector('meta[property="og:description"]')?.getAttribute('content')
  const ogImage = document.querySelector('meta[property="og:image"]')?.getAttribute('content')
  if (!ogTitle || !ogDesc || !ogImage) {
    issues.push({ level: 'warning', rule: 'Open Graph', message: 'Incomplete Open Graph tags for social preview.' })
  } else {
    passes.push({ rule: 'Open Graph', message: 'Open Graph title, description, and preview image are present.' })
  }

  // 6. Image ALT Tags Audit
  const images = Array.from(document.querySelectorAll('img'))
  const missingAlt = images.filter((img) => !img.getAttribute('alt') && !img.getAttribute('aria-hidden'))
  if (missingAlt.length > 0) {
    issues.push({ level: 'warning', rule: 'Image ALT Text', message: `${missingAlt.length} of ${images.length} images are missing descriptive ALT text.` })
  } else {
    passes.push({ rule: 'Image ALT Text', message: `All ${images.length} images have ALT attributes.` })
  }

  // 7. Structured Data (JSON-LD) Audit
  const ldScripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
  if (ldScripts.length === 0) {
    issues.push({ level: 'warning', rule: 'Structured Data', message: 'No Schema.org JSON-LD structured data detected.' })
  } else {
    let validJsonCount = 0
    ldScripts.forEach((s) => {
      try {
        JSON.parse(s.textContent)
        validJsonCount++
      } catch {
        // error
      }
    })
    passes.push({ rule: 'Structured Data', message: `Found ${validJsonCount} valid Schema.org JSON-LD scripts.` })
  }

  const score = Math.max(0, Math.round(100 - (issues.filter((i) => i.level === 'error').length * 25 + issues.filter((i) => i.level === 'warning').length * 10)))

  return {
    score,
    url: window.location.href,
    title,
    issues,
    passes,
  }
}
