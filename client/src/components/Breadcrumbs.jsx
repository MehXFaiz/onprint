import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

const SITE_URL = 'https://0nprint.com'

/**
 * Breadcrumbs Component with Schema Markup
 * Props:
 *  - items: Array of { name: string, path?: string }
 *  - className: Optional additional CSS classes
 */
export default function Breadcrumbs({ items = [], className = '' }) {
  const location = useLocation()
  
  if (!items || items.length === 0) return null

  const allItems = [{ name: 'Home', path: '/' }, ...items]

  // Generate BreadcrumbList schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: allItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.path ? (item.path.startsWith('http') ? item.path : `${SITE_URL}${item.path}`) : `${SITE_URL}${location.pathname}`,
    })),
  }

  // Inject schema into document head
  if (typeof document !== 'undefined') {
    let script = document.getElementById('onprint-schema-breadcrumbs')
    if (!script) {
      script = document.createElement('script')
      script.id = 'onprint-schema-breadcrumbs'
      script.type = 'application/ld+json'
      document.head.appendChild(script)
    }
    script.textContent = JSON.stringify(breadcrumbSchema)
  }

  return (
    <nav aria-label="Breadcrumbs" className={`mb-6 text-xs font-semibold ${className}`}>
      <ol className="flex flex-wrap items-center gap-1.5 text-secondary" itemScope itemType="https://schema.org/BreadcrumbList">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1
          return (
            <li key={index} className="flex items-center gap-1.5" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <meta itemProp="position" content={index + 1} />
              {index > 0 && <ChevronRight className="h-3 w-3 text-secondary/50 shrink-0" />}
              {isLast || !item.path ? (
                <span className="font-bold text-primary truncate max-w-[200px] sm:max-w-xs" aria-current="page" itemProp="name">
                  {item.name}
                </span>
              ) : (
                <Link
                  to={item.path}
                  className="flex items-center gap-1 transition-colors hover:text-accent hover:underline underline-offset-2"
                  itemProp="item"
                >
                  {index === 0 && <Home className="h-3.5 w-3.5" />}
                  <span itemProp="name">{item.name}</span>
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
