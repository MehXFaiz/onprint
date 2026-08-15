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

  // Display size mapping: width controlled via CSS, height: auto strictly preserves aspect ratio.
  // Display sizes are enlarged per user requirement while source image remains unmodified.
  const widthMap = {
    sm: 'w-[100px] sm:w-[120px]',
    md: 'w-[130px] sm:w-[155px]', // Navbar logo enlarged display size
    lg: 'w-[180px] sm:w-[220px]',
    xl: 'w-[240px] sm:w-[280px]',
    splash: 'w-[280px] sm:w-[360px]',
  }

  const selectedWidth = widthMap[size] || widthMap.md

  return (
    <div className={`inline-flex items-center shrink-0 select-none ${className}`}>
      <img
        src={imgSrc}
        alt="ONPRINT"
        className={`onprint-logo ${selectedWidth} h-auto object-contain shrink-0`}
        style={{ height: 'auto', objectFit: 'contain' }}
      />
    </div>
  )
}

