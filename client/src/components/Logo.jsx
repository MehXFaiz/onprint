import React from 'react'

export default function Logo({
  className = '',
  iconOnly = false,
  stacked = false,
  variant = 'default', // 'default' (dark text), 'light' (white text), 'orange'
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl'
}) {
  const heights = {
    sm: 'h-7',
    md: 'h-9',
    lg: 'h-12',
    xl: 'h-16',
    splash: 'h-24 sm:h-32',
  }

  const textSizes = {
    sm: 'text-sm tracking-[0.16em]',
    md: 'text-lg tracking-[0.18em]',
    lg: 'text-2xl tracking-[0.2em]',
    xl: 'text-3xl tracking-[0.22em]',
    splash: 'text-2xl sm:text-3xl tracking-[0.25em]',
  }

  const isLight = variant === 'light'
  const markColor = isLight ? '#FFFFFF' : '#141414'
  const textColor = isLight ? '#FFFFFF' : '#141414'
  const accentColor = '#F05B26'

  return (
    <div
      className={`inline-flex ${
        stacked ? 'flex-col items-center gap-2' : 'flex-row items-center gap-2.5'
      } select-none ${className}`}
    >
      {/* Icon Mark: The iconic 'P' with top-right Orange Fold Accent */}
      <svg
        className={`${heights[size] || heights.md} w-auto aspect-[160/190] shrink-0`}
        viewBox="0 0 160 190"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Stem of the P */}
        <line
          x1="36"
          y1="34"
          x2="36"
          y2="156"
          stroke={markColor}
          strokeWidth="25"
          strokeLinecap="round"
        />

        {/* Circular Loop of the P */}
        <path
          d="M 36 34 C 80 34 134 45 134 94 C 134 142 80 154 36 154"
          stroke={markColor}
          strokeWidth="25"
          fill="none"
          strokeLinecap="round"
        />

        {/* Cutout gap for the top-right corner */}
        <path
          d="M 98 25 L 148 75 L 148 25 Z"
          fill={isLight ? '#020202' : '#FFFFFF'}
        />

        {/* Top-Right Orange Triangle Accent */}
        <polygon
          points="104,10 148,10 148,54"
          fill={accentColor}
        />
      </svg>

      {/* Wordmark ONPRINT */}
      {!iconOnly && (
        <span
          className={`font-display font-black uppercase leading-none ${
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
