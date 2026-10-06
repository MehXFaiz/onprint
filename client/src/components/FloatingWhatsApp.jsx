import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Sparkles, Clock, CheckCircle2 } from 'lucide-react'
import WhatsAppIcon from './WhatsAppIcon'

const WHATSAPP_NUMBER = '447344546056'
const FORMATTED_PHONE = '+44 7344 546056'

const QUICK_PROMPTS = [
  { label: 'Instant Quote Request', text: 'Hi ONPRINT, I would like to request an instant quote for custom printing.' },
  { label: 'Luxury Business Cards', text: 'Hello, I want to inquire about luxury business cards with foil stamping & spot UV.' },
  { label: 'Custom Packaging & Boxes', text: 'Hi ONPRINT, I am looking for custom rigid packaging boxes.' },
  { label: 'Same-Day Urgent Print', text: 'Hi, I need urgent same-day printing with express UAE delivery.' },
]

export default function FloatingWhatsApp() {
  const [isOpen, setIsOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [customMsg, setCustomMsg] = useState('')

  const handleOpenWhatsApp = (text) => {
    const encoded = encodeURIComponent(text || `Hi ONPRINT, I would like to inquire about your printing services.`)
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`, '_blank', 'noopener,noreferrer')
  }

  const handleCustomSubmit = (e) => {
    e.preventDefault()
    handleOpenWhatsApp(customMsg.trim())
    setCustomMsg('')
    setIsOpen(false)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-auto">
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
                <span className="truncate">Direct Pressroom Hotline: <strong className="font-bold">{FORMATTED_PHONE}</strong></span>
              </div>
            </div>

            {/* Body */}
            <div className="bg-slate-50/90 p-4 space-y-3.5 max-h-[360px] overflow-y-auto">
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
                    How can our print specialists assist your brand today? Select a quick topic or send a direct spec:
                  </p>
                </div>
              </div>

              {/* Quick Topic Chips */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-1">
                  Quick Inquiry Topics
                </span>
                <div className="flex flex-col gap-1.5">
                  {QUICK_PROMPTS.map((prompt) => (
                    <button
                      key={prompt.label}
                      type="button"
                      onClick={() => handleOpenWhatsApp(prompt.text)}
                      className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-xs font-semibold text-slate-700 transition-all hover:border-[#25D366] hover:bg-emerald-50/50 hover:text-emerald-900 shadow-xs group cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Sparkles className="h-3 w-3 text-[#128C7E] group-hover:scale-110 transition-transform" />
                        <span>{prompt.label}</span>
                      </span>
                      <Send className="h-3 w-3 text-slate-300 group-hover:text-[#128C7E] group-hover:translate-x-0.5 transition-all" />
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
                    placeholder="Type your question or specs..."
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
                onClick={() => handleOpenWhatsApp()}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 transition-all hover:bg-[#20ba59] hover:shadow-lg active:scale-[0.98] cursor-pointer"
              >
                <WhatsAppIcon className="h-4 w-4 fill-current" />
                <span>Open WhatsApp Chat ({FORMATTED_PHONE})</span>
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
        {/* On Hover Tooltip: "Chat with ONPRINT" */}
        <AnimatePresence>
          {!isOpen && isHovered && (
            <motion.div
              initial={{ opacity: 0, x: 10, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="mr-3 hidden sm:flex items-center gap-2 rounded-xl bg-[#0F172A] px-3.5 py-2 text-xs font-bold text-white shadow-xl shadow-black/20 whitespace-nowrap"
            >
              <span>Chat with ONPRINT</span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white shadow-xl shadow-emerald-600/35 transition-all hover:shadow-2xl hover:shadow-emerald-600/50 cursor-pointer"
          aria-label="Chat with ONPRINT on WhatsApp"
          title="Chat with ONPRINT"
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
    </div>
  )
}
