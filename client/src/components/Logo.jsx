import React from 'react'

export default function Logo({
  className = '',
  variant = 'default', // 'default' (dark text), 'light' (white text), 'accent'
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl' | 'splash'
}) {
  const textSizes = {
    sm: 'text-lg sm:text-xl tracking-[0.14em]',
    md: 'text-2xl sm:text-3xl tracking-[0.16em]',
    lg: 'text-3xl sm:text-4xl tracking-[0.18em]',
    xl: 'text-4xl sm:text-5xl tracking-[0.2em]',
    splash: 'text-5xl sm:text-7xl tracking-[0.22em]',
  }

  const isLight = variant === 'light'
  const isAccent = variant === 'accent'
  const textColor = isAccent ? '#c63c22' : isLight ? '#FFFFFF' : '#141414'
  const accentColor = '#c63c22'

  return (
    <div className={`inline-flex items-center select-none whitespace-nowrap overflow-visible ${className}`}>
      {/* Text-based Logo ONPRINT */}
      <span
        className={`font-display font-black uppercase leading-none select-none ${
          textSizes[size] || textSizes.md
        }`}
        style={{ color: textColor }}
      >
        ON<span style={{ color: accentColor }}>PRINT</span>
      </span>
    </div>
  )
}

