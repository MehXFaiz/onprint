import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

const SESSION_KEY = 'onprint-cinematic-splash-v1'

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
    }, 2800)

    return () => clearTimeout(timer)
  }, [reduce])

  if (!visible) return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="onprint-cinematic-splash"
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#030303] text-white overflow-hidden select-none pointer-events-none will-change-transform"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.97, filter: 'blur(6px)' }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          aria-label="ONPRINT Creative Printing Services"
        >
          {/* Subtle Radial Ambient Glow */}
          <motion.div
            className="absolute w-[600px] h-[600px] rounded-full pointer-events-none"
            style={{
              background:
                'radial-gradient(circle, rgba(198,60,34,0.18) 0%, rgba(198,60,34,0.04) 40%, rgba(0,0,0,0) 70%)',
            }}
            initial={{ opacity: 0, scale: 0.2 }}
            animate={{ opacity: [0, 1, 0.75], scale: [0.2, 1.15, 1] }}
            transition={{ duration: 2.3, times: [0, 0.45, 1], ease: 'easeOut' }}
          />

          {/* Master Composition Container */}
          <motion.div
            className="relative flex flex-col items-center justify-center px-4"
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1, 0.96] }}
            transition={{ duration: 2.7, times: [0, 0.82, 1], ease: [0.16, 1, 0.3, 1] }}
          >
            {/* 1. Center Light Point (Appears & Expands into Stroke) */}
            <motion.div
              className="absolute w-2.5 h-2.5 rounded-full bg-[#E54829] shadow-[0_0_20px_#E54829,0_0_40px_#C63C22]"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 2.2, 0.4, 0],
                opacity: [0, 1, 0.8, 0],
              }}
              transition={{
                duration: 0.85,
                times: [0, 0.3, 0.7, 1],
                ease: 'easeInOut',
              }}
            />

            {/* 2. Ink / Printing Stroke Expansion Beam */}
            <div className="relative flex items-center justify-center w-64 sm:w-96 h-1 my-2 overflow-hidden">
              <motion.div
                className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#E54829] to-transparent shadow-[0_0_15px_#E54829]"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{
                  scaleX: [0, 1, 0.35],
                  opacity: [0, 1, 0.2],
                }}
                transition={{
                  duration: 1.1,
                  delay: 0.3,
                  times: [0, 0.55, 1],
                  ease: [0.16, 1, 0.3, 1],
                }}
              />
            </div>

            {/* 3. ONPRINT Logo Reveal */}
            <motion.div
              className="relative flex items-center justify-center gap-1 font-display text-5xl sm:text-7xl font-black uppercase tracking-[0.2em] sm:tracking-[0.25em]"
              initial={{ opacity: 0, y: 14, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.8, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* ON */}
              <span className="text-white drop-shadow-[0_2px_12px_rgba(255,255,255,0.18)]">
                ON
              </span>
              {/* PRINT with Premium Glow */}
              <span className="bg-gradient-to-r from-[#FF5733] via-[#E54829] to-[#C63C22] bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(229,72,41,0.45)]">
                PRINT
              </span>
              {/* Precision Dot */}
              <motion.span
                className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-[#E54829] shadow-[0_0_12px_#E54829]"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.4, 1] }}
                transition={{ duration: 0.45, delay: 1.1, ease: 'backOut' }}
              />
            </motion.div>

            {/* Subtle Divider Stroke Line */}
            <div className="relative w-48 sm:w-72 h-[1px] my-4 overflow-hidden">
              <motion.div
                className="h-full w-full bg-gradient-to-r from-transparent via-white/25 to-transparent"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.85, delay: 1.05, ease: 'easeOut' }}
              />
            </div>

            {/* 4. Tagline Reveal */}
            <motion.div
              className="text-[10px] sm:text-[12px] font-sans font-semibold tracking-[0.35em] sm:tracking-[0.45em] text-zinc-400 uppercase flex items-center gap-2.5 sm:gap-3.5"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 1.3, ease: 'easeOut' }}
            >
              <span>PRINT</span>
              <span className="text-[#E54829] font-bold">•</span>
              <span>CREATE</span>
              <span className="text-[#E54829] font-bold">•</span>
              <span>DELIVER</span>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
