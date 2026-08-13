import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

const SESSION_KEY = 'onprint-splash-cinematic-v5'

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
    }, 2850)

    return () => clearTimeout(timer)
  }, [reduce])

  if (!visible) return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="onprint-cinematic-splash"
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#000000] text-white overflow-hidden select-none pointer-events-none will-change-transform"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            filter: 'blur(8px)',
            transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
          }}
          aria-label="ONPRINT Experience"
        >
          {/* Subtle Premium Ambient Glow behind center */}
          <motion.div
            className="absolute w-[600px] sm:w-[900px] h-[600px] sm:h-[900px] rounded-full pointer-events-none"
            style={{
              background:
                'radial-gradient(circle, rgba(240,91,38,0.18) 0%, rgba(240,91,38,0.04) 45%, rgba(0,0,0,0) 70%)',
            }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{
              opacity: [0, 0, 0.9, 0.75],
              scale: [0.6, 0.6, 1, 1.05],
            }}
            transition={{
              duration: 2.7,
              times: [0, 0.35, 0.65, 1],
              ease: 'easeOut',
            }}
          />

          {/* Minimalist Grid / Print Precision Guidelines */}
          <motion.div
            className="absolute inset-8 sm:inset-16 pointer-events-none opacity-20 flex justify-between flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.2, 0.15] }}
            transition={{ duration: 2.2, delay: 0.4 }}
          >
            <div className="flex justify-between items-center text-[9px] font-mono tracking-[0.3em] text-zinc-500 uppercase">
              <span>PRSS // 01</span>
              <span>300 DPI // CMYK</span>
            </div>
            <div className="flex justify-between items-center text-[9px] font-mono tracking-[0.3em] text-zinc-500 uppercase">
              <span>LAT 0.00°</span>
              <span>FINE PRINTING</span>
            </div>
          </motion.div>

          {/* Center Stage Container with Camera Scale-Down */}
          <motion.div
            className="relative flex flex-col items-center justify-center z-10 px-4"
            initial={{ scale: 1 }}
            animate={{
              scale: [1, 1, 1, 0.96],
            }}
            transition={{
              duration: 2.7,
              times: [0, 0.75, 0.85, 1],
              ease: [0.25, 1, 0.5, 1],
            }}
          >
            {/* Step 2: Tiny Glowing Point in Center */}
            <motion.div
              className="relative flex items-center justify-center"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 1, 0],
                scale: [0, 1.4, 1, 0],
              }}
              transition={{
                duration: 0.75,
                times: [0, 0.3, 0.6, 1],
                ease: 'easeOut',
              }}
            >
              {/* Inner core white dot */}
              <div className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_12px_#FFFFFF,0_0_24px_#F05B26]" />
              {/* Outer light ring flare */}
              <motion.div
                className="absolute w-8 h-8 rounded-full border border-[#F05B26]/80 shadow-[0_0_20px_#F05B26]"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: [0.5, 1.8], opacity: [1, 0] }}
                transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
              />
            </motion.div>

            {/* Step 3: Ink / Printing Stroke Expansion */}
            <div className="relative flex items-center justify-center my-4 w-full max-w-[550px]">
              {/* Main Horizontal Ink Sweep Stroke */}
              <motion.div
                className="h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#F05B26] to-transparent shadow-[0_0_18px_#F05B26]"
                initial={{ width: 0, opacity: 0 }}
                animate={{
                  width: ['0%', '100%', '100%'],
                  opacity: [0, 1, 0.6],
                }}
                transition={{
                  duration: 1.1,
                  delay: 0.35,
                  times: [0, 0.7, 1],
                  ease: [0.22, 1, 0.36, 1],
                }}
              />

              {/* Core White Laser Precision Line */}
              <motion.div
                className="absolute h-[1px] bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_10px_#ffffff]"
                initial={{ width: 0, opacity: 0 }}
                animate={{
                  width: ['0%', '75%', '75%'],
                  opacity: [0, 0.95, 0.3],
                }}
                transition={{
                  duration: 0.9,
                  delay: 0.45,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
            </div>

            {/* Step 5: Tagline Fade In (No Logo as requested) */}
            <motion.div
              className="mt-6 flex items-center justify-center text-xs sm:text-sm font-semibold tracking-[0.45em] text-zinc-200 uppercase"
              initial={{ opacity: 0, y: 10 }}
              animate={{
                opacity: [0, 0, 1, 1],
                y: [10, 10, 0, 0],
              }}
              transition={{
                duration: 1.6,
                times: [0, 0.45, 0.8, 1],
                ease: 'easeOut',
              }}
            >
              <span>PRINT</span>
              <span className="text-[#F05B26] mx-3 sm:mx-4 font-bold text-base select-none">•</span>
              <span>CREATE</span>
              <span className="text-[#F05B26] mx-3 sm:mx-4 font-bold text-base select-none">•</span>
              <span>DELIVER</span>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
