import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Sparkles, Clock, CheckCircle2, Phone, Mail, FileText } from 'lucide-react'
import WhatsAppIcon from './WhatsAppIcon'
import {
  WHATSAPP_PHONE,
  FORMATTED_PHONE,
  RAW_WHATSAPP_NUMBER,
  SERVICE_INQUIRY_MESSAGES,
  openWhatsAppDirectly,
} from '../utils/whatsapp'
import { trackWhatsAppClick, trackPhoneClick, trackEmailClick } from '../utils/analytics'

const QUICK_PROMPTS = [
  {
    key: 'business-cards',
    label: 'Business Cards (Dubai)',
    badge: 'High Priority',
    text: SERVICE_INQUIRY_MESSAGES['business-cards'],
  },
  {
    key: 'stickers',
    label: 'Stickers & Labels',
    badge: 'Waterproof',
    text: SERVICE_INQUIRY_MESSAGES.stickers,
  },
  {
    key: 'rollup-banners',
    label: 'Roll-Up Banners',
    badge: 'Event Ready',
    text: SERVICE_INQUIRY_MESSAGES['rollup-banners'],
  },
  {
    key: 'bottle-printing',
    label: 'Custom Bottle Printing',
    badge: 'Drinkware',
    text: SERVICE_INQUIRY_MESSAGES['bottle-printing'],
  },
  {
    key: 'stamps',
    label: 'Custom Stamps & Seals',
    badge: 'Express',
    text: SERVICE_INQUIRY_MESSAGES.stamps,
  },
  {
    key: 'general',
    label: 'Instant Custom Quote',
    badge: 'Same-Day',
    text: SERVICE_INQUIRY_MESSAGES.general,
  },
]

export default function FloatingWhatsApp() {
  const [isOpen, setIsOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [customMsg, setCustomMsg] = useState('')

  const handleOpenWhatsApp = (text, serviceKey = 'general') => {
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/'
    const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://www.0nprint.com/'
    const pageTitle = typeof document !== 'undefined' && document.title ? document.title.split('|')[0].trim() : ''

    trackWhatsAppClick({
      source_page: currentPath,
      service_name: serviceKey,
      product_name: pageTitle || serviceKey,
      button_location: 'floating_widget',
      label: `floating_widget_${serviceKey}`,
    })

    let targetText = text || SERVICE_INQUIRY_MESSAGES.general
    if (currentPath && currentPath !== '/' && !targetText.includes('Page URL:')) {
      targetText += `\n\n• Page: ${pageTitle || currentPath}\n• Page URL: ${currentUrl}`
    }
    const encoded = encodeURIComponent(targetText)
    const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encoded}`
    openWhatsAppDirectly(url)
  }

  const handleCustomSubmit = (e) => {
    e.preventDefault()
    if (!customMsg.trim()) return
    const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://www.0nprint.com/'
    const fullText = `Hello 0nprint, I have a printing inquiry:\n${customMsg.trim()}\n\n• Page URL: ${currentUrl}`
    handleOpenWhatsApp(fullText, 'custom_input')
    setCustomMsg('')
    setIsOpen(false)
  }

  return (
    <aside aria-label="WhatsApp Inquiry Concierge" className="fixed bottom-[82px] right-3 md:bottom-6 md:right-6 z-40 flex flex-col items-end pointer-events-auto">
      {/* Expanded Concierge Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="dialog"
            aria-label="ONPRINT WhatsApp Concierge"
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="mb-3 w-[min(370px,calc(100vw-1.5rem))] max-h-[calc(100vh-7.5rem)] flex flex-col overflow-hidden rounded-3xl border border-[#122240] bg-[#081226] shadow-2xl text-[#F5F2EB]"
          >
            {/* Header */}
            <div className="relative shrink-0 bg-gradient-to-r from-[#128C7E] to-[#075E54] p-3.5 sm:p-4 text-white">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  <div className="relative flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-white shadow-inner backdrop-blur-md">
                    <WhatsAppIcon className="h-5 w-5 sm:h-6 sm:w-6 fill-current text-white" />
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#075E54] bg-emerald-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <h4 className="font-bold text-xs sm:text-sm tracking-tight text-white truncate">ONPRINT Concierge</h4>
                      <span className="rounded bg-white/20 px-1.5 py-0.5 text-[9px] font-black uppercase text-white shrink-0">
                        Dubai Press
                      </span>
                    </div>
                    <p className="flex items-center gap-1 text-[10px] sm:text-[11px] text-emerald-100/90">
                      <Clock className="h-3 w-3 shrink-0" />
                      <span className="truncate">Online • Quick response in &lt;15m</span>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/20 hover:text-white cursor-pointer"
                  aria-label="Close WhatsApp chat"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Verified Badge info */}
              <div className="mt-2.5 flex items-center gap-2 rounded-xl bg-black/20 px-3 py-1.5 text-[10.5px] sm:text-[11px] text-white/95">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300 shrink-0" />
                <span className="truncate">
                  Direct Pressroom Hotline: <strong className="font-bold">{FORMATTED_PHONE}</strong>
                </span>
              </div>
            </div>

            {/* Body */}
            <div className="bg-[#040A18] p-3.5 sm:p-4 space-y-3 max-h-[min(340px,46vh)] overflow-y-auto">
              {/* Agent Bubble */}
              <div className="flex items-start gap-2.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#128C7E] text-white text-[11px] font-bold">
                  OP
                </div>
                <div className="rounded-2xl rounded-tl-none bg-[#081226] p-3 text-xs leading-relaxed text-[#F5F2EB] shadow-2xs border border-[#122240]">
                  <p className="font-medium text-[#F5F2EB]">
                    Hello! Welcome to <strong className="text-[#D4AF65]">ONPRINT Dubai</strong>. 👋
                  </p>
                  <p className="mt-1 text-[#A0AEC0]">
                    Select a service to start a conversation with our master pressman, or type custom requirements:
                  </p>
                </div>
              </div>

              {/* Quick Service Selection Chips */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF65] block px-1">
                  Select Priority Service
                </span>
                <div className="flex flex-col gap-1.5">
                  {QUICK_PROMPTS.map((prompt) => (
                    <button
                      key={prompt.key}
                      type="button"
                      onClick={() => handleOpenWhatsApp(prompt.text, prompt.key)}
                      className="flex items-center justify-between gap-2 rounded-xl border border-[#122240] bg-[#081226] px-3 py-2 text-left text-xs font-semibold text-[#F5F2EB] transition-all hover:border-[#25D366] hover:bg-[#122240] shadow-2xs group cursor-pointer"
                    >
                      <span className="flex items-center gap-2 min-w-0">
                        <Sparkles className="h-3.5 w-3.5 text-[#D4AF65] group-hover:scale-110 shrink-0 transition-transform" />
                        <span className="truncate">{prompt.label}</span>
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[9px] font-bold uppercase text-[#D4AF65] bg-[#040A18] border border-[#122240] px-1.5 py-0.5 rounded group-hover:border-[#25D366] group-hover:text-emerald-300">
                          {prompt.badge}
                        </span>
                        <Send className="h-3 w-3 text-[#52647D] group-hover:text-[#25D366] group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Direct Custom Message Form */}
              <form onSubmit={handleCustomSubmit} className="pt-2 border-t border-[#122240]">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={customMsg}
                    onChange={(e) => setCustomMsg(e.target.value)}
                    placeholder="Type specs (e.g. 500 gold foil cards)..."
                    className="w-full rounded-xl border border-[#122240] bg-[#081226] px-3.5 py-2.5 pr-10 text-xs text-[#F5F2EB] placeholder:text-[#52647D] focus:border-[#25D366] focus:outline-hidden focus:ring-2 focus:ring-[#25D366]/20 shadow-2xs"
                  />
                  <button
                    type="submit"
                    disabled={!customMsg.trim()}
                    className="absolute right-1.5 flex h-7 w-7 items-center justify-center rounded-lg bg-[#25D366] text-white transition-opacity disabled:opacity-40 hover:bg-[#20ba59] cursor-pointer"
                    aria-label="Send WhatsApp message"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </div>
              </form>

              {/* Alternative Contact Fallbacks if WhatsApp is unavailable */}
              <div className="pt-2.5 border-t border-[#122240] space-y-1.5 text-[10.5px] text-[#A0AEC0]">
                <span className="block text-[9px] font-bold uppercase tracking-wider text-[#D4AF65]">
                  Alternative Direct Contact:
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  <a
                    href={`tel:+${WHATSAPP_PHONE}`}
                    onClick={() => trackPhoneClick({ source_page: 'floating_concierge', button_location: 'concierge_call_fallback' })}
                    className="flex items-center justify-center gap-1.5 rounded-lg border border-[#122240] bg-[#040A18] px-2 py-1.5 text-[#F5F2EB] hover:border-[#D4AF65] hover:text-[#D4AF65] transition-all font-semibold"
                  >
                    <Phone className="h-3 w-3 text-[#D4AF65]" />
                    <span>Call Hotline</span>
                  </a>
                  <Link
                    to="/get-a-quote"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-1.5 rounded-lg border border-[#122240] bg-[#040A18] px-2 py-1.5 text-[#F5F2EB] hover:border-[#D4AF65] hover:text-[#D4AF65] transition-all font-semibold"
                  >
                    <FileText className="h-3 w-3 text-[#D4AF65]" />
                    <span>Fast Web Quote</span>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Trigger Button with Ambient Gold & Emerald Ring */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Soft Ambient Gold Pulse Behind Button */}
        <span className="animate-gold-pulse absolute inset-0 rounded-full bg-[#D4AF65]/20 -z-10 pointer-events-none" />

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="relative flex h-13 w-13 md:h-14 md:w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl hover:bg-[#20ba59] transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF65]"
          aria-label={isOpen ? 'Close WhatsApp Concierge' : 'Open WhatsApp Concierge'}
          title={`Inquire on WhatsApp: ${FORMATTED_PHONE}`}
        >
          {isOpen ? (
            <X className="h-6 w-6 stroke-2" />
          ) : (
            <>
              <WhatsAppIcon className="h-7 w-7 fill-white drop-shadow-xs" />
              {/* Online indicator ping */}
              <span className="absolute top-1 right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-300 border-2 border-[#25D366]" />
              </span>
            </>
          )}
        </button>

        {/* Hover Tooltip on Desktop */}
        <AnimatePresence>
          {!isOpen && isHovered && (
            <motion.div
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.15 }}
              className="hidden lg:flex absolute right-full top-1/2 -translate-y-1/2 mr-3 whitespace-nowrap rounded-2xl bg-[#081226] border border-[#122240] px-3.5 py-1.5 text-xs font-bold text-[#F5F2EB] shadow-xl pointer-events-none"
            >
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#25D366] animate-pulse" />
                <span>Instant Quote on WhatsApp</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </aside>
  )
}
