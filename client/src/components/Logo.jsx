import React from 'react'
import logoImg from '../assets/logo.png'
import logoLightImg from '../assets/logo_light.png'
import logoIconImg from '../assets/logo_icon.png'
import logoIconLightImg from '../assets/logo_icon_light.png'

export default function Logo({
  className = '',
  variant = 'default', // 'default' (for light backgrounds) | 'light' (for dark backgrounds)
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl' | 'splash'
  showText = true,
  iconOnly = false,
}) {
  const isLight = variant === 'light'
  const isIcon = iconOnly || !showText

  let imgSrc = logoImg
  if (isIcon) {
    imgSrc = isLight ? logoIconLightImg : logoIconImg
  } else {
    imgSrc = isLight ? logoLightImg : logoImg
  }

  // Compact height mapping: controls logo height so headers and cards remain sleek and uncluttered.
  const heightMap = {
    sm: 'h-6 sm:h-7',
    md: 'h-8 sm:h-9',
    lg: 'h-10 sm:h-12',
    xl: 'h-14 sm:h-16',
    splash: 'h-20 sm:h-24',
  }

  const selectedHeight = heightMap[size] || heightMap.md

  return (
    <div className={`inline-flex items-center shrink-0 select-none ${className}`}>
      <img
        src={imgSrc}
        alt="ONPRINT"
        loading="eager"
        className={`w-auto ${selectedHeight} object-contain shrink-0`}
      />
    </div>
  )
}
