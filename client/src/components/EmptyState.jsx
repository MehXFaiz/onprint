import React from 'react'

export default function EmptyState({ title, note, icon: Icon }) {
  const renderIcon = () => {
    if (!Icon) return null
    if (React.isValidElement(Icon)) return Icon
    if (typeof Icon === 'function' || typeof Icon === 'string' || (typeof Icon === 'object' && Icon !== null && Icon.$$typeof)) {
      const Component = Icon
      return <Component className="h-6 w-6 text-secondary" strokeWidth={1.5} aria-hidden="true" />
    }
    return null
  }

  return (
    <div className="flex flex-col items-center gap-3 border border-dashed border-border bg-surface px-6 py-16 text-center">
      {renderIcon()}
      <p className="font-display text-base font-semibold text-primary">{title}</p>
      {note && <p className="max-w-sm text-sm text-secondary">{note}</p>}
    </div>
  )
}

