import React, { useState } from 'react'
import WhatsAppIcon from './WhatsAppIcon'

export default function FloatingWhatsApp() {
  const [hovered, setHovered] = useState(false)
  const phoneNumber = '+44 7344546056'
  const waLink = 'https://wa.me/447344546056?text=Hello%20ONPRINT%20Team%2C%20I%20would%20like%20to%20inquire%20about%20printing%20services'

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex items-center"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Tooltip / Badge */}
      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp +44 7344546056"
        className="group flex items-center gap-3 rounded-full bg-[#25D366] text-white p-3 sm:p-3.5 shadow-xl hover:bg-[#20ba5a] transition-all duration-300 hover:shadow-2xl hover:scale-105 active:scale-95"
      >
        <span className="relative flex h-7 w-7 items-center justify-center">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/40 opacity-75" />
          <WhatsAppIcon className="relative h-6 w-6 fill-white" />
        </span>

        {/* Text expands on hover or visible on desktop */}
        <span className="hidden sm:inline-block pr-2 text-xs font-bold tracking-tight">
          WhatsApp: {phoneNumber}
        </span>
      </a>
    </div>
  )
}
