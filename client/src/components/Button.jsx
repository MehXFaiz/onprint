import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Loader2 } from 'lucide-react'

const baseClasses =
  'group relative overflow-hidden inline-flex items-center justify-center gap-2 max-w-full text-center leading-snug sm:whitespace-nowrap font-bold tracking-tight transition-all duration-300 cursor-pointer rounded-full border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#795C43] disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]'

const variants = {
  primary:
    'border-[#795C43] bg-[#795C43] text-white hover:bg-[#5D442E] hover:border-[#5D442E] shadow-[0_4px_14px_rgba(121,92,67,0.25)] hover:shadow-[0_8px_24px_rgba(121,92,67,0.38)]',
  accent:
    'border-[#C5A989] bg-[#C5A989] text-[#352719] hover:bg-[#A98968] hover:border-[#A98968] hover:text-white shadow-[0_4px_14px_rgba(197,169,137,0.28)]',
  secondary:
    'border-[#DED2C1] bg-[#FAF8F3] text-[#352719] hover:bg-[#EDE3D5] hover:border-[#C5A989] hover:text-[#795C43] shadow-xs',
  outline:
    'border-[#795C43] bg-transparent text-[#795C43] hover:border-[#795C43] hover:bg-[#795C43] hover:text-white shadow-2xs',
  darkOutline:
    'border-[#352719] bg-transparent text-[#352719] hover:bg-[#352719] hover:text-white hover:border-[#352719] shadow-xs',
  navyOutline:
    'border-[#DED2C1] bg-[#EDE3D5] text-[#352719] hover:border-[#795C43] hover:text-[#795C43] shadow-xs',
  whatsapp:
    'border-[#25D366] bg-[#25D366] text-white hover:bg-[#20ba59] hover:border-[#20ba59] shadow-sm shadow-emerald-600/20',
  ghost:
    'border-transparent bg-transparent text-[#756657] hover:text-[#795C43] hover:bg-[#EDE3D5]',
}

const sizes = {
  sm: 'px-3.5 py-2 text-xs',
  md: 'px-4 sm:px-5 py-2.5 text-xs sm:text-sm',
  lg: 'px-5 sm:px-7 py-3 sm:py-3.5 text-sm sm:text-base',
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
          className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          strokeWidth={2.2}
        />
      )
    } else if (React.isValidElement(icon)) {
      iconContent = icon
    } else if (icon) {
      const CustomIcon = icon
      iconContent = <CustomIcon className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:scale-110" />
    }
  }

  const content = (
    <>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -translate-x-[150%] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] transition-transform duration-700 ease-out group-hover:translate-x-[150%]"
      />
      {loading && <Loader2 className="h-4 w-4 shrink-0 animate-spin text-current" />}
      <span className="relative z-10">{children}</span>
      <span className="relative z-10 inline-flex items-center">{iconContent}</span>
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
    const isExternal = href.startsWith('http') || href.startsWith('tel:') || href.startsWith('mailto:')
    return (
      <a
        href={href}
        className={classes}
        target={isExternal && href.startsWith('http') ? '_blank' : undefined}
        rel={isExternal && href.startsWith('http') ? 'noopener noreferrer' : undefined}
        {...props}
      >
        {content}
      </a>
    )
  }

  return (
    <button type="button" className={classes} disabled={loading} {...props}>
      {content}
    </button>
  )
}
