import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'

export default function StatCounter({ value, suffix = '', label }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const reduce = useReducedMotion()
  const [display, setDisplay] = useState(reduce ? value : 0)

  useEffect(() => {
    if (!inView || reduce) return
    const duration = 1200
    const start = performance.now()

    let frame
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - (1 - progress) ** 3
      setDisplay(Math.round(eased * value))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, reduce, value])

  return (
    <div ref={ref}>
      <p className="font-display text-4xl font-extrabold tabular-nums text-primary sm:text-5xl">
        {display}
        <span className="text-accent">{suffix}</span>
      </p>
      <p className="mt-2 text-sm font-medium uppercase tracking-wide text-secondary">{label}</p>
    </div>
  )
}
