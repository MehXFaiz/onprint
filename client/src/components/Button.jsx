import { Link } from 'react-router-dom'
import { ArrowUpRight, Loader2 } from 'lucide-react'

const baseClasses =
  'group inline-flex items-center justify-center gap-2.5 whitespace-nowrap font-semibold tracking-wide transition-all duration-200 cursor-pointer rounded-lg border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]'

const variants = {
  primary: 'border-primary bg-primary text-background hover:bg-accent hover:border-accent shadow-sm',
  accent: 'border-accent bg-accent text-white hover:bg-accent-hover hover:border-accent-hover shadow-md shadow-accent/20',
  secondary: 'border-border bg-surface text-primary hover:border-primary hover:bg-background shadow-xs',
  outline: 'border-primary/25 bg-transparent text-primary hover:border-accent hover:text-accent',
  ghost: 'border-transparent bg-transparent text-primary hover:text-accent hover:bg-accent-soft/30',
}

const sizes = {
  sm: 'px-3.5 py-2 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
}

export default function Button({
  to,
  href,
  variant = 'primary',
  size = 'md',
  icon = true,
  loading = false,
  className = '',
  children,
  ...props
}) {
  const classes = `${baseClasses} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`

  const content = (
    <>
      {loading && <Loader2 className="h-4 w-4 shrink-0 animate-spin text-current" />}
      <span>{children}</span>
      {!loading && icon && (
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
    <button type="button" disabled={loading || props.disabled} className={classes} {...props}>
      {content}
    </button>
  )
}

