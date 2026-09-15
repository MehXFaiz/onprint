import React from 'react'
import WhatsAppIcon from './WhatsAppIcon'

export default function FloatingWhatsApp() {
  const waLink = 'https://wa.me/447344546056?text=Hello%20ONPRINT%20Team%2C%20I%20would%20like%20to%20inquire%20about%20printing%20services'

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="group flex items-center justify-center rounded-full bg-[#25D366] text-white p-4 shadow-xl hover:bg-[#20ba5a] transition-all duration-300 hover:shadow-2xl hover:scale-110 active:scale-95"
      >
        <span className="relative flex h-8 w-8 items-center justify-center">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/40 opacity-75" />
          <WhatsAppIcon className="relative h-7 w-7 fill-white" />
        </span>
      </a>
    </div>
  )
}
