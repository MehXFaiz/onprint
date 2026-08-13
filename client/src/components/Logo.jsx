import React from 'react'

export default function Logo({
  className = '',
  iconOnly = false,
  stacked = false,
  variant = 'default', // 'default' (dark text), 'light' (white text)
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl' | 'splash'
}) {
  const iconHeights = {
    sm: 'h-6',
    md: 'h-9 sm:h-10',
    lg: 'h-12',
    xl: 'h-16',
    splash: 'h-20 sm:h-28',
  }

  const textSizes = {
    sm: 'text-base tracking-[0.14em]',
    md: 'text-2xl sm:text-3xl tracking-[0.16em]',
    lg: 'text-3xl tracking-[0.18em]',
    xl: 'text-4xl tracking-[0.2em]',
    splash: 'text-4xl sm:text-6xl tracking-[0.22em]',
  }

  const isLight = variant === 'light'
  const markColor = isLight ? '#FFFFFF' : '#141414'
  const textColor = isLight ? '#FFFFFF' : '#141414'
  const accentColor = '#F05B26'

  return (
    <div
      className={`inline-flex items-center ${
        stacked ? 'flex-col justify-center gap-3' : 'flex-row gap-3'
      } select-none whitespace-nowrap overflow-visible ${className}`}
    >
      {/* Sleek Uncropped Full D/O Brand Mark with Top-Right Orange Corner Accent */}
      <svg
        className={`${iconHeights[size] || iconHeights.md} w-auto shrink-0 overflow-visible`}
        viewBox="-4 -4 118 118"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Main Loop (Vertical Stem + Curved D-loop) */}
        <path
          d="M 22 22 L 22 88 C 22 88 22 96 34 96 C 60 96 78 80 78 55 C 78 30 60 22 34 22 Z"
          stroke={markColor}
          strokeWidth="15"
          strokeLinejoin="round"
          strokeLinecap="round"
          fill="none"
        />

        {/* Top-Right Orange Corner Triangle */}
        <polygon points="70,6 98,6 98,34" fill={accentColor} />
      </svg>

      {/* Wordmark ONPRINT */}
      {!iconOnly && (
        <span
          className={`font-display font-black uppercase leading-none select-none ${
            textSizes[size] || textSizes.md
          }`}
          style={{ color: textColor }}
        >
          ONPRINT
        </span>
      )}
    </div>
  )
}
