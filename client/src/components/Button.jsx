import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'

const base =
  'group inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold tracking-wide transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-40'

const variants = {
  primary: 'bg-primary px-6 py-3.5 text-background hover:bg-accent',
  accent: 'bg-accent px-6 py-3.5 text-white hover:bg-accent-hover',
  outline: 'border border-primary/25 px-6 py-3.5 text-primary hover:border-accent hover:text-accent',
  ghost: 'text-primary hover:text-accent',
}

export default function Button({ to, href, variant = 'primary', icon = true, className = '', children, ...props }) {
  const classes = `${base} ${variants[variant]} ${className}`
  const content = (
    <>
      <span>{children}</span>
      {icon && (
        <ArrowUpRight
          className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          strokeWidth={2}
        />
      )}
    </>
  )

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {content}
      </Link>
    )
  }
  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {content}
      </a>
    )
  }
  return (
    <button type="button" className={classes} {...props}>
      {content}
    </button>
  )
}
