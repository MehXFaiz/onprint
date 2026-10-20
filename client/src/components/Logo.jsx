import React from 'react'
import logoIconImg from '../assets/logo_icon.png'
import logoIconLightImg from '../assets/logo_icon_light.png'

export default function Logo({
  className = '',
  variant = 'light', // Default to 'light' for luxury dark navy backgrounds
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl' | 'splash'
  showText = true,
  iconOnly = false,
}) {
  const isLight = variant === 'light' || variant === 'default' // In luxury dark theme, both use the light icon & warm ivory text
  const isIcon = iconOnly || !showText

  const iconSrc = logoIconLightImg || logoIconImg

  const sizeMap = {
    sm: {
      icon: 'h-8 w-8 sm:h-8.5 sm:w-8.5',
      text: 'text-base sm:text-lg',
      gap: 'gap-2 sm:gap-2.5',
      tracking: 'tracking-wider',
    },
    md: {
      icon: 'h-9 w-9 sm:h-10 sm:w-10',
      text: 'text-lg sm:text-xl',
      gap: 'gap-2.5 sm:gap-3',
      tracking: 'tracking-wider',
    },
    lg: {
      icon: 'h-11 w-11 sm:h-12 sm:w-12',
      text: 'text-xl sm:text-2xl',
      gap: 'gap-3',
      tracking: 'tracking-widest',
    },
    xl: {
      icon: 'h-14 w-14 sm:h-16 sm:w-16',
      text: 'text-2xl sm:text-3xl',
      gap: 'gap-3.5',
      tracking: 'tracking-widest',
    },
    splash: {
      icon: 'h-16 w-16 sm:h-20 sm:w-20',
      text: 'text-3xl sm:text-4xl',
      gap: 'gap-4',
      tracking: 'tracking-widest',
    },
  }

  const currentSize = sizeMap[size] || sizeMap.md

  return (
    <div className={`group inline-flex items-center shrink-0 select-none ${currentSize.gap} ${className}`}>
      {/* Prominent High-Resolution P Symbol Icon with Subtle Gold Hover Glow */}
      <div className="relative shrink-0 flex items-center justify-center">
        <img
          src={iconSrc}
          alt="ONPRINT Dubai Logo"
          loading="eager"
          className={`${currentSize.icon} object-contain shrink-0 transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-[0_0_12px_rgba(214,188,138,0.55)] drop-shadow-xs`}
        />
      </div>

      {/* Prominent, Razor-Sharp Brand Wordmark */}
      {!isIcon && (
        <div className="flex flex-col justify-center leading-none">
          <span
            className={`font-black uppercase font-display select-none transition-colors duration-200 text-[#F5F1E8] ${currentSize.text} ${currentSize.tracking}`}
          >
            ON<span className="text-[#D6BC8A]">PRINT</span>
          </span>
        </div>
      )}
    </div>
  )
}
