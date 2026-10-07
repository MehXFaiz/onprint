import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import logoIconLight from '../assets/logo_icon_light.png'

const SESSION_KEY = 'onprint-luxury-splash-2026'

const particles = [
  { top: '30%', left: '20%', delay: 0.2, size: 3 },
  { top: '38%', left: '78%', delay: 0.4, size: 2.5 },
  { top: '65%', left: '25%', delay: 0.6, size: 3 },
  { top: '70%', left: '75%', delay: 0.3, size: 2 },
  { top: '22%', left: '50%', delay: 0.5, size: 3.5 },
  { top: '78%', left: '48%', delay: 0.7, size: 2.5 },
]

export default function LoadingScreen() {
  const reduce = useReducedMotion()
  const [visible, setVisible] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Show splash screen on first visit per session
    if (window.sessionStorage.getItem(SESSION_KEY)) return
    window.sessionStorage.setItem(SESSION_KEY, '1')

    if (reduce) return

    setVisible(true)

    // Smooth progress bar animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 2
      })
    }, 45)

    const timer = setTimeout(() => {
      setVisible(false)
    }, 2800)

    return () => {
      clearInterval(progressInterval)
      clearTimeout(timer)
    }
  }, [reduce])

  if (!visible) return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="onprint-logo-splash"
          onClick={() => setVisible(false)}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#07090E] text-white overflow-hidden select-none cursor-pointer"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.04,
            filter: 'blur(10px)',
            transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
          }}
          aria-label="ONPRINT Intro Splash Screen"
        >
          {/* 1. Deep Ambient Radial Aura */}
          <motion.div
            className="absolute w-[500px] sm:w-[750px] h-[500px] sm:h-[750px] rounded-full pointer-events-none"
            style={{
              background:
                'radial-gradient(circle, rgba(168,47,25,0.22) 0%, rgba(168,47,25,0.04) 50%, rgba(7,9,14,0) 75%)',
            }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{
              opacity: [0, 0.9, 1, 0.4],
              scale: [0.6, 1, 1.08, 1.15],
            }}
            transition={{
              duration: 2.7,
              times: [0, 0.3, 0.8, 1],
              ease: 'easeOut',
            }}
          />

          {/* 2. Precision Press Guidelines & Status */}
          <div className="absolute inset-6 sm:inset-10 pointer-events-none opacity-30 flex justify-between flex-col text-[10px] font-mono tracking-[0.25em] text-slate-400 uppercase">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#A82F19] animate-ping" />
                <span className="text-white font-bold">ONPRINT // PRESSROOM</span>
              </div>
              <span>DUBAI, UAE • 1200 DPI</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">COMMERCIAL OFFSET &amp; DIGITAL</span>
              <span className="text-slate-300 font-semibold">TAP TO SKIP →</span>
            </div>
          </div>

          {/* 3. Floating Light Particles */}
          {particles.map((p, i) => (
            <motion.span
              key={i}
              className="absolute rounded-full bg-[#A82F19] shadow-[0_0_12px_#A82F19] pointer-events-none"
              style={{
                top: p.top,
                left: p.left,
                width: `${p.size}px`,
                height: `${p.size}px`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 0.9, 0],
                scale: [0, 1.8, 0],
                y: [0, -25],
              }}
              transition={{
                duration: 1.8,
                delay: p.delay,
                ease: 'easeOut',
              }}
            />
          ))}

          {/* 4. Center Logo & Brand Presentation */}
          <div className="relative z-10 flex flex-col items-center justify-center px-4 text-center">
            {/* Logo Emblem in Glowing Circular Stage */}
            <div className="relative flex items-center justify-center mb-6">
              {/* Animated Glowing Ring Draw */}
              <svg className="w-28 h-28 sm:w-36 sm:h-36 -rotate-90 pointer-events-none">
                <circle
                  cx="50%"
                  cy="50%"
                  r="44%"
                  className="stroke-white/10 fill-none"
                  strokeWidth="2"
                />
                <motion.circle
                  cx="50%"
                  cy="50%"
                  r="44%"
                  className="stroke-[#A82F19] fill-none"
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                />
              </svg>

              {/* Pulsing Backlight */}
              <motion.div
                className="absolute inset-3 rounded-full bg-gradient-to-tr from-[#A82F19]/30 to-[#F36621]/20 blur-md pointer-events-none"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: [0.8, 1.15, 1], opacity: [0, 0.8, 0.5] }}
                transition={{ duration: 1.4, ease: 'easeOut' }}
              />

              {/* Central Logo Icon Badge */}
              <motion.div
                className="absolute flex items-center justify-center h-18 w-18 sm:h-24 sm:w-24 rounded-full bg-[#0E131E] border border-white/20 shadow-2xl overflow-hidden"
                initial={{ scale: 0, rotate: -30, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 260,
                  damping: 20,
                  delay: 0.2,
                }}
              >
                <img
                  src={logoIconLight}
                  alt="ONPRINT Logo"
                  className="h-10 w-10 sm:h-14 sm:w-14 object-contain"
                />
              </motion.div>
            </div>

            {/* Company Name Reveal */}
            <div className="relative overflow-hidden py-1">
              <motion.div
                initial={{ y: 35, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 0.8,
                  delay: 0.6,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="flex items-center justify-center font-black tracking-[0.2em] sm:tracking-[0.25em] text-4xl sm:text-6xl text-white"
              >
                <span>ON</span>
                <span className="text-[#A82F19] ml-0.5">PRINT</span>
              </motion.div>
            </div>

            {/* Subtitle & Quality Tagline */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.95,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="mt-3 flex flex-col items-center gap-1.5"
            >
              <div className="text-[11px] sm:text-xs font-black uppercase tracking-[0.35em] text-slate-300">
                DUBAI COMMERCIAL PRESS
              </div>
              <div className="text-[9px] sm:text-[10px] font-semibold tracking-[0.25em] text-slate-500 uppercase">
                Premium Printing &amp; Luxury Packaging
              </div>
            </motion.div>

            {/* Progress Bar & Loader Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.4 }}
              className="mt-8 flex flex-col items-center w-48 sm:w-56"
            >
              <div className="h-1 w-full rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#A82F19] to-[#F36621] rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-2 text-[9px] font-mono tracking-widest text-slate-400">
                LOADING PRESSROOM {progress}%
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
