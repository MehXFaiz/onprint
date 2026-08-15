import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Loader2 } from 'lucide-react'

const baseClasses =
  'group inline-flex items-center justify-center gap-2.5 whitespace-nowrap font-bold tracking-wide transition-all duration-300 cursor-pointer rounded-xl border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A82F19] disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]'

const variants = {
  primary: 'border-[#000000] bg-[#000000] text-[#FFFFFF] hover:bg-[#A82F19] hover:border-[#A82F19] shadow-sm',
  accent: 'border-[#A82F19] bg-[#A82F19] text-[#FFFFFF] hover:bg-[#8f2513] hover:border-[#8f2513] shadow-md shadow-[#A82F19]/20',
  secondary: 'border-[#000000] bg-[#FFFFFF] text-[#000000] hover:border-[#A82F19] hover:text-[#A82F19] shadow-xs',
  outline: 'border-[#000000]/25 bg-transparent text-[#000000] hover:border-[#A82F19] hover:text-[#A82F19]',
  ghost: 'border-transparent bg-transparent text-[#000000] hover:text-[#A82F19] hover:bg-[#A82F19]/10',
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

  let iconContent = null
  if (!loading) {
    if (icon === true) {
      iconContent = (
        <ArrowUpRight
          className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          strokeWidth={2}
        />
      )
    } else if (typeof icon === 'function' || typeof icon === 'string' || (typeof icon === 'object' && icon !== null && icon.$$typeof)) {
      const CustomIcon = icon
      iconContent = <CustomIcon className="h-4 w-4 shrink-0" />
    }
  }

  const content = (
    <>
      {loading && <Loader2 className="h-4 w-4 shrink-0 animate-spin text-current" />}
      <span>{children}</span>
      {iconContent}
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

