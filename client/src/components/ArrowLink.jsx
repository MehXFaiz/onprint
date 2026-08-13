import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function ArrowLink({ to, href, onClick, children, className = '' }) {
  const classes = `group inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-accent ${className}`
  const content = (
    <>
      <span className="border-b border-current pb-0.5">{children}</span>
      <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" strokeWidth={2} aria-hidden="true" />
    </>
  )

  if (to) {
    return (
      <Link to={to} className={classes}>
        {content}
      </Link>
    )
  }
  if (href) {
    return (
      <a href={href} className={classes}>
        {content}
      </a>
    )
  }
  return (
    <button type="button" onClick={onClick} className={classes}>
      {content}
    </button>
  )
}
