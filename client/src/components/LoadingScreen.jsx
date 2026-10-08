import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import logoIconLight from '../assets/logo_icon_light.png'

const SESSION_KEY = 'onprint-splash-smooth-v3'

export default function LoadingScreen() {
  const reduce = useReducedMotion()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Show splash screen on first visit per session
    if (window.sessionStorage.getItem(SESSION_KEY)) return
    window.sessionStorage.setItem(SESSION_KEY, '1')

    if (reduce) return

    setVisible(true)

    const timer = setTimeout(() => {
      setVisible(false)
    }, 2600)

    return () => clearTimeout(timer)
  }, [reduce])

  if (!visible) return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="onprint-smooth-splash"
          onClick={() => setVisible(false)}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#07090E] text-white overflow-hidden select-none cursor-pointer"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.02,
            filter: 'blur(8px)',
            transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
          }}
          aria-label="ONPRINT Intro Splash Screen"
        >
          {/* Subtle Ambient Radial Glow */}
          <motion.div
            className="absolute w-[450px] sm:w-[650px] h-[450px] sm:h-[650px] rounded-full pointer-events-none"
            style={{
              background:
                'radial-gradient(circle, rgba(168,47,25,0.18) 0%, rgba(168,47,25,0.03) 50%, rgba(7,9,14,0) 75%)',
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: [0, 1, 0.85],
              scale: [0.8, 1, 1.05],
            }}
            transition={{
              duration: 2.2,
              ease: [0.22, 1, 0.36, 1],
            }}
          />

          {/* Minimal Corner Technical Accents */}
          <motion.div
            className="absolute inset-6 sm:inset-10 pointer-events-none flex justify-between flex-col text-[10px] font-mono tracking-[0.25em] text-slate-500 uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="h-1.5 w-1.5 rounded-full bg-[#A82F19]" />
                ONPRINT PRESSROOM
              </span>
              <span>DUBAI • UAE</span>
            </div>
            <div className="flex justify-between items-center text-[9px] text-slate-600">
              <span>COMMERCIAL PRINT</span>
              <span className="text-slate-400">CLICK TO ENTER →</span>
            </div>
          </motion.div>

          {/* Center Stage: Smooth Logo & Company Name Sequence */}
          <div className="relative z-10 flex flex-col items-center justify-center px-4 text-center">
            {/* 1. Logo Emblem: Appears First, Ultra Smoothly */}
            <motion.div
              className="relative flex items-center justify-center mb-6"
              initial={{ opacity: 0, scale: 0.86, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                duration: 0.9,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {/* Soft Radiant Halo */}
              <motion.div
                className="absolute inset-0 rounded-full bg-[#A82F19]/25 blur-xl pointer-events-none"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 0.7, scale: 1.2 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />

              {/* Logo Emblem Icon */}
              <div className="relative flex items-center justify-center h-20 w-20 sm:h-24 sm:w-24 rounded-2xl bg-gradient-to-b from-white/10 to-white/5 border border-white/15 shadow-2xl backdrop-blur-md p-4">
                <img
                  src={logoIconLight}
                  alt="ONPRINT Logo"
                  className="h-full w-full object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
                />
              </div>
            </motion.div>

            {/* 2. Company Name: Appears Second, Extremely Smooth */}
            <motion.div
              className="flex items-center justify-center text-4xl sm:text-6xl font-black uppercase tracking-[0.22em] text-white"
              initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{
                duration: 0.85,
                delay: 0.55,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <span>ON</span>
              <span className="text-[#A82F19] ml-0.5">PRINT</span>
            </motion.div>

            {/* 3. Subtitle / Tagline: Fades In Smoothly */}
            <motion.div
              className="mt-3 flex flex-col items-center gap-1 text-center"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.75,
                delay: 0.85,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.35em] text-slate-300">
                DUBAI COMMERCIAL PRESS
              </span>
              <span className="text-[9px] sm:text-[10px] font-medium tracking-[0.25em] text-slate-500 uppercase">
                Premium Printing &amp; Luxury Packaging
              </span>
            </motion.div>

            {/* 4. Elegant Minimal Loading Line */}
            <motion.div
              className="mt-8 h-[2px] w-28 sm:w-36 rounded-full bg-white/10 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-transparent via-[#A82F19] to-white rounded-full"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{
                  repeat: Infinity,
                  duration: 1.2,
                  ease: 'easeInOut',
                }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
