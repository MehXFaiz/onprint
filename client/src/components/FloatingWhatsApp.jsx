import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Sparkles, Clock, CheckCircle2 } from 'lucide-react'
import WhatsAppIcon from './WhatsAppIcon'
import {
  WHATSAPP_PHONE,
  FORMATTED_PHONE,
  SERVICE_INQUIRY_MESSAGES,
  openWhatsAppDirectly,
} from '../utils/whatsapp'
import { trackWhatsAppClick } from '../utils/analytics'

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
    trackWhatsAppClick({
      source_page: typeof window !== 'undefined' ? window.location.pathname : 'floating_widget',
      service_name: serviceKey,
      button_location: 'floating_widget',
      label: `floating_widget_${serviceKey}`,
    })

    const targetText = text || SERVICE_INQUIRY_MESSAGES.general
    const encoded = encodeURIComponent(targetText)
    const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encoded}`
    openWhatsAppDirectly(url)
  }

  const handleCustomSubmit = (e) => {
    e.preventDefault()
    if (!customMsg.trim()) return
    handleOpenWhatsApp(customMsg.trim(), 'custom_input')
    setCustomMsg('')
    setIsOpen(false)
  }

  return (
    <aside aria-label="WhatsApp Inquiry Concierge" className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end pointer-events-auto">
      {/* Expanded Concierge Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="mb-3.5 w-[min(380px,calc(100vw-32px))] overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-2xl ring-1 ring-black/5"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-[#128C7E] to-[#075E54] p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20 text-white shadow-inner backdrop-blur-md">
                    <WhatsAppIcon className="h-6 w-6 fill-current text-white" />
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#075E54] bg-emerald-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-sm tracking-tight text-white">ONPRINT Concierge</h4>
                      <span className="rounded bg-white/20 px-1.5 py-0.5 text-[9px] font-black uppercase text-white">
                        Dubai Press
                      </span>
                    </div>
                    <p className="flex items-center gap-1 text-[11px] text-emerald-100/90">
                      <Clock className="h-3 w-3" />
                      <span>Online • Quick response in &lt;15m</span>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/20 hover:text-white cursor-pointer"
                  aria-label="Close WhatsApp chat"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Verified Badge info */}
              <div className="mt-3 flex items-center gap-2 rounded-xl bg-black/15 px-3 py-1.5 text-[11px] text-white/95">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300 shrink-0" />
                <span className="truncate">
                  Direct Pressroom Hotline: <strong className="font-bold">{FORMATTED_PHONE}</strong>
                </span>
              </div>
            </div>

            {/* Body */}
            <div className="bg-slate-50/90 p-4 space-y-3.5 max-h-[380px] overflow-y-auto">
              {/* Agent Bubble */}
              <div className="flex items-start gap-2.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#128C7E] text-white text-[11px] font-bold">
                  OP
                </div>
                <div className="rounded-2xl rounded-tl-none bg-white p-3.5 text-xs leading-relaxed text-slate-800 shadow-xs border border-slate-200/60">
                  <p className="font-medium">
                    Hello! Welcome to <strong className="text-slate-900">ONPRINT Dubai</strong>. 👋
                  </p>
                  <p className="mt-1 text-slate-600">
                    Select a service to start a conversation with our master pressman, or type custom requirements:
                  </p>
                </div>
              </div>

              {/* Quick Service Selection Chips */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-1">
                  Select Priority Service
                </span>
                <div className="flex flex-col gap-1.5">
                  {QUICK_PROMPTS.map((prompt) => (
                    <button
                      key={prompt.key}
                      type="button"
                      onClick={() => handleOpenWhatsApp(prompt.text, prompt.key)}
                      className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-left text-xs font-semibold text-slate-800 transition-all hover:border-[#25D366] hover:bg-emerald-50/60 hover:text-emerald-950 shadow-xs group cursor-pointer"
                    >
                      <span className="flex items-center gap-2 min-w-0">
                        <Sparkles className="h-3.5 w-3.5 text-[#128C7E] group-hover:scale-110 shrink-0 transition-transform" />
                        <span className="truncate">{prompt.label}</span>
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[9px] font-bold uppercase text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded group-hover:bg-emerald-100 group-hover:text-emerald-800">
                          {prompt.badge}
                        </span>
                        <Send className="h-3 w-3 text-slate-300 group-hover:text-[#128C7E] group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Direct Custom Message Form */}
              <form onSubmit={handleCustomSubmit} className="pt-2 border-t border-slate-200/70">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={customMsg}
                    onChange={(e) => setCustomMsg(e.target.value)}
                    placeholder="Type specs (e.g. 500 gold foil cards)..."
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 pr-10 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#128C7E] focus:outline-hidden focus:ring-2 focus:ring-[#128C7E]/20"
                  />
                  <button
                    type="submit"
                    disabled={!customMsg.trim()}
                    className="absolute right-1.5 flex h-7 w-7 items-center justify-center rounded-lg bg-[#25D366] text-white transition-opacity disabled:opacity-40 hover:bg-[#20ba59] cursor-pointer"
                    aria-label="Send message to WhatsApp"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </div>
              </form>
            </div>

            {/* Footer Direct CTA */}
            <div className="border-t border-slate-200 bg-white p-3">
              <button
                type="button"
                onClick={() => handleOpenWhatsApp(SERVICE_INQUIRY_MESSAGES.general, 'general_footer')}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 transition-all hover:bg-[#20ba59] hover:shadow-lg active:scale-[0.98] cursor-pointer"
              >
                <WhatsAppIcon className="h-4 w-4 fill-current" />
                <span>Chat Directly on WhatsApp</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Button with Tooltip on Hover */}
      <div
        className="relative flex items-center"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* On Hover Tooltip: "WhatsApp Quote" */}
        <AnimatePresence>
          {!isOpen && isHovered && (
            <motion.div
              initial={{ opacity: 0, x: 10, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="mr-3 hidden sm:flex items-center gap-2 rounded-xl bg-[#0F172A] px-3.5 py-2 text-xs font-bold text-white shadow-xl shadow-black/20 whitespace-nowrap"
            >
              <span>Get Quote on WhatsApp</span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white shadow-xl shadow-emerald-600/35 transition-all hover:shadow-2xl hover:shadow-emerald-600/50 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2"
          aria-label="Chat with ONPRINT on WhatsApp"
          title="Chat with ONPRINT on WhatsApp"
        >
          {/* Pulse Ring */}
          <span className="absolute -inset-1 -z-10 rounded-full bg-[#25D366]/40 animate-ping opacity-60 pointer-events-none" />

          <WhatsAppIcon className="h-7 w-7 fill-current text-white transition-transform group-hover:scale-110" />

          {/* Live Status Dot */}
          <span className="absolute top-1 right-1 flex h-3.5 w-3.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-200 opacity-75" />
            <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-400" />
          </span>
        </motion.button>
      </div>
    </aside>
  )
}
