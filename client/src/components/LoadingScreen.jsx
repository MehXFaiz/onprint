import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import Logo from './Logo'


const SESSION_KEY = 'onprint-splash-futuristic-v1'

const digitalParticles = [
  { top: '35%', left: '25%', delay: 0.3, size: 2 },
  { top: '42%', left: '38%', delay: 0.5, size: 3 },
  { top: '58%', left: '52%', delay: 0.8, size: 2 },
  { top: '48%', left: '68%', delay: 1.0, size: 2.5 },
  { top: '62%', left: '78%', delay: 1.2, size: 2 },
  { top: '38%', left: '82%', delay: 0.6, size: 2 },
]

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
    }, 2750)

    return () => clearTimeout(timer)
  }, [reduce])

  if (!visible) return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="onprint-futuristic-splash"
          onClick={() => setVisible(false)}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#000000] text-white overflow-hidden select-none cursor-pointer"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.03,
            filter: 'blur(12px)',
            transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
          }}
          aria-label="ONPRINT Futuristic Intro"
        >
          {/* Subtle Ambient Red Glow */}
          <motion.div
            className="absolute w-[500px] sm:w-[800px] h-[500px] sm:h-[800px] rounded-full pointer-events-none"
            style={{
              background:
                'radial-gradient(circle, rgba(198,60,34,0.22) 0%, rgba(198,60,34,0.03) 50%, rgba(0,0,0,0) 75%)',
            }}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{
              opacity: [0, 0.85, 0.95, 0],
              scale: [0.7, 1, 1.05, 1.1],
            }}
            transition={{
              duration: 2.7,
              times: [0, 0.3, 0.8, 1],
              ease: 'easeOut',
            }}
          />

          {/* Technical Precision Guidelines & Crosshairs */}
          <div className="absolute inset-8 sm:inset-14 pointer-events-none opacity-25 flex justify-between flex-col text-[9px] font-mono tracking-[0.3em] text-zinc-500 uppercase">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#c63c22] animate-pulse" />
                ONPRINT // PRESS STUDIO
              </span>
              <span>1200 DPI // ULTRA HD</span>
            </div>
            <div className="flex justify-between items-center">
              <span>DUBAI, UAE</span>
              <span className="text-zinc-400">CLICK TO ENTER &rarr;</span>
            </div>
          </div>

          {/* Center Stage Container */}
          <div className="relative flex flex-col items-center justify-center z-10 px-4 w-full max-w-[700px]">
            {/* Digital Precision Particles */}
            {digitalParticles.map((p, i) => (
              <motion.span
                key={i}
                className="absolute rounded-full bg-[#c63c22] shadow-[0_0_10px_#c63c22] pointer-events-none"
                style={{
                  top: p.top,
                  left: p.left,
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 0.95, 0],
                  scale: [0, 1.6, 0],
                  y: [0, -18],
                }}
                transition={{
                  duration: 1.3,
                  delay: p.delay,
                  ease: 'easeOut',
                }}
              />
            ))}

            {/* Logo Stage Container */}
            <div className="relative flex items-center justify-center min-h-[140px] sm:min-h-[180px] w-full">
              {/* Thin Vertical Laser Scanning Line sweeping Left to Right */}
              <motion.div
                className="absolute top-0 bottom-0 w-[2px] bg-white z-30 shadow-[0_0_18px_#FFFFFF,0_0_35px_#c63c22]"
                initial={{ left: '0%', opacity: 0 }}
                animate={{
                  left: ['0%', '0%', '100%', '100%'],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: 1.4,
                  delay: 0.1,
                  times: [0, 0.08, 0.92, 1],
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <div className="absolute -top-4 -left-1.5 h-8 w-4 bg-[#c63c22] rounded-full blur-[3px] opacity-90" />
                <div className="absolute -bottom-4 -left-1.5 h-8 w-4 bg-[#c63c22] rounded-full blur-[3px] opacity-90" />
              </motion.div>

              {/* Layer 1: Outline Logo progressively revealed by clip-path scan */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
                initial={{ clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)' }}
                animate={{
                  clipPath: [
                    'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
                    'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
                  ],
                }}
                transition={{
                  duration: 1.3,
                  delay: 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <div className="inline-flex items-center gap-4 select-none">
                  <Logo variant="light" size="splash" />
                </div>
              </motion.div>

              {/* Layer 2: Solid Logo Fills smoothly after outline scan */}
              <motion.div
                className="inline-flex items-center gap-4 select-none z-20"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0, 0, 1],
                }}
                transition={{
                  duration: 0.8,
                  delay: 1.05,
                  ease: 'easeOut',
                }}
              >
                <Logo variant="light" size="splash" />
              </motion.div>
            </div>

            {/* Tagline Reveal: PRINT. CREATE. DELIVER. */}
            <motion.div
              className="mt-8 flex items-center justify-center text-xs sm:text-sm font-bold tracking-[0.45em] text-zinc-300 uppercase"
              initial={{ opacity: 0, y: 12 }}
              animate={{
                opacity: [0, 0, 1, 1],
                y: [12, 12, 0, 0],
              }}
              transition={{
                duration: 1.1,
                delay: 1.35,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <span>PRINT</span>
              <span className="text-[#c63c22] mx-3 sm:mx-4 font-extrabold text-base select-none">•</span>
              <span>CREATE</span>
              <span className="text-[#c63c22] mx-3 sm:mx-4 font-extrabold text-base select-none">•</span>
              <span>DELIVER</span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

