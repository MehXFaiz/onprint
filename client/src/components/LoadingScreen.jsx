import { useEffect, useState, useMemo } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import logoIconLight from '../assets/logo_icon_light.png'
import { Sparkles, ShieldCheck, Zap, ArrowRight } from 'lucide-react'

const SESSION_KEY = 'onprint-luxury-splash-v4'

const CALIBRATION_STEPS = [
  { progress: 24, label: 'Calibrating Heidelberg Speedmaster & HP Indigo...' },
  { progress: 58, label: 'Loading 600 GSM Cotton & 24K Hot Foil Plates...' },
  { progress: 86, label: 'Verifying ISO 12647 Color Separation Curves...' },
  { progress: 100, label: 'Pressroom Online • Welcome to ONPRINT Dubai' },
]

export default function LoadingScreen() {
  const reduce = useReducedMotion()
  const [visible, setVisible] = useState(false)
  const [percent, setPercent] = useState(0)

  // Current calibration status text
  const currentStep = useMemo(() => {
    if (percent < 35) return CALIBRATION_STEPS[0].label
    if (percent < 70) return CALIBRATION_STEPS[1].label
    if (percent < 95) return CALIBRATION_STEPS[2].label
    return CALIBRATION_STEPS[3].label
  }, [percent])

  useEffect(() => {
    // Show splash screen on first visit per session
    if (typeof window !== 'undefined' && window.sessionStorage.getItem(SESSION_KEY)) {
      return
    }
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(SESSION_KEY, '1')
    }

    if (reduce) return

    setVisible(true)

    // Smooth Progress Counter
    const interval = setInterval(() => {
      setPercent((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        const jump = Math.floor(Math.random() * 8) + 4
        return Math.min(prev + jump, 100)
      })
    }, 90)

    // Complete duration timer
    const exitTimer = setTimeout(() => {
      setVisible(false)
    }, 2800)

    return () => {
      clearInterval(interval)
      clearTimeout(exitTimer)
    }
  }, [reduce])

  // Allow Esc / Enter to skip splash screen
  useEffect(() => {
    function handleKeyDown(e) {
      if (visible && (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ')) {
        setVisible(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [visible])

  if (!visible) return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="onprint-luxury-splash"
          onClick={() => setVisible(false)}
          className="fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-[#05070B] text-white overflow-hidden select-none cursor-pointer"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.04,
            filter: 'blur(12px)',
            transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
          }}
          aria-label="ONPRINT Cinematic Intro"
        >
          {/* 1. ATMOSPHERIC CAUSTIC & RADIAL GLOWS */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Ambient Primary Crimson Glow */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[750px] h-[500px] sm:h-[750px] rounded-full"
              style={{
                background:
                  'radial-gradient(circle, rgba(168,47,25,0.22) 0%, rgba(168,47,25,0.06) 45%, rgba(5,7,11,0) 72%)',
              }}
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{
                scale: [0.7, 1.05, 0.98, 1.1],
                opacity: [0, 0.9, 0.75, 1],
              }}
              transition={{
                duration: 2.8,
                ease: 'easeInOut',
              }}
            />

            {/* Amber Luxury Foil Flare Accent */}
            <motion.div
              className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] rounded-full"
              style={{
                background:
                  'radial-gradient(circle, rgba(245,158,11,0.12) 0%, rgba(245,158,11,0.02) 50%, transparent 70%)',
              }}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{
                scale: [0.6, 1.1, 1],
                opacity: [0, 0.7, 0.5],
              }}
              transition={{
                duration: 2.4,
                delay: 0.2,
                ease: 'easeOut',
              }}
            />

            {/* Precision Architectural Grid Overlay */}
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: `
                  linear-gradient(to right, #ffffff 1px, transparent 1px),
                  linear-gradient(to bottom, #ffffff 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px',
              }}
            />
          </div>

          {/* 2. TECHNICAL PRESSROOM CORNER REGISTRATION HUD */}
          <div className="absolute inset-6 sm:inset-10 pointer-events-none flex flex-col justify-between text-[10px] font-mono tracking-[0.2em] text-slate-400">
            {/* Top Bar Registration */}
            <motion.div
              className="flex justify-between items-center"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="font-bold text-slate-200">HEIDELBERG SPEEDMASTER HD</span>
              </div>

              <div className="hidden sm:flex items-center gap-3 text-slate-400">
                <span className="flex items-center gap-1 text-slate-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" /> C
                </span>
                <span className="flex items-center gap-1 text-slate-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-pink-500" /> M
                </span>
                <span className="flex items-center gap-1 text-slate-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" /> Y
                </span>
                <span className="flex items-center gap-1 text-slate-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-200" /> K
                </span>
                <span className="text-slate-600">|</span>
                <span>ISO 12647-2</span>
              </div>
            </motion.div>

            {/* Bottom Bar Registration */}
            <motion.div
              className="flex justify-between items-end text-[9px] sm:text-[10px]"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="space-y-0.5">
                <div className="text-slate-500 font-medium">PRESSROOM LOCATION</div>
                <div className="text-slate-200 font-bold">AL QUOZ INDUSTRIAL 3 • DUBAI, UAE</div>
              </div>

              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-slate-300 hover:text-white transition-colors cursor-pointer pointer-events-auto">
                <span className="text-[9px] font-bold tracking-widest">ENTER PRESSROOM</span>
                <ArrowRight className="h-3 w-3 text-[#A82F19]" />
              </div>
            </motion.div>
          </div>

          {/* 3. CENTERPIECE: 3D EMBLEM & TYPOGRAPHIC REVEAL */}
          <div className="relative z-10 flex flex-col items-center justify-center px-4 text-center max-w-lg mx-auto">
            {/* 3D Floating Emblem Card */}
            <motion.div
              className="relative flex items-center justify-center mb-7"
              initial={{ opacity: 0, scale: 0.8, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                duration: 0.9,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {/* Outer Radiance Halo */}
              <motion.div
                className="absolute inset-[-14px] rounded-3xl bg-gradient-to-r from-[#A82F19]/40 via-amber-500/20 to-[#A82F19]/40 blur-2xl pointer-events-none"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: [0.4, 0.9, 0.6], scale: [0.7, 1.2, 1] }}
                transition={{ duration: 2.2, ease: 'easeInOut' }}
              />

              {/* Glass Frosted Tile Container */}
              <div className="relative flex items-center justify-center h-22 w-22 sm:h-26 sm:w-26 rounded-3xl bg-gradient-to-b from-white/[0.15] to-white/[0.04] border border-white/20 shadow-[0_12px_40px_rgba(0,0,0,0.8)] backdrop-blur-2xl p-4.5 overflow-hidden">
                {/* Diagonal Light Sweep */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      'linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.35) 50%, transparent 70%)',
                  }}
                  initial={{ x: '-150%' }}
                  animate={{ x: '150%' }}
                  transition={{
                    repeat: Infinity,
                    duration: 2.2,
                    ease: 'easeInOut',
                    repeatDelay: 0.8,
                  }}
                />

                <img
                  src={logoIconLight}
                  alt="ONPRINT Dubai Emblem"
                  className="relative z-10 h-full w-full object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.7)]"
                />
              </div>
            </motion.div>

            {/* Brand Title: ONPRINT with Letter Expansion */}
            <motion.div
              className="flex items-center justify-center text-4xl sm:text-6xl font-black uppercase tracking-[0.24em] text-white"
              initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{
                duration: 0.9,
                delay: 0.35,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <span className="font-extrabold text-white">ON</span>
              <span className="bg-gradient-to-r from-[#A82F19] via-[#E63920] to-[#A82F19] bg-clip-text text-transparent ml-0.5">
                PRINT
              </span>
            </motion.div>

            {/* Dubai Seal & Commercial Press Tagline */}
            <motion.div
              className="mt-3.5 flex flex-col items-center gap-2"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.55,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-white/[0.07] border border-white/10 px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.3em] text-slate-200 backdrop-blur-md">
                <Sparkles className="h-3 w-3 text-amber-400" />
                <span>DUBAI COMMERCIAL PRESS</span>
              </div>

              <span className="text-[9.5px] sm:text-[10.5px] font-medium tracking-[0.25em] text-slate-400 uppercase">
                Luxury Substrates • 24K Hot Foil • Precision Offset
              </span>
            </motion.div>

            {/* 4. HIGH-PRECISION LASER PROGRESS RAIL */}
            <div className="mt-9 w-64 sm:w-80">
              {/* Status Text & Percentage */}
              <div className="flex items-center justify-between text-[11px] font-mono mb-2">
                <span className="text-slate-400 truncate max-w-[200px] sm:max-w-none text-[10px]">
                  {currentStep}
                </span>
                <span className="font-bold text-amber-400 ml-2">{percent}%</span>
              </div>

              {/* Progress Rail */}
              <div className="relative h-1.5 w-full rounded-full bg-white/10 overflow-hidden border border-white/5">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#A82F19] via-[#E63920] to-amber-400 rounded-full relative"
                  style={{ width: `${percent}%` }}
                  transition={{ ease: 'easeOut', duration: 0.1 }}
                >
                  {/* Glowing Laser Leading Head */}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-white shadow-[0_0_12px_#ffffff] -mr-1.5" />
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
