import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Loader2 } from 'lucide-react'

const baseClasses =
  'group relative overflow-hidden inline-flex items-center justify-center gap-2.5 whitespace-nowrap font-bold tracking-wide transition-all duration-300 cursor-pointer rounded-2xl border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B83A22] disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] hover:-translate-y-0.5'

const variants = {
  primary:
    'border-[#181411] bg-[#181411] text-[#FAF7F2] hover:bg-[#B83A22] hover:border-[#B83A22] shadow-[0_8px_22px_-6px_rgba(24,20,17,0.35)] hover:shadow-[0_14px_28px_-6px_rgba(184,58,34,0.4)]',
  accent:
    'border-[#B83A22] bg-gradient-to-r from-[#B83A22] to-[#962C17] text-[#FFFFFF] hover:from-[#C94329] hover:to-[#A82F19] hover:border-[#A82F19] shadow-[0_10px_24px_-6px_rgba(184,58,34,0.38)] hover:shadow-[0_16px_32px_-6px_rgba(184,58,34,0.48)]',
  brass:
    'border-[#C89D54]/60 bg-gradient-to-r from-[#C89D54] to-[#B3873E] text-[#181411] hover:from-[#D4AE6A] hover:to-[#C89D54] shadow-[0_10px_24px_-6px_rgba(200,157,84,0.35)]',
  secondary:
    'border-[#D2C7B8] bg-[#FFFFFF] text-[#181411] hover:border-[#B83A22] hover:text-[#B83A22] hover:bg-[#FAF7F2] shadow-xs',
  outline:
    'border-[#D2C7B8] bg-[#FAF7F2]/80 text-[#181411] hover:border-[#B83A22] hover:text-[#B83A22] hover:bg-white shadow-2xs',
  ghost:
    'border-transparent bg-transparent text-[#181411] hover:text-[#B83A22] hover:bg-[#B83A22]/10',
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
