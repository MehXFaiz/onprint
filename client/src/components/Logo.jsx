import React from 'react'

export default function Logo({
  className = '',
  variant = 'default', // 'default' (dark text) | 'light' (white text for dark backgrounds)
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl' | 'splash'
  showText = true,
}) {
  const isLight = variant === 'light'

  // Heights for container alignment
  const containerHeights = {
    sm: 'h-8 sm:h-9',
    md: 'h-10 sm:h-11',
    lg: 'h-12 sm:h-14',
    xl: 'h-16 sm:h-20',
    splash: 'h-24 sm:h-32',
  }

  const textSizes = {
    sm: 'text-base sm:text-lg',
    md: 'text-xl sm:text-2xl',
    lg: 'text-2xl sm:text-3xl',
    xl: 'text-4xl sm:text-5xl',
    splash: 'text-5xl sm:text-7xl',
  }

  const iconSizes = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
    xl: 'h-14 w-14',
    splash: 'h-20 w-20',
  }

  const primaryColor = isLight ? '#FFFFFF' : '#000000'
  const accentColor = '#A82F19' // ONPRINT Signature Crimson Accent

  return (
    <div className={`inline-flex items-center gap-2.5 shrink-0 select-none ${containerHeights[size] || containerHeights.md} ${className}`}>
      {/* ONPRINT Vector Mark Symbol */}
      <svg
        viewBox="0 0 240 240"
        className={`${iconSizes[size] || iconSizes.md} shrink-0`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="ONPRINT Logo Icon"
      >
        {/* Left Vertical Rounded Stem */}
        <rect x="30" y="25" width="32" height="190" rx="16" fill={primaryColor} />
        {/* Outer Circular Loop */}
        <path
          d="M 62,37 H 145 L 195,87 V 110 A 75,75 0 1,1 62,185"
          stroke={primaryColor}
          strokeWidth="28"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Top Right Accent Triangle */}
        <polygon points="148,25 200,25 200,77" fill={accentColor} />
      </svg>

      {/* Wordmark */}
      {showText && (
        <span
          className={`font-display font-black uppercase tracking-[0.08em] leading-none ${
            textSizes[size] || textSizes.md
          }`}
          style={{ color: primaryColor }}
        >
          ON<span style={{ color: accentColor }}>PRINT</span>
        </span>
      )}
    </div>
  )
}
