import React from 'react'
import logoImg from '../assets/logo.png'
import logoLightImg from '../assets/logo_light.png'

export default function Logo({
  className = '',
  variant = 'default', // 'default' (black/orange) | 'light' (white/orange for dark backgrounds)
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl' | 'splash'
}) {
  const heightMap = {
    sm: 'h-7 sm:h-8',
    md: 'h-9 sm:h-11',
    lg: 'h-12 sm:h-14',
    xl: 'h-16 sm:h-20',
    splash: 'h-24 sm:h-32',
  }

  const isLight = variant === 'light'
  const logoSource = isLight ? logoLightImg : logoImg

  return (
    <div className={`inline-flex items-center shrink-0 select-none ${className}`}>
      <img
        src={logoSource}
        alt="ONPRINT — Professional Printing & Branding Solutions"
        loading="eager"
        className={`w-auto object-contain ${
          heightMap[size] || heightMap.md
        }`}
      />
    </div>
  )
}
