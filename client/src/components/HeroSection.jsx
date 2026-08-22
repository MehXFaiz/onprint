import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, CheckCircle, ArrowUpRight } from 'lucide-react'
import { cn } from '../lib/utils'
import Button from './Button'
import { CornerMarks } from './PrintMarks'
import { trackGetQuoteClick } from '../utils/analytics'

// Icon component for contact / highlight details
const InfoIcon = ({ type }) => {
  const icons = {
    website: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4 text-[#A82F19]"
      >
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="2" x2="22" y1="12" y2="12"></line>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
      </svg>
    ),
    phone: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4 text-[#A82F19]"
      >
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
      </svg>
    ),
    address: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4 text-[#A82F19]"
      >
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
        <circle cx="12" cy="10" r="3"></circle>
      </svg>
    ),
  }
  return <div className="mr-2 shrink-0">{icons[type]}</div>
}

// Animation variants for container orchestration
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

// Animation variants for individual text/UI elements
const itemVariants = {
  hidden: { y: 24, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.55,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}

const HeroSection = React.forwardRef(
  (
    {
      className,
      badgeText = 'ONPRINT • Dubai’s Premier Printing & Branding Solutions',
      title = 'Professional Printing & Branding Solutions in Dubai',
      subtitle = 'ONPRINT transforms brand identities into tangible physical masterpieces. From executive stationery to high-volume luxury packaging, corporate gifts, signage, and precision digital printing across Dubai and the UAE.',
      callToAction = {
        primaryText: 'Request a Custom Quote',
        primaryHref: '/get-a-quote',
        secondaryText: 'Browse Product Catalog',
        secondaryHref: '/products',
      },
      backgroundImage = '/assets/products/1 (7).jpg',
      contactInfo = {
        website: '0nprint.com',
        phone: '+971 4 800 PRINT',
        address: 'Al Quoz 3, Dubai, UAE',
      },
      ...props
    },
    ref
  ) => {
    return (
      <motion.section
        ref={ref}
        className={cn(
          'relative flex w-full flex-col overflow-hidden border-b border-[#000000]/10 bg-[#FFFFFF] text-[#000000] lg:flex-row min-h-[580px] lg:min-h-[660px]',
          className
        )}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        {...props}
      >
        {/* Left Side: Content */}
        <div className="flex w-full flex-col justify-between p-6 sm:p-10 md:p-12 lg:w-[58%] lg:p-14 xl:p-18 2xl:p-20 z-10">
          {/* Top Section: Badge & Main Content */}
          <div>
            <motion.header className="mb-6 sm:mb-8" variants={itemVariants}>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#A82F19] bg-[#FFFFFF] px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-[0.18em] text-[#A82F19] shadow-xs">
                <Sparkles className="h-3.5 w-3.5 text-[#A82F19]" />
                <span>{badgeText}</span>
              </div>
            </motion.header>

            <motion.div variants={containerVariants}>
              <motion.h1
                className="font-display text-3xl font-black leading-[1.06] tracking-tight text-[#000000] sm:text-5xl lg:text-6xl xl:text-[3.85rem]"
                variants={itemVariants}
              >
                {title}
              </motion.h1>

              {/* Red Accent Divider Line */}
              <motion.div
                className="my-5 sm:my-6 h-1 w-20 rounded-full bg-[#A82F19] origin-left"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.35, ease: 'easeOut' }}
              />

              <motion.p
                className="mb-8 max-w-xl text-sm sm:text-base leading-relaxed text-[#000000]/75"
                variants={itemVariants}
              >
                {subtitle}
              </motion.p>

              {/* Call to action buttons */}
              <motion.div
                className="flex flex-wrap items-center gap-4"
                variants={itemVariants}
              >
                <Button
                  to={callToAction.primaryHref}
                  variant="accent"
                  size="lg"
                  className="shadow-lg shadow-[#A82F19]/25 cursor-pointer font-bold tracking-wide transition-transform duration-200 hover:scale-[1.02]"
                  onClick={() => trackGetQuoteClick({ source_page: 'hero_section' })}
                >
                  {callToAction.primaryText}
                </Button>

                <Button
                  to={callToAction.secondaryHref}
                  variant="secondary"
                  size="lg"
                  className="border-[#000000] text-[#000000] hover:border-[#A82F19] hover:text-[#A82F19] font-bold transition-transform duration-200 hover:scale-[1.02]"
                >
                  {callToAction.secondaryText}
                </Button>
              </motion.div>

              {/* Trust Badges Minimal Row */}
              <motion.div
                className="mt-8 flex flex-wrap items-center gap-5 text-xs font-bold text-[#000000]/75"
                variants={itemVariants}
              >
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5 text-[#A82F19]" />
                  <span>Free Design Pre-flight</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5 text-[#A82F19]" />
                  <span>Same-Day Printing</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5 text-[#A82F19]" />
                  <span>Doorstep UAE Delivery</span>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Bottom Section: Contact Details Info Footer */}
          <motion.footer
            className="mt-10 sm:mt-12 border-t border-[#000000]/10 pt-6 w-full"
            variants={itemVariants}
          >
            <div className="grid grid-cols-1 gap-4 text-xs font-semibold text-[#000000]/70 sm:grid-cols-3 sm:gap-6">
              <div className="flex items-center">
                <InfoIcon type="website" />
                <span className="truncate">{contactInfo.website}</span>
              </div>
              <div className="flex items-center">
                <InfoIcon type="phone" />
                <span className="truncate">{contactInfo.phone}</span>
              </div>
              <div className="flex items-center">
                <InfoIcon type="address" />
                <span className="truncate">{contactInfo.address}</span>
              </div>
            </div>
          </motion.footer>
        </div>

        {/* Right Side: Image with Clip Path Animation & Continuous Floating 3D Cards */}
        <motion.div
          className="relative flex w-full lg:w-[42%] min-h-[380px] sm:min-h-[440px] lg:min-h-full items-center justify-center bg-[#0d0d0d] bg-cover bg-center overflow-hidden"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{
            clipPath: 'polygon(12% 0, 100% 0, 100% 100%, 0% 100%)',
          }}
        >
          {/* Background image with slow ambient drift */}
          <motion.div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${backgroundImage})` }}
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 14,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Dark Luxury Overlay to ensure contrast while preserving texture */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black/90 via-black/65 to-black/40 backdrop-blur-[0.5px]" />

          {/* Radial Ambient Red Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-[#A82F19]/25 blur-3xl pointer-events-none" />

          {/* Precision Corner Marks */}
          <CornerMarks className="absolute left-10 top-6 h-8 w-8 text-white/35 z-10" />
          <CornerMarks className="absolute bottom-6 right-6 h-8 w-8 rotate-180 text-white/35 z-10" />

          {/* Studio Showcase Physical Swatches & Interactive Floating Cards */}
          <div className="relative z-10 flex h-[350px] w-[320px] sm:h-[400px] sm:w-[380px] items-center justify-center">
            {/* Back Card: 350 GSM Stock Spec */}
            <motion.div
              initial={{ opacity: 0, y: 40, rotate: -12 }}
              animate={{
                opacity: 1,
                y: [0, -10, 0],
                rotate: [-6, -4, -6],
              }}
              transition={{
                opacity: { duration: 0.7, delay: 0.3 },
                y: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
                rotate: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
              }}
              whileHover={{ scale: 1.06, rotate: -2, y: -12 }}
              className="absolute left-1 top-4 flex h-60 w-44 sm:h-64 sm:w-48 flex-col justify-between rounded-2xl border border-white/20 bg-white/95 p-5 shadow-2xl backdrop-blur-md cursor-pointer select-none"
            >
              <div className="flex items-center justify-between">
                <div className="flex gap-1.5">
                  {['#000000', '#A82F19', '#000000'].map((c, i) => (
                    <span
                      key={i}
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#000000]/60">
                  350 GSM STOCK
                </span>
              </div>
              <div className="space-y-2">
                <div className="h-2 w-3/4 rounded bg-[#000000]/15" />
                <div className="h-2 w-1/2 rounded bg-[#000000]/15" />
                <div className="h-2 w-5/6 rounded bg-[#A82F19]/25" />
              </div>
              <div className="rounded-xl border border-[#A82F19] bg-[#FFFFFF] p-2 text-center text-[11px] font-black text-[#A82F19] shadow-xs">
                RED FOIL EMBOSS
              </div>
            </motion.div>

            {/* Front Card: ONPRINT Signature Black Card */}
            <motion.div
              initial={{ opacity: 0, y: 50, rotate: 10 }}
              animate={{
                opacity: 1,
                y: [0, 12, 0],
                rotate: [5, 7, 5],
              }}
              transition={{
                opacity: { duration: 0.7, delay: 0.45 },
                y: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
                rotate: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
              }}
              whileHover={{ scale: 1.07, rotate: 0, y: -6 }}
              className="absolute right-0 top-16 flex h-48 w-60 sm:h-52 sm:w-68 flex-col justify-between rounded-2xl border border-white/20 bg-black/95 p-5 sm:p-6 shadow-2xl backdrop-blur-md cursor-pointer select-none z-20"
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-base font-black tracking-tight text-white">
                  ON<span className="text-[#A82F19]">PRINT</span>
                </span>
                <span className="rounded-full bg-[#A82F19] px-2.5 py-0.5 text-[9px] font-extrabold text-white">
                  PRESS
                </span>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-white/70">
                  EXECUTIVE BRANDING &amp; PRESS
                </p>
                <p className="mt-0.5 text-sm font-bold text-white">
                  Precision Printing Dubai
                </p>
              </div>
              <div className="flex items-center justify-between border-t border-white/20 pt-2.5 text-[9px] font-bold text-white/70">
                <span>SPEC: ULTRA HD</span>
                <span className="font-black text-[#A82F19]">PASSED QC</span>
              </div>
            </motion.div>

            {/* Accent Badge: 1200 DPI Offset Press */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                opacity: 1,
                scale: [1, 1.04, 1],
                y: [0, -6, 0],
              }}
              transition={{
                opacity: { duration: 0.6, delay: 0.6 },
                scale: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
                y: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
              }}
              whileHover={{ scale: 1.12, rotate: 4 }}
              className="absolute bottom-2 left-6 flex h-24 w-24 sm:h-26 sm:w-26 items-center justify-center rounded-2xl border border-[#A82F19] bg-white p-3.5 shadow-2xl cursor-pointer select-none z-30"
            >
              <div className="text-center">
                <span className="font-display text-xl font-black text-[#A82F19]">
                  1200 DPI
                </span>
                <p className="mt-0.5 text-[9px] font-extrabold uppercase tracking-wider text-[#000000]">
                  Offset Press
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.section>
    )
  }
)

HeroSection.displayName = 'HeroSection'

export default HeroSection
