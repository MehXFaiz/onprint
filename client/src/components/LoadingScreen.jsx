import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

const SESSION_KEY = 'onprint-intro-shown'

export default function LoadingScreen() {
  const reduce = useReducedMotion()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (window.sessionStorage.getItem(SESSION_KEY)) return
    window.sessionStorage.setItem(SESSION_KEY, '1')

    if (reduce) return

    setVisible(true)
    const timer = setTimeout(() => setVisible(false), 850)
    return () => clearTimeout(timer)
  }, [reduce])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-100 flex items-center justify-center bg-primary"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          aria-hidden="true"
        >
          <div className="flex items-baseline gap-2 font-display text-4xl font-extrabold tracking-tight text-background sm:text-5xl">
            <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              ON
            </motion.span>
            <motion.span
              className="text-accent"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
            >
              PRINT
            </motion.span>
            <motion.span
              className="ml-1 inline-block h-2 w-2 bg-accent"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.4, 1] }}
              transition={{ duration: 0.4, delay: 0.35 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
