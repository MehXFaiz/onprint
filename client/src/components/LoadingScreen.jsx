import { useEffect, useState, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import logoIconLight from '../assets/logo_icon_light.png'

const SESSION_KEY = 'onprint_splash_shown'

// Ultra-smooth luxury easing curve (cinematic deceleration)
const LUXURY_EASE = [0.22, 1, 0.36, 1]

export default function LoadingScreen() {
  const location = useLocation()
  const reduce = useReducedMotion()
  const [visible, setVisible] = useState(false)
  const [phase, setPhase] = useState(0)
  // phase 0: initial blank canvas (Midnight Navy)
  // phase 1: print-reveal logo (smooth left-to-right)
  // phase 2: Champagne Gold line beneath logo
  // phase 3: subtle gold light sweep across logo
  // phase 4: tagline reveal ("YOUR IDEAS. BEAUTIFULLY PRINTED.")
  // phase 5: smooth fade-out transition into homepage

  const isMountedRef = useRef(true)

  // Show splash ONLY on the root homepage ('/' or '')
  // Deep product, service, and landing pages render instantly with 0 delay.
  const isRootPage = location.pathname === '/' || location.pathname === ''

  useEffect(() => {
    isMountedRef.current = true

    if (!isRootPage) {
      return
    }

    // Safely check sessionStorage
    try {
      if (typeof window !== 'undefined' && window.sessionStorage.getItem(SESSION_KEY)) {
        return
      }
    } catch {
      // If sessionStorage is unavailable or blocked, proceed safely
    }

    // If user prefers reduced motion, skip splash immediately
    if (reduce) {
      try {
        if (typeof window !== 'undefined') {
          window.sessionStorage.setItem(SESSION_KEY, '1')
        }
      } catch {}
      return
    }

    // Mark as shown for the current browser session
    try {
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(SESSION_KEY, '1')
      }
    } catch {}

    setVisible(true)

    // Sequence timing: ~1.2s total active sequence + 0.35s exit fade
    // 1. Start print-reveal of logo
    const t1 = setTimeout(() => {
      if (isMountedRef.current) setPhase(1)
    }, 80)

    // 2. Animate thin Champagne Gold line beneath the logo
    const t2 = setTimeout(() => {
      if (isMountedRef.current) setPhase(2)
    }, 520)

    // 3. Subtle gold light sweep across the logo
    const t3 = setTimeout(() => {
      if (isMountedRef.current) setPhase(3)
    }, 680)

    // 4. Reveal tagline: "YOUR IDEAS. BEAUTIFULLY PRINTED."
    const t4 = setTimeout(() => {
      if (isMountedRef.current) setPhase(4)
    }, 820)

    // 5. Begin smooth transition into the homepage
    const t5 = setTimeout(() => {
      if (isMountedRef.current) setPhase(5)
    }, 1200)

    // 6. Complete unmount
    const tExit = setTimeout(() => {
      if (isMountedRef.current) setVisible(false)
    }, 1500)

    // Hard fallback safety timer (guarantees exit even if any timer is delayed)
    const tFallback = setTimeout(() => {
      if (isMountedRef.current) setVisible(false)
    }, 1650)

    return () => {
      isMountedRef.current = false
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
      clearTimeout(t5)
      clearTimeout(tExit)
      clearTimeout(tFallback)
    }
  }, [reduce, isRootPage])

  // Allow clicking anywhere or pressing Escape / Enter / Space to bypass immediately
  useEffect(() => {
    function handleKeyDown(e) {
      if (visible && (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ')) {
        setVisible(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [visible])

  if (!isRootPage || !visible) return null

  return (
    <AnimatePresence>
      {visible && phase < 5 && (
        <motion.div
          key="onprint-luxury-splash"
          onClick={() => setVisible(false)}
          className="fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-[#040A18] text-white overflow-hidden select-none cursor-pointer"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.35, ease: LUXURY_EASE },
          }}
          role="status"
          aria-live="polite"
          aria-label="ONPRINT Luxury Printing Dubai"
        >
          {/* Subtle Atelier Ambient Vignette (Deep Midnight Navy Depth) */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(22, 37, 66, 0.75) 0%, rgba(16, 29, 53, 0.95) 65%, #020611 100%)',
            }}
          />

          {/* Minimalist Accessible Skip Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setVisible(false)
            }}
            className="absolute top-5 right-5 sm:top-6 sm:right-8 z-50 px-3 py-1 rounded-full text-[10px] font-mono tracking-widest text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors pointer-events-auto cursor-pointer"
            aria-label="Skip splash screen"
          >
            SKIP ✕
          </button>

          {/* Centerpiece Container */}
          <div className="relative z-10 flex flex-col items-center justify-center px-4 max-w-lg mx-auto w-full">
            {/* ======================================================== */}
            {/* 1. ONPRINT LOGO PRINT-REVEAL (Left to Right)             */}
            {/* ======================================================== */}
            <div className="relative inline-flex items-center justify-center py-2 px-1">
              {/* Animated Reveal Wrapper with Left-to-Right Clip Mask */}
              <motion.div
                className="relative inline-flex items-center justify-center gap-3 sm:gap-4 overflow-hidden"
                initial={{ clipPath: 'inset(0 100% 0 0)' }}
                animate={
                  phase >= 1
                    ? { clipPath: 'inset(0 0% 0 0)' }
                    : { clipPath: 'inset(0 100% 0 0)' }
                }
                transition={{
                  duration: 0.55,
                  ease: LUXURY_EASE,
                }}
              >
                {/* Official ONPRINT Light Icon Emblem */}
                <div className="relative shrink-0 flex items-center justify-center">
                  <img
                    src={logoIconLight}
                    alt="ONPRINT Icon"
                    className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]"
                    loading="eager"
                  />
                </div>

                {/* Official ONPRINT Brand Wordmark */}
                <div className="flex flex-col justify-center leading-none">
                  <span className="font-black uppercase font-display text-3xl sm:text-4xl md:text-5xl tracking-widest text-white drop-shadow-[0_2px_12px_rgba(255,255,255,0.15)]">
                    ON<span className="text-[#D4AF65]">PRINT</span>
                  </span>
                </div>

                {/* Subtle Gold Light Sweep Across Logo (Step 4) */}
                <motion.div
                  className="pointer-events-none absolute inset-0 z-20"
                  style={{
                    background:
                      'linear-gradient(105deg, transparent 20%, rgba(255, 255, 255, 0.35) 48%, rgba(212, 175, 101, 0.55) 52%, transparent 80%)',
                    transform: 'skewX(-22deg)',
                  }}
                  initial={{ x: '-160%', opacity: 0 }}
                  animate={
                    phase >= 3
                      ? { x: '160%', opacity: [0, 1, 1, 0] }
                      : { x: '-160%', opacity: 0 }
                  }
                  transition={{
                    duration: 0.48,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                />
              </motion.div>

              {/* Vertical Precision Printhead Guide (Sweeps Left to Right with Reveal) */}
              <motion.div
                className="pointer-events-none absolute top-0 bottom-0 w-[2px] z-30"
                style={{
                  background:
                    'linear-gradient(180deg, transparent 0%, #D4AF65 25%, #FFFFFF 50%, #D4AF65 75%, transparent 100%)',
                  boxShadow:
                    '0 0 10px rgba(212, 175, 101, 0.9), 0 0 20px rgba(212, 175, 101, 0.5)',
                }}
                initial={{ left: '0%', opacity: 0 }}
                animate={
                  phase === 1
                    ? { left: ['0%', '100%'], opacity: [0, 1, 1, 0] }
                    : { left: '100%', opacity: 0 }
                }
                transition={{
                  duration: 0.55,
                  ease: LUXURY_EASE,
                }}
              />
            </div>

            {/* ======================================================== */}
            {/* 2. THIN CHAMPAGNE GOLD LINE BENEATH LOGO (Step 3)        */}
            {/* ======================================================== */}
            <div className="mt-4 sm:mt-5 w-48 sm:w-64 md:w-80 h-[1.5px] rounded-full overflow-hidden relative">
              <motion.div
                className="h-full w-full rounded-full"
                style={{
                  background:
                    'linear-gradient(90deg, transparent 0%, #D4AF65 20%, #D4AF65 80%, transparent 100%)',
                  boxShadow: '0 0 12px rgba(212, 175, 101, 0.75)',
                }}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={
                  phase >= 2
                    ? { scaleX: 1, opacity: 1 }
                    : { scaleX: 0, opacity: 0 }
                }
                transition={{
                  duration: 0.42,
                  ease: LUXURY_EASE,
                }}
              />
            </div>

            {/* ======================================================== */}
            {/* 3. TAGLINE REVEAL (Step 5)                                */}
            {/* "YOUR IDEAS. BEAUTIFULLY PRINTED."                       */}
            {/* ======================================================== */}
            <motion.p
              className="mt-3.5 sm:mt-4 text-[10px] sm:text-xs md:text-sm font-medium tracking-[0.22em] sm:tracking-[0.32em] text-slate-200 uppercase text-center"
              initial={{ opacity: 0, y: 6 }}
              animate={
                phase >= 4
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 6 }
              }
              transition={{
                duration: 0.35,
                ease: LUXURY_EASE,
              }}
            >
              YOUR IDEAS. BEAUTIFULLY PRINTED.
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
