import { useEffect, useState, useRef } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import logoLight from '../assets/logo_light.png'

const SESSION_KEY = 'onprint-splash-v5'

export default function LoadingScreen() {
  const reduce = useReducedMotion()
  const [visible, setVisible] = useState(false)
  const [phase, setPhase] = useState(0) // 0: sweep/curtains, 1: logo reveal, 2: progress + tagline, 3: ready to exit
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

    // Sequence timing milestones (Total ~1.85 seconds)
    // 0ms: Initial darkness, orange atmospheric light sweep begins, paper sheets flow into view
    // 400ms: Phase 1 - Logo reveals with metallic sweep and 3D depth
    // 850ms: Phase 2 - Orange progress line animates + Tagline "PRINT · BRAND · GROW" fades in
    // 1450ms: Phase 3 - "LOADING YOUR IDEAS..." active & page ready check
    // 1850ms: Smooth seamless exit fade into homepage
    const t1 = setTimeout(() => {
      if (isMountedRef.current) setPhase(1)
    }, 380)

    const t2 = setTimeout(() => {
      if (isMountedRef.current) setPhase(2)
    }, 850)

    const t3 = setTimeout(() => {
      if (isMountedRef.current) setPhase(3)
    }, 1450)

    const exitTimer = setTimeout(() => {
      if (isMountedRef.current) setVisible(false)
    }, 1900)

    return () => {
      isMountedRef.current = false
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(exitTimer)
    }
  }, [reduce])

  // Allow clicking anywhere or pressing Esc/Enter/Space to instantly bypass
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
            perspective: '1200px',
            transformStyle: 'preserve-3d',
          }}
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.03,
            filter: 'blur(8px)',
            transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
          }}
          role="status"
          aria-live="polite"
          aria-label="ONPRINT Luxury Splash"
        >
          {/* ======================================================== */}
          {/* 1. DEEP MATTE BLACK BACKGROUND & SUBTLE NOISE TEXTURE     */}
          {/* ======================================================== */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Fine Studio Noise Texture (SVG procedural grain) */}
            <svg
              className="absolute inset-0 h-full w-full opacity-[0.035] mix-blend-overlay"
              xmlns="http://www.w3.org/2000/svg"
            >
              <filter id="splash-noise">
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.8"
                  numOctaves="4"
                  stitchTiles="stitch"
                />
                <feColorMatrix type="saturate" values="0" />
              </filter>
              <rect width="100%" height="100%" filter="url(#splash-noise)" />
            </svg>

            {/* Subtle Vignette & Studio Lighting Falloff */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(ellipse 80% 65% at 50% 50%, rgba(20, 20, 20, 0.8) 0%, rgba(8, 8, 8, 0.98) 75%, #050505 100%)',
              }}
            />

            {/* Dramatic Vivid Orange Rim Lighting Sweep (Step 1) */}
            <motion.div
              className="absolute -top-[15%] left-1/2 -translate-x-1/2 w-[700px] sm:w-[1000px] h-[350px] sm:h-[450px] rounded-full blur-[110px] pointer-events-none"
              style={{
                background:
                  'radial-gradient(circle, rgba(255, 106, 0, 0.28) 0%, rgba(255, 106, 0, 0.08) 50%, transparent 75%)',
              }}
              initial={{ scale: 0.6, opacity: 0, y: -40 }}
              animate={{
                scale: [0.6, 1.15, 0.95],
                opacity: [0, 0.85, 0.6],
                y: [-40, 20, 0],
              }}
              transition={{
                duration: 1.8,
                ease: [0.16, 1, 0.3, 1],
              }}
            />

            {/* Bottom Subtle Amber Counter-Light for Depth */}
            <motion.div
              className="absolute -bottom-[20%] left-1/2 -translate-x-1/2 w-[600px] sm:w-[900px] h-[300px] rounded-full blur-[90px] pointer-events-none"
              style={{
                background:
                  'radial-gradient(circle, rgba(255, 106, 0, 0.16) 0%, rgba(255, 106, 0, 0.03) 60%, transparent 80%)',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.6, 0.4] }}
              transition={{ duration: 1.8, delay: 0.2 }}
            />

            {/* Diagonal Anamorphic Orange Light Beam Sweeping Across Frame */}
            <motion.div
              className="absolute inset-0 pointer-events-none overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <motion.div
                className="absolute top-0 bottom-0 w-[140px] sm:w-[220px]"
                style={{
                  background:
                    'linear-gradient(90deg, transparent 0%, rgba(255, 106, 0, 0.15) 45%, rgba(255, 255, 255, 0.25) 50%, rgba(255, 106, 0, 0.15) 55%, transparent 100%)',
                  transform: 'skewX(-28deg)',
                  filter: 'blur(10px)',
                }}
                initial={{ left: '-30%' }}
                animate={{ left: '130%' }}
                transition={{
                  duration: 1.6,
                  ease: [0.2, 0.8, 0.2, 1],
                }}
              />
            </motion.div>
          </div>

          {/* ======================================================== */}
          {/* 2. 3D PREMIUM PRINT MATERIALS FLOWING FROM EDGES          */}
          {/* (Step 2: Business cards, luxury boxes, glossy sheets)     */}
          {/* Center kept pristine so Logo is the undeniable hero       */}
          {/* ======================================================== */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Top-Left: Luxury Heavy Cotton Business Card (600 GSM, 24K Gilded Edge) */}
            <motion.div
              className="absolute -top-12 -left-12 sm:-top-8 sm:-left-8 w-44 sm:w-60 h-28 sm:h-36 rounded-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.9)] overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #181818 0%, #101010 60%, #0d0d0d 100%)',
                boxShadow:
                  '0 25px 60px rgba(0,0,0,0.95), inset 0 1px 0 rgba(255,255,255,0.18), 0 0 0 1px rgba(255,106,0,0.3)',
                transformStyle: 'preserve-3d',
              }}
              initial={{
                x: -180,
                y: -140,
                rotateX: 30,
                rotateY: 25,
                rotateZ: -28,
                opacity: 0,
              }}
              animate={{
                x: -10,
                y: 10,
                rotateX: 20,
                rotateY: 15,
                rotateZ: -18,
                opacity: 0.85,
              }}
              transition={{
                duration: 1.4,
                ease: [0.16, 1, 0.3, 1],
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
                x: 200,
                y: -160,
                rotateX: -25,
                rotateY: -35,
                rotateZ: 22,
                opacity: 0,
              }}
              animate={{
                x: 20,
                y: 10,
                rotateX: -16,
                rotateY: -20,
                rotateZ: 14,
                opacity: 0.8,
              }}
              transition={{
                duration: 1.45,
                delay: 0.08,
                ease: [0.16, 1, 0.3, 1],
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
                x: -190,
                y: 170,
                rotateX: -30,
                rotateY: 30,
                rotateZ: 15,
                opacity: 0,
              }}
              animate={{
                x: -15,
                y: -15,
                rotateX: -18,
                rotateY: 18,
                rotateZ: 10,
                opacity: 0.85,
              }}
              transition={{
                duration: 1.5,
                delay: 0.12,
                ease: [0.16, 1, 0.3, 1],
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
                x: 180,
                y: 160,
                rotateX: 25,
                rotateY: -30,
                rotateZ: -20,
                opacity: 0,
              }}
              animate={{
                x: 15,
                y: -15,
                rotateX: 15,
                rotateY: -18,
                rotateZ: -12,
                opacity: 0.85,
              }}
              transition={{
                duration: 1.55,
                delay: 0.15,
                ease: [0.16, 1, 0.3, 1],
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
          {/* ======================================================== */}
          <div className="relative z-20 flex flex-col items-center justify-center px-6 text-center max-w-xl mx-auto">
            {/* 3D Floating Emblem Card */}
            <motion.div
              className="relative flex items-center justify-center mb-6 sm:mb-8"
              initial={{ opacity: 0, scale: 0.82, y: 22 }}
              animate={
                phase >= 1
                  ? { opacity: 1, scale: 1, y: 0 }
                  : { opacity: 0, scale: 0.82, y: 22 }
              }
              transition={{
                duration: 0.85,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {/* Dramatic Orange Studio Backlight Glow Behind Logo */}
              <div
                className="absolute inset-[-24px] sm:inset-[-36px] rounded-full pointer-events-none opacity-80"
                style={{
                  background:
                    'radial-gradient(circle, rgba(255, 106, 0, 0.35) 0%, rgba(255, 106, 0, 0.12) 42%, transparent 70%)',
                  filter: 'blur(28px)',
                }}
              />

              {/* Sophisticated Metallic Specular Card Frame */}
              <div
                className="relative flex items-center justify-center h-28 w-28 sm:h-36 sm:w-36 rounded-3xl p-5 overflow-hidden border border-white/15"
                style={{
                  background:
                    'linear-gradient(160deg, rgba(25,25,25,0.85) 0%, rgba(12,12,12,0.95) 100%)',
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
                      'linear-gradient(118deg, transparent 20%, rgba(255, 255, 255, 0.32) 48%, rgba(255, 106, 0, 0.35) 52%, transparent 80%)',
                  }}
                  initial={{ x: '-160%' }}
                  animate={phase >= 1 ? { x: '160%' } : { x: '-160%' }}
                  transition={{
                    duration: 1.1,
                    delay: 0.1,
                    ease: [0.16, 1, 0.3, 1],
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
              initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
              animate={
                phase >= 1
                  ? { opacity: 1, y: 0, filter: 'blur(0px)' }
                  : { opacity: 0, y: 16, filter: 'blur(6px)' }
              }
              transition={{
                duration: 0.75,
                delay: 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <span className="text-[#F5F5F5]">ON</span>
              <span className="text-[#FF6A00] ml-0.5">PRINT</span>
            </motion.div>

            {/* ======================================================== */}
            {/* 4. THIN VIVID ORANGE PROGRESS LINE (Step 4)               */}
            {/* ======================================================== */}
            <div className="mt-5 sm:mt-6 w-48 sm:w-64 h-[2px] bg-white/10 rounded-full overflow-hidden relative">
              <motion.div
                className="h-full rounded-full relative"
                style={{
                  background:
                    'linear-gradient(90deg, #FF6A00 0%, #FF8533 50%, #FFA366 100%)',
                  boxShadow: '0 0 14px rgba(255, 106, 0, 0.8)',
                }}
                initial={{ width: '0%' }}
                animate={phase >= 2 ? { width: '100%' } : { width: '0%' }}
                transition={{
                  duration: 0.7,
                  ease: [0.16, 1, 0.3, 1],
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
              className="mt-4 sm:mt-5 text-[11px] sm:text-xs font-semibold tracking-[0.42em] text-[#E2E8F0] uppercase"
              initial={{ opacity: 0, y: 8 }}
              animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
              transition={{
                duration: 0.6,
                delay: 0.08,
                ease: [0.16, 1, 0.3, 1],
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
              className="mt-6 flex items-center justify-center gap-2 text-[9px] sm:text-[10px] font-mono tracking-[0.35em] text-[#888888] uppercase"
              initial={{ opacity: 0 }}
              animate={phase >= 2 ? { opacity: 0.85 } : { opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.18 }}
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
