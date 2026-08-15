import React from 'react'
import logoImg from '../assets/logo.png'
import logoLightImg from '../assets/logo_light.png'

export default function Logo({
  className = '',
  variant = 'default', // 'default' (for light backgrounds) | 'light' (for dark backgrounds)
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl' | 'splash'
}) {
  const isLight = variant === 'light'
  const logoSource = isLight ? logoLightImg : logoImg

  const heightMap = {
    sm: 'h-8 sm:h-9',
    md: 'h-10 sm:h-12',
    lg: 'h-14 sm:h-16',
    xl: 'h-20 sm:h-24',
    splash: 'h-28 sm:h-36',
  }

  return (
    <div className={`inline-flex items-center shrink-0 select-none ${className}`}>
      <img
        src={logoSource}
        alt="ONPRINT"
        loading="eager"
        className={`w-auto object-contain ${heightMap[size] || heightMap.md}`}
      />
    </div>
  )
}
