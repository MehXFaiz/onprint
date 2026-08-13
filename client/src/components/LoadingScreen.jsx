import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

const SESSION_KEY = 'onprint-press-cinematic-v2'

export default function LoadingScreen() {
  const reduce = useReducedMotion()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (window.sessionStorage.getItem(SESSION_KEY)) return
    window.sessionStorage.setItem(SESSION_KEY, '1')

    if (reduce) return

    setVisible(true)
    const timer = setTimeout(() => {
      setVisible(false)
    }, 2900)

    return () => clearTimeout(timer)
  }, [reduce])

  if (!visible) return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="onprint-press-cinematic"
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#020202] text-white overflow-hidden select-none pointer-events-none will-change-transform"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(8px)' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          aria-label="ONPRINT Printing Press Experience"
        >
          {/* Subtle Ambient Press Glow */}
          <motion.div
            className="absolute w-[800px] h-[800px] rounded-full pointer-events-none"
            style={{
              background:
                'radial-gradient(circle, rgba(229,72,41,0.14) 0%, rgba(255,255,255,0.02) 40%, rgba(0,0,0,0) 70%)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.7] }}
            transition={{ duration: 2.5, times: [0, 0.4, 1] }}
          />

          {/* Precision Printing Press Registration Marks */}
          <div className="absolute inset-6 sm:inset-12 pointer-events-none opacity-25">
            {/* Top Left */}
            <div className="absolute top-0 left-0 flex items-center gap-1.5">
              <div className="w-5 h-[1px] bg-white" />
              <div className="w-[1px] h-5 bg-white" />
              <span className="text-[9px] font-mono tracking-widest text-zinc-400">PRESS-RUN</span>
            </div>
            {/* Top Right */}
            <div className="absolute top-0 right-0 flex items-center gap-1.5">
              <span className="text-[9px] font-mono tracking-widest text-zinc-400">300 DPI</span>
              <div className="w-[1px] h-5 bg-white" />
              <div className="w-5 h-[1px] bg-white" />
            </div>
            {/* Bottom Left */}
            <div className="absolute bottom-0 left-0 flex items-center gap-1.5">
              <div className="w-5 h-[1px] bg-white" />
              <div className="w-[1px] h-5 bg-white" />
            </div>
            {/* Bottom Right */}
            <div className="absolute bottom-0 right-0 flex items-center gap-1.5">
              <div className="w-[1px] h-5 bg-white" />
              <div className="w-5 h-[1px] bg-white" />
            </div>
          </div>

          {/* Virtual Roller Laser Line */}
          <motion.div
            className="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#E54829]/40 to-transparent shadow-[0_0_10px_#E54829]"
            style={{ top: '48%' }}
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: [0, 0.6, 0], scaleX: 1 }}
            transition={{ duration: 1.2, delay: 0.45 }}
          />

          {/* Camera Stage (Push-In Zoom toward Printed Logo) */}
          <motion.div
            className="relative flex flex-col items-center justify-center"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{
              scale: [0.85, 1, 1.4],
              opacity: [0, 1, 1],
            }}
            transition={{
              duration: 2.85,
              times: [0, 0.45, 1],
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {/* The White Premium Paper Sheet gliding through the press */}
            <motion.div
              className="relative w-[320px] sm:w-[480px] h-[170px] sm:h-[240px] bg-[#FAF8F5] rounded-lg shadow-[0_30px_90px_rgba(0,0,0,0.95),0_0_50px_rgba(255,255,255,0.06)] overflow-hidden flex flex-col items-center justify-center p-6 border border-white/20"
              initial={{ y: 70, opacity: 0, rotateX: 14 }}
              animate={{
                y: [70, 0, 0],
                opacity: [0, 1, 1],
                rotateX: [14, 0, 0],
              }}
              transition={{ duration: 1.15, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Fine Paper Texture Pattern */}
              <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:14px_14px] opacity-35 pointer-events-none" />

              {/* Ink Ribbon / Laser Print Head Sweep */}
              <motion.div
                className="absolute inset-y-0 w-28 bg-gradient-to-r from-transparent via-[#E54829]/35 to-transparent shadow-[0_0_25px_rgba(229,72,41,0.6)] pointer-events-none"
                initial={{ x: '-200%' }}
                animate={{ x: '350%' }}
                transition={{ duration: 1.1, delay: 0.6, ease: 'easeInOut' }}
              />

              {/* Printed ONPRINT Logo revealed on the sheet */}
              <motion.div
                className="relative flex items-center gap-1.5 font-display text-4xl sm:text-6xl font-black uppercase tracking-[0.24em] text-[#121212]"
                initial={{ opacity: 0, clipPath: 'inset(0 100% 0 0)' }}
                animate={{
                  opacity: 1,
                  clipPath: 'inset(0 0% 0 0)',
                }}
                transition={{ duration: 0.8, delay: 0.75, ease: 'easeOut' }}
              >
                <span>ON</span>
                <span className="text-[#E54829]">PRINT</span>
                <span className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-[#E54829] inline-block ml-0.5 shadow-[0_0_8px_#E54829]" />
              </motion.div>

              {/* Printed Tagline */}
              <motion.div
                className="mt-3.5 text-[9px] sm:text-[11px] font-sans font-bold tracking-[0.4em] text-zinc-500 uppercase flex items-center gap-2.5"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 1.25, ease: 'easeOut' }}
              >
                <span>PRINT</span>
                <span className="text-[#E54829]">•</span>
                <span>CREATE</span>
                <span className="text-[#E54829]">•</span>
                <span>DELIVER</span>
              </motion.div>

              {/* Paper Corner Stamp */}
              <div className="absolute top-3.5 right-4 text-[8px] font-mono text-zinc-400 tracking-widest uppercase">
                PROOF #01
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
