import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Loader2 } from 'lucide-react'

const baseClasses =
  'group relative overflow-hidden inline-flex items-center justify-center gap-2 whitespace-nowrap font-bold tracking-tight transition-all duration-300 cursor-pointer rounded-full border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF65] disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]'

const variants = {
  primary:
    'border-[#D4AF65] bg-[#D4AF65] text-[#101D35] hover:bg-[#B89245] hover:border-[#B89245] shadow-[0_4px_14px_rgba(212,175,101,0.25)] hover:shadow-[0_8px_24px_rgba(184,146,69,0.35)]',
  accent:
    'border-[#D4AF65] bg-[#D4AF65] text-[#101D35] hover:bg-[#B89245] hover:border-[#B89245] shadow-[0_4px_14px_rgba(212,175,101,0.25)]',
  brass:
    'border-[#D4AF65] bg-gradient-to-r from-[#D4AF65] to-[#B89245] text-[#101D35] hover:brightness-105 shadow-sm',
  secondary:
    'border-[#101D35] bg-[#101D35] text-white hover:bg-[#1E2E4E] hover:border-[#1E2E4E] shadow-xs',
  outline:
    'border-[#E5E7EB] bg-white text-[#101D35] hover:border-[#101D35] hover:bg-[#F5F2EB] shadow-2xs',
  navyOutline:
    'border-white/80 bg-transparent text-white hover:bg-white hover:text-[#101D35] shadow-xs',
  ghost:
    'border-transparent bg-transparent text-[#343D4F] hover:text-[#101D35] hover:bg-[#F5F2EB]',
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
