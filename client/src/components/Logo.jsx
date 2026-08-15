import React from 'react'

export default function Logo({
  className = '',
  variant = 'default', // 'default' (for light backgrounds) | 'light' (for dark backgrounds)
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl' | 'splash'
  showText = true,
  iconOnly = false,
}) {
  const isLight = variant === 'light'
  
  // Fill colors
  const primaryColor = isLight ? '#FFFFFF' : '#171717'
  const accentColor = '#A82F19' // ONPRINT brand accent

  const heightMap = {
    sm: 'h-10 sm:h-12',
    md: 'h-16 sm:h-20',
    lg: 'h-24 sm:h-28',
    xl: 'h-32 sm:h-36',
    splash: 'h-40 sm:h-52',
  }

  const selectedHeight = heightMap[size] || heightMap.md

  if (iconOnly) {
    return (
      <div className={`inline-flex items-center shrink-0 select-none ${className}`}>
        <svg
          viewBox="0 0 270 270"
          className={`w-auto object-contain ${selectedHeight}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Left Vertical Stem */}
          <rect x="36" y="30" width="34" height="215" rx="17" ry="17" fill={primaryColor} />
          
          {/* Outer Loop */}
          <path
            d="M 68,36 H 180 L 235,90 V 126 A 90,90 0 1,1 68,216"
            fill="none"
            stroke={primaryColor}
            strokeWidth="34"
            strokeLinecap="square"
          />
          
          {/* Accent Triangle */}
          <polygon points="182,30 240,30 240,88" fill={accentColor} />
        </svg>
      </div>
    )
  }

  return (
    <div className={`inline-flex items-center shrink-0 select-none ${className}`}>
      <svg
        viewBox="0 0 300 360"
        className={`w-auto object-contain ${selectedHeight}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Emblem Symbol */}
        <g id="symbol">
          {/* Left Vertical Rounded Stem */}
          <rect x="36" y="30" width="34" height="215" rx="17" ry="17" fill={primaryColor} />
          
          {/* Outer Circular Loop */}
          <path
            d="M 68,36 H 180 L 235,90 V 126 A 90,90 0 1,1 68,216"
            fill="none"
            stroke={primaryColor}
            strokeWidth="34"
            strokeLinecap="square"
          />
          
          {/* Accent Triangle */}
          <polygon points="182,30 240,30 240,88" fill={accentColor} />
        </g>
        
        {/* Wordmark */}
        {showText && (
          <text
            x="150"
            y="315"
            textAnchor="middle"
            fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            fontWeight="900"
            fontSize="34"
            letterSpacing="9"
            fill={primaryColor}
          >
            ONPRINT
          </text>
        )}
      </svg>
    </div>
  )
}
