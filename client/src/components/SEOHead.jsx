import { useEffect } from 'react'

const DEFAULT_SITE_URL = 'https://0nprint.com'
const SITE_URL = (import.meta.env.VITE_SITE_URL || DEFAULT_SITE_URL).replace(/\/$/, '')
const DEFAULT_IMAGE = `${SITE_URL}/logo_icon.png`
const SITE_NAME = 'ONPRINT'

/**
 * Standard Organization & Local Business Schema for ONPRINT Dubai
 */
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `${SITE_URL}/#organization`,
  name: 'ONPRINT',
  legalName: 'ONPRINT Printing & Branding Solutions',
  url: SITE_URL,
  logo: `${SITE_URL}/logo_icon.png`,
  image: `${SITE_URL}/logo_icon.png`,
  description:
    'ONPRINT is Dubai’s premier physical branding & commercial printing press. Specializing in executive stationery, luxury packaging, corporate gifts, large-format rollups, and precision digital printing across the UAE.',
  telephone: '+9714800PRINT',
  email: 'info@onprint.ae',
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Al Quoz Industrial Area 3',
    addressLocality: 'Dubai',
    addressRegion: 'Dubai',
    postalCode: '00000',
    addressCountry: 'AE',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 25.1328,
    longitude: 55.2348,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '08:30',
      closes: '18:30',
    },
  ],
  sameAs: [
    'https://www.facebook.com/onprintdubai',
    'https://www.instagram.com/onprintdubai',
    'https://www.linkedin.com/company/onprintdubai',
  ],
  areaServed: [
    { '@type': 'City', name: 'Dubai' },
    { '@type': 'City', name: 'Abu Dhabi' },
    { '@type': 'City', name: 'Sharjah' },
    { '@type': 'Country', name: 'United Arab Emirates' },
  ],
}

/**
 * Website Sitelinks Searchbox Schema
 */
export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: SITE_URL,
  name: 'ONPRINT Printing Dubai',
  publisher: {
    '@id': `${SITE_URL}/#organization`,
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/products?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
}

function setMetaTag(attributeName, attributeValue, contentValue) {
  if (!contentValue) return
  let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attributeName, attributeValue)
    document.head.appendChild(element)
  }
  element.setAttribute('content', contentValue)
}

function setCanonicalUrl(url) {
  let link = document.querySelector('link[rel="canonical"]')
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', 'canonical')
    document.head.appendChild(link)
  }
  link.setAttribute('href', url)
}

function setStructuredDataScript(id, schemaData) {
  let script = document.getElementById(id)
  if (!schemaData) {
    if (script) script.remove()
    return
  }
  if (!script) {
    script = document.createElement('script')
    script.id = id
    script.type = 'application/ld+json'
    document.head.appendChild(script)
  }
  script.textContent = JSON.stringify(schemaData)
}

/**
 * SEOHead Component
 * Manages Title, Meta Tags, Open Graph, Twitter Cards, Canonicals, and JSON-LD Structured Data
 */
export default function SEOHead({
  title,
  description,
  keywords,
  canonicalPath = '',
  canonicalUrl = '',
  ogImage,
  ogType = 'website',
  noindex = false,
  structuredData,
  breadcrumbs,
  product,
  service,
  faqList,
  blogArticle,
}) {
  const fullTitle = title
    ? title.includes('ONPRINT')
      ? title
      : `${title} | ONPRINT Dubai`
    : 'Printing Company in Dubai | ONPRINT – Printing & Branding Solutions'

  const metaDesc =
    description ||
    'ONPRINT is Dubai’s premier printing company. Precision digital & offset printing, corporate gifts, business cards, office stationery, packaging, and large-format signage in UAE.'

  const effectiveCanonical =
    canonicalUrl ||
    (canonicalPath.startsWith('http')
      ? canonicalPath
      : `${SITE_URL}${canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`}`)

  const effectiveImage = ogImage
    ? ogImage.startsWith('http')
      ? ogImage
      : `${SITE_URL}${ogImage.startsWith('/') ? ogImage : `/${ogImage}`}`
    : DEFAULT_IMAGE

  useEffect(() => {
    // 1. Update Document Title
    document.title = fullTitle

    // 2. Standard Meta Tags
    setMetaTag('name', 'description', metaDesc)
    if (keywords) setMetaTag('name', 'keywords', keywords)
    setMetaTag('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large')

    // 3. Canonical Tag
    setCanonicalUrl(effectiveCanonical)

    // 4. Open Graph Tags
    setMetaTag('property', 'og:site_name', SITE_NAME)
    setMetaTag('property', 'og:title', fullTitle)
    setMetaTag('property', 'og:description', metaDesc)
    setMetaTag('property', 'og:type', ogType)
    setMetaTag('property', 'og:url', effectiveCanonical)
    setMetaTag('property', 'og:image', effectiveImage)
    setMetaTag('property', 'og:locale', 'en_AE')

    // 5. Twitter Card Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image')
    setMetaTag('name', 'twitter:title', fullTitle)
    setMetaTag('name', 'twitter:description', metaDesc)
    setMetaTag('name', 'twitter:image', effectiveImage)

    // 6. Base Organization & WebSite Schemas
    setStructuredDataScript('onprint-schema-organization', organizationSchema)
    setStructuredDataScript('onprint-schema-website', websiteSchema)

    // 7. Breadcrumbs Schema
    if (Array.isArray(breadcrumbs) && breadcrumbs.length > 0) {
      const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((b, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: b.name,
          item: b.url.startsWith('http') ? b.url : `${SITE_URL}${b.url.startsWith('/') ? b.url : `/${b.url}`}`,
        })),
      }
      setStructuredDataScript('onprint-schema-breadcrumbs', breadcrumbSchema)
    } else {
      setStructuredDataScript('onprint-schema-breadcrumbs', null)
    }

    // 8. Product Schema
    if (product) {
      const productImage = product.images?.[0] || product.image || DEFAULT_IMAGE
      const productSchema = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description || product.shortDescription || metaDesc,
        image: productImage.startsWith('http') ? productImage : `${SITE_URL}${productImage.startsWith('/') ? productImage : `/${productImage}`}`,
        sku: product.product_key || `ONP-${product.id || '001'}`,
        brand: {
          '@type': 'Brand',
          name: 'ONPRINT',
        },
        offers: {
          '@type': 'Offer',
          url: effectiveCanonical,
          priceCurrency: 'AED',
          price: (product.price || 50).toFixed(2),
          priceValidUntil: '2027-12-31',
          availability: 'https://schema.org/InStock',
          itemCondition: 'https://schema.org/NewCondition',
          seller: {
            '@type': 'Organization',
            name: 'ONPRINT Dubai',
          },
        },
      }
      setStructuredDataScript('onprint-schema-product', productSchema)
    } else {
      setStructuredDataScript('onprint-schema-product', null)
    }

    // 9. Service Schema
    if (service) {
      const serviceImage = service.image || DEFAULT_IMAGE
      const serviceSchema = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: service.name,
        description: service.description || service.shortDescription || metaDesc,
        image: serviceImage.startsWith('http') ? serviceImage : `${SITE_URL}${serviceImage.startsWith('/') ? serviceImage : `/${serviceImage}`}`,
        provider: {
          '@type': 'LocalBusiness',
          name: 'ONPRINT Dubai',
          url: SITE_URL,
        },
        areaServed: {
          '@type': 'Country',
          name: 'United Arab Emirates',
        },
      }
      setStructuredDataScript('onprint-schema-service', serviceSchema)
    } else {
      setStructuredDataScript('onprint-schema-service', null)
    }

    // 10. FAQPage Schema
    if (Array.isArray(faqList) && faqList.length > 0) {
      const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqList.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      }
      setStructuredDataScript('onprint-schema-faq', faqSchema)
    } else {
      setStructuredDataScript('onprint-schema-faq', null)
    }

    // 11. BlogPosting Schema
    if (blogArticle) {
      const blogImage = blogArticle.featuredImage || blogArticle.featured_image || DEFAULT_IMAGE
      const blogSchema = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: blogArticle.title,
        description: blogArticle.excerpt || metaDesc,
        image: blogImage.startsWith('http') ? blogImage : `${SITE_URL}${blogImage.startsWith('/') ? blogImage : `/${blogImage}`}`,
        author: {
          '@type': 'Organization',
          name: blogArticle.author_name || blogArticle.author || 'ONPRINT Editorial Team',
          url: SITE_URL,
        },
        publisher: {
          '@type': 'Organization',
          name: 'ONPRINT',
          logo: {
            '@type': 'ImageObject',
            url: `${SITE_URL}/logo_icon.png`,
          },
        },
        datePublished: blogArticle.publishedAt || blogArticle.published_at || new Date().toISOString(),
        dateModified: blogArticle.updatedAt || blogArticle.updated_at || new Date().toISOString(),
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': effectiveCanonical,
        },
      }
      setStructuredDataScript('onprint-schema-blog', blogSchema)
    } else {
      setStructuredDataScript('onprint-schema-blog', null)
    }

    // 12. Custom Structured Data
    if (structuredData) {
      setStructuredDataScript('onprint-schema-custom', structuredData)
    } else {
      setStructuredDataScript('onprint-schema-custom', null)
    }
  }, [
    fullTitle,
    metaDesc,
    keywords,
    effectiveCanonical,
    effectiveImage,
    ogType,
    noindex,
    breadcrumbs,
    product,
    service,
    faqList,
    blogArticle,
    structuredData,
  ])

  return null
}
