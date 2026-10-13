import { useEffect, useState, useRef } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import logoLight from '../assets/logo_light.png'

const SESSION_KEY = 'onprint-splash-v6'

// Luxury motion curve - ultra smooth, fluid, cinematic deceleration
const LUXURY_EASE = [0.22, 1, 0.36, 1]
const GENTLE_EASE = [0.25, 0.1, 0.25, 1]

export default function LoadingScreen() {
  const reduce = useReducedMotion()
  const [visible, setVisible] = useState(false)
  const [phase, setPhase] = useState(0) // 0: sweep & paper entry, 1: logo & light sweep, 2: progress line, 3: tagline & loading, 4: smooth exit
  const isMountedRef = useRef(true)

  useEffect(() => {
    isMountedRef.current = true

    // Check if session storage already saw splash in this session
    if (typeof window !== 'undefined' && window.sessionStorage.getItem(SESSION_KEY)) {
      return
    }

    // If reduced motion is requested by user OS, skip animation instantly
    if (reduce) {
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(SESSION_KEY, '1')
      }
      return
    }

    // Mark as shown for the current browsing session
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(SESSION_KEY, '1')
    }

    setVisible(true)

    // Fast, ultra-smooth cinematic timeline (1.4s total):
    // 0.0s: Deep matte-black, ambient orange rim light, smooth entry
    // 0.25s: Phase 1 - Metallic logo reveal with depth and light sweep
    // 0.60s: Phase 2 - Thin vivid orange progress line smoothly glides across
    // 0.90s: Phase 3 - Tagline "PRINT · BRAND · GROW" & "LOADING YOUR IDEAS…"
    // 1.25s: Phase 4 - Poised completion
    // 1.40s: Seamless exit into homepage
    const t1 = setTimeout(() => {
      if (isMountedRef.current) setPhase(1)
    }, 250)

    const t2 = setTimeout(() => {
      if (isMountedRef.current) setPhase(2)
    }, 600)

    const t3 = setTimeout(() => {
      if (isMountedRef.current) setPhase(3)
    }, 900)

    const t4 = setTimeout(() => {
      if (isMountedRef.current) setPhase(4)
    }, 1250)

    const exitTimer = setTimeout(() => {
      if (isMountedRef.current) setVisible(false)
    }, 1400)

    return () => {
      isMountedRef.current = false
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
      clearTimeout(exitTimer)
    }
  }, [reduce])

  // Allow clicking anywhere or pressing Esc/Enter/Space to smoothly bypass
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
          key="onprint-cinematic-splash"
          onClick={() => setVisible(false)}
          className="fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-[#080808] text-white overflow-hidden select-none cursor-pointer"
          style={{
            perspective: '1400px',
            transformStyle: 'preserve-3d',
          }}
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.025,
            filter: 'blur(10px)',
            transition: { duration: 0.85, ease: LUXURY_EASE },
          }}
          role="status"
          aria-live="polite"
          aria-label="ONPRINT Luxury Splash"
        >
          {/* ======================================================== */}
          {/* 1. DEEP MATTE BLACK BACKGROUND & SUBTLE NOISE TEXTURE     */}
          {/* ======================================================== */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Lightweight High-Performance Studio Texture */}
            <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

            {/* Subtle Vignette & Studio Lighting Falloff */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(ellipse 85% 70% at 50% 50%, rgba(22, 22, 22, 0.75) 0%, rgba(8, 8, 8, 0.98) 75%, #040404 100%)',
              }}
            />

            {/* Dramatic Vivid Orange Rim Lighting Sweep (Step 1) - Silky Slow */}
            <motion.div
              className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[800px] sm:w-[1100px] h-[400px] sm:h-[550px] rounded-full blur-[130px] pointer-events-none"
              style={{
                background:
                  'radial-gradient(circle, rgba(255, 106, 0, 0.26) 0%, rgba(255, 106, 0, 0.08) 50%, transparent 75%)',
              }}
              initial={{ scale: 0.65, opacity: 0, y: -50 }}
              animate={{
                scale: [0.65, 1.15, 1],
                opacity: [0, 0.9, 0.65],
                y: [-50, 20, 0],
              }}
              transition={{
                duration: 3.2,
                ease: LUXURY_EASE,
              }}
            />

            {/* Bottom Subtle Amber Counter-Light for Depth */}
            <motion.div
              className="absolute -bottom-[25%] left-1/2 -translate-x-1/2 w-[700px] sm:w-[1000px] h-[380px] rounded-full blur-[110px] pointer-events-none"
              style={{
                background:
                  'radial-gradient(circle, rgba(255, 106, 0, 0.16) 0%, rgba(255, 106, 0, 0.03) 60%, transparent 80%)',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.65, 0.45] }}
              transition={{ duration: 3.2, delay: 0.3, ease: GENTLE_EASE }}
            />

            {/* Diagonal Anamorphic Orange Light Beam Sweeping Across Frame */}
            <motion.div
              className="absolute inset-0 pointer-events-none overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                className="absolute top-0 bottom-0 w-[180px] sm:w-[260px]"
                style={{
                  background:
                    'linear-gradient(90deg, transparent 0%, rgba(255, 106, 0, 0.12) 42%, rgba(255, 255, 255, 0.22) 50%, rgba(255, 106, 0, 0.12) 58%, transparent 100%)',
                  transform: 'skewX(-26deg)',
                  filter: 'blur(14px)',
                }}
                initial={{ left: '-35%' }}
                animate={{ left: '135%' }}
                transition={{
                  duration: 2.8,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
              />
            </motion.div>
          </div>

          {/* ======================================================== */}
          {/* 2. 3D PREMIUM PRINT MATERIALS FLOWING FROM EDGES          */}
          {/* (Step 2: Business cards, luxury boxes, glossy sheets)     */}
          {/* Center kept pristine so Logo is the undeniable hero       */}
          {/* Slow, fluid, physics-grade drift                          */}
          {/* ======================================================== */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Top-Left: Luxury Heavy Cotton Business Card (600 GSM, 24K Gilded Edge) */}
            <motion.div
              className="absolute -top-12 -left-12 sm:-top-8 sm:-left-8 w-44 sm:w-60 h-28 sm:h-36 rounded-xl border border-white/10 overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #181818 0%, #101010 60%, #0d0d0d 100%)',
                boxShadow:
                  '0 25px 60px rgba(0,0,0,0.95), inset 0 1px 0 rgba(255,255,255,0.18), 0 0 0 1px rgba(255,106,0,0.3)',
                transformStyle: 'preserve-3d',
              }}
              initial={{
                x: -160,
                y: -120,
                rotateX: 28,
                rotateY: 24,
                rotateZ: -26,
                opacity: 0,
              }}
              animate={{
                x: [-160, -10, -5],
                y: [-120, 10, 14],
                rotateX: [28, 16, 14],
                rotateY: [24, 14, 12],
                rotateZ: [-26, -16, -14],
                opacity: [0, 0.85, 0.85],
              }}
              transition={{
                duration: 3.4,
                ease: LUXURY_EASE,
              }}
            >
              {/* Subtle Foil Pattern On Card */}
              <div className="absolute inset-0 p-4 flex flex-col justify-between opacity-50">
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-[#FF6A00]" />
                  <div className="h-1.5 w-14 rounded-full bg-white/20" />
                </div>
                <div className="space-y-1">
                  <div className="h-1 w-20 rounded-full bg-white/15" />
                  <div className="h-1 w-12 rounded-full bg-white/10" />
                </div>
              </div>
              {/* Gilded Edge Highlight */}
              <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#FF6A00] via-amber-300 to-[#FF6A00] opacity-80" />
            </motion.div>

            {/* Top-Right: Glossy Coated Art Paper Sheet with Rim Reflection */}
            <motion.div
              className="absolute -top-16 -right-14 sm:-top-10 sm:-right-8 w-52 sm:w-72 h-36 sm:h-48 rounded-2xl border border-white/10 overflow-hidden"
              style={{
                background:
                  'linear-gradient(215deg, rgba(35,35,35,0.7) 0%, rgba(18,18,18,0.85) 60%, rgba(10,10,10,0.95) 100%)',
                boxShadow:
                  '0 30px 70px rgba(0,0,0,0.9), inset 1px 1px 0 rgba(255,255,255,0.22), inset -1px -1px 0 rgba(255,106,0,0.25)',
                backdropFilter: 'blur(12px)',
                transformStyle: 'preserve-3d',
              }}
              initial={{
                x: 180,
                y: -140,
                rotateX: -24,
                rotateY: -32,
                rotateZ: 20,
                opacity: 0,
              }}
              animate={{
                x: [180, 20, 16],
                y: [-140, 10, 14],
                rotateX: [-24, -14, -12],
                rotateY: [-32, -18, -16],
                rotateZ: [20, 12, 10],
                opacity: [0, 0.8, 0.8],
              }}
              transition={{
                duration: 3.5,
                delay: 0.1,
                ease: LUXURY_EASE,
              }}
            >
              {/* Specular Light Reflection Sweep on Glossy Surface */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(135deg, transparent 35%, rgba(255,255,255,0.18) 50%, transparent 65%)',
                }}
              />
            </motion.div>

            {/* Bottom-Left: Luxury Matte Black Rigid Packaging Box Corner */}
            <motion.div
              className="absolute -bottom-14 -left-12 sm:-bottom-10 sm:-left-6 w-48 sm:w-64 h-32 sm:h-44 rounded-xl border border-white/5 overflow-hidden"
              style={{
                background: 'linear-gradient(45deg, #0e0e0e 0%, #151515 50%, #1c1c1c 100%)',
                boxShadow:
                  '0 -20px 60px rgba(0,0,0,0.95), inset 0 1px 0 rgba(255,255,255,0.12), inset 0 0 20px rgba(0,0,0,0.7)',
                transformStyle: 'preserve-3d',
              }}
              initial={{
                x: -170,
                y: 150,
                rotateX: -28,
                rotateY: 28,
                rotateZ: 14,
                opacity: 0,
              }}
              animate={{
                x: [-170, -15, -12],
                y: [150, -15, -18],
                rotateX: [-28, -16, -14],
                rotateY: [28, 16, 14],
                rotateZ: [14, 8, 7],
                opacity: [0, 0.85, 0.85],
              }}
              transition={{
                duration: 3.6,
                delay: 0.15,
                ease: LUXURY_EASE,
              }}
            >
              {/* Embossed Detail Line */}
              <div className="absolute inset-x-0 top-3 h-0.5 bg-gradient-to-r from-transparent via-[#FF6A00]/40 to-transparent" />
            </motion.div>

            {/* Bottom-Right: Foil-Stamped Print Sample / Presentation Sheet */}
            <motion.div
              className="absolute -bottom-16 -right-12 sm:-bottom-10 sm:-right-8 w-44 sm:w-60 h-28 sm:h-36 rounded-xl border border-white/10 overflow-hidden"
              style={{
                background: 'linear-gradient(315deg, #101010 0%, #1a1a1a 70%, #242424 100%)',
                boxShadow:
                  '0 -25px 60px rgba(0,0,0,0.95), inset -1px -1px 0 rgba(255,106,0,0.35), inset 1px 1px 0 rgba(255,255,255,0.15)',
                transformStyle: 'preserve-3d',
              }}
              initial={{
                x: 160,
                y: 140,
                rotateX: 24,
                rotateY: -28,
                rotateZ: -18,
                opacity: 0,
              }}
              animate={{
                x: [160, 15, 12],
                y: [140, -15, -18],
                rotateX: [24, 14, 12],
                rotateY: [-28, -16, -14],
                rotateZ: [-18, -10, -9],
                opacity: [0, 0.85, 0.85],
              }}
              transition={{
                duration: 3.65,
                delay: 0.18,
                ease: LUXURY_EASE,
              }}
            >
              {/* Metallic Foil Stamp Accents */}
              <div className="absolute top-3 right-4 flex items-center gap-1.5 opacity-70">
                <div className="h-1.5 w-1.5 rounded-full bg-[#FF6A00]" />
                <div className="text-[7px] font-mono tracking-widest text-[#FF6A00] font-bold">
                  24K FOIL
                </div>
              </div>
            </motion.div>
          </div>

          {/* ======================================================== */}
          {/* 3. CENTERPIECE: METALLIC LOGO WITH VIVID ORANGE ACCENT    */}
          {/* (Step 3: Reveal with metallic sweep & subtle 3D depth)   */}
          {/* Silky smooth glide upward with graceful ease-out curve    */}
          {/* ======================================================== */}
          <div className="relative z-20 flex flex-col items-center justify-center px-6 text-center max-w-xl mx-auto">
            {/* 3D Floating Emblem Card */}
            <motion.div
              className="relative flex items-center justify-center mb-6 sm:mb-8"
              initial={{ opacity: 0, scale: 0.86, y: 28 }}
              animate={
                phase >= 1
                  ? { opacity: 1, scale: 1, y: 0 }
                  : { opacity: 0, scale: 0.86, y: 28 }
              }
              transition={{
                duration: 1.25,
                ease: LUXURY_EASE,
              }}
            >
              {/* Dramatic Orange Studio Backlight Glow Behind Logo */}
              <motion.div
                className="absolute inset-[-28px] sm:inset-[-42px] rounded-full pointer-events-none"
                style={{
                  background:
                    'radial-gradient(circle, rgba(255, 106, 0, 0.38) 0%, rgba(255, 106, 0, 0.12) 42%, transparent 70%)',
                  filter: 'blur(32px)',
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={
                  phase >= 1
                    ? { opacity: [0.3, 0.85, 0.7], scale: [0.8, 1.1, 1] }
                    : { opacity: 0, scale: 0.8 }
                }
                transition={{
                  duration: 2.2,
                  ease: GENTLE_EASE,
                }}
              />

              {/* Sophisticated Metallic Specular Card Frame */}
              <div
                className="relative flex items-center justify-center h-28 w-28 sm:h-36 sm:w-36 rounded-3xl p-5 overflow-hidden border border-white/15"
                style={{
                  background:
                    'linear-gradient(160deg, rgba(25,25,25,0.88) 0%, rgba(12,12,12,0.96) 100%)',
                  boxShadow:
                    '0 24px 60px rgba(0,0,0,0.95), inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -1px 0 rgba(255,106,0,0.3)',
                  backdropFilter: 'blur(16px)',
                }}
              >
                {/* Real-time Metallic Light Sweep Across Emblem */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      'linear-gradient(118deg, transparent 20%, rgba(255, 255, 255, 0.35) 48%, rgba(255, 106, 0, 0.38) 52%, transparent 80%)',
                  }}
                  initial={{ x: '-160%' }}
                  animate={phase >= 1 ? { x: '160%' } : { x: '-160%' }}
                  transition={{
                    duration: 1.8,
                    delay: 0.25,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                />

                {/* Actual ONPRINT High-Res Light Logo Emblem with Vivid Orange Accent */}
                <img
                  src={logoLight}
                  alt="ONPRINT"
                  className="relative z-10 h-full w-full object-contain filter drop-shadow-[0_10px_22px_rgba(0,0,0,0.85)]"
                  loading="eager"
                />
              </div>
            </motion.div>

            {/* Bold Elegant Brand Name in Metallic White */}
            <motion.div
              className="flex items-center justify-center text-3xl sm:text-5xl font-black uppercase tracking-[0.28em] text-[#F5F5F5]"
              style={{
                textShadow:
                  '0 2px 20px rgba(255, 255, 255, 0.25), 0 10px 30px rgba(0, 0, 0, 0.9)',
              }}
              initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }}
              animate={
                phase >= 1
                  ? { opacity: 1, y: 0, filter: 'blur(0px)' }
                  : { opacity: 0, y: 18, filter: 'blur(8px)' }
              }
              transition={{
                duration: 1.15,
                delay: 0.15,
                ease: LUXURY_EASE,
              }}
            >
              <span className="text-[#F5F5F5]">ON</span>
              <span className="text-[#FF6A00] ml-0.5">PRINT</span>
            </motion.div>

            {/* ======================================================== */}
            {/* 4. THIN VIVID ORANGE PROGRESS LINE (Step 4)               */}
            {/* Silky smooth continuous glide                             */}
            {/* ======================================================== */}
            <div className="mt-5 sm:mt-6 w-48 sm:w-64 h-[2px] bg-white/10 rounded-full overflow-hidden relative">
              <motion.div
                className="h-full rounded-full relative"
                style={{
                  background:
                    'linear-gradient(90deg, #FF6A00 0%, #FF8533 50%, #FFA366 100%)',
                  boxShadow: '0 0 16px rgba(255, 106, 0, 0.85)',
                }}
                initial={{ width: '0%' }}
                animate={phase >= 2 ? { width: '100%' } : { width: '0%' }}
                transition={{
                  duration: 1.4,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {/* Glowing Leading Flare */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-white shadow-[0_0_10px_#ffffff] -mr-1" />
              </motion.div>
            </div>

            {/* ======================================================== */}
            {/* 5. TAGLINE: PRINT · BRAND · GROW (Step 5)                 */}
            {/* ======================================================== */}
            <motion.div
              className="mt-4 sm:mt-5 text-[11px] sm:text-xs font-semibold tracking-[0.44em] text-[#E2E8F0] uppercase"
              initial={{ opacity: 0, y: 10 }}
              animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{
                duration: 0.95,
                ease: LUXURY_EASE,
              }}
            >
              <span>PRINT</span>
              <span className="text-[#FF6A00] mx-2 font-bold">·</span>
              <span>BRAND</span>
              <span className="text-[#FF6A00] mx-2 font-bold">·</span>
              <span>GROW</span>
            </motion.div>

            {/* ======================================================== */}
            {/* 6. "LOADING YOUR IDEAS…" (Step 6)                         */}
            {/* Small, elegant, letter-spaced typography, NO fake numbers  */}
            {/* ======================================================== */}
            <motion.div
              className="mt-6 flex items-center justify-center gap-2.5 text-[9px] sm:text-[10px] font-mono tracking-[0.38em] text-[#888888] uppercase"
              initial={{ opacity: 0 }}
              animate={phase >= 3 ? { opacity: 0.85 } : { opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#FF6A00] animate-pulse" />
              <span>LOADING YOUR IDEAS…</span>
            </motion.div>
          </div>

          {/* ======================================================== */}
          {/* SUBTLE ESCAPE SHORTCUT HINT (Non-intrusive)               */}
          {/* ======================================================== */}
          <div className="absolute bottom-6 right-8 text-[9px] font-mono tracking-widest text-white/30 hidden sm:block pointer-events-none">
            ESC TO SKIP
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
