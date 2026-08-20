import { Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

/**
 * Breadcrumbs Component
 * Props:
 *  - items: Array of { name: string, path?: string }
 *  - className: Optional additional CSS classes
 */
export default function Breadcrumbs({ items = [], className = '' }) {
  if (!items || items.length === 0) return null

  const allItems = [{ name: 'Home', path: '/' }, ...items]

  return (
    <nav aria-label="Breadcrumbs" className={`mb-6 text-xs font-semibold ${className}`}>
      <ol className="flex flex-wrap items-center gap-1.5 text-secondary">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1
          return (
            <li key={index} className="flex items-center gap-1.5">
              {index > 0 && <ChevronRight className="h-3 w-3 text-secondary/50 shrink-0" />}
              {isLast || !item.path ? (
                <span className="font-bold text-primary truncate max-w-[200px] sm:max-w-xs" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <Link
                  to={item.path}
                  className="flex items-center gap-1 transition-colors hover:text-accent hover:underline underline-offset-2"
                >
                  {index === 0 && <Home className="h-3.5 w-3.5" />}
                  <span>{item.name}</span>
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
