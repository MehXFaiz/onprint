import React from 'react'
import { Link } from 'react-router-dom'
import Button from './Button'

export default function EmptyState({
  title = 'No items found',
  note,
  icon: Icon,
  actionLabel,
  actionTo,
  onAction,
  className = '',
}) {
  const renderIcon = () => {
    if (!Icon) return null
    if (React.isValidElement(Icon)) return Icon
    if (typeof Icon === 'function' || typeof Icon === 'string' || (typeof Icon === 'object' && Icon !== null && Icon.$$typeof)) {
      const IconComp = Icon
      return <IconComp className="h-8 w-8 text-[#A82F19]" strokeWidth={1.5} aria-hidden="true" />
    }
    return null
  }

  return (
    <div className={`flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-black/15 bg-[#F9F8F6] px-6 py-16 text-center ${className}`}>
      {renderIcon()}
      <p className="font-display text-base font-bold text-black">{title}</p>
      {note && <p className="max-w-sm text-sm text-black/65 leading-relaxed">{note}</p>}
      {(actionLabel && (actionTo || onAction)) && (
        <div className="mt-2">
          {actionTo ? (
            <Link to={actionTo}>
              <Button variant="accent" size="sm">
                {actionLabel}
              </Button>
            </Link>
          ) : (
            <Button variant="accent" size="sm" onClick={onAction}>
              {actionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

