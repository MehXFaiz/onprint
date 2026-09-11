import { Link } from 'react-router-dom'
import { useState } from 'react'
import {
  ArrowUpRight,
  BookOpen,
  CreditCard,
  FileText,
  UserCheck,
  Award,
  FileSpreadsheet,
  Sparkles,
} from 'lucide-react'
import { getProductImage } from '../assets/productImages'

const serviceIconMap = {
  'brochures-printing': BookOpen,
  'brochures-printing-dubai': BookOpen,
  'business-cards-printing': CreditCard,
  'business-cards-printing-dubai': CreditCard,
  'flyers-printing-in-dubai': FileText,
  'flyers-printing-dubai': FileText,
  'id-card-printing-dubai': UserCheck,
  'lanyard-printing-dubai': Award,
  'letterheads-printing-dubai': FileSpreadsheet,
  'letterhead-printing-dubai': FileSpreadsheet,
  'name-badges-printing-dubai': UserCheck,
}

export default function ServiceCard({ service, className = '' }) {
  const [isMockupActive, setIsMockupActive] = useState(false)
  const [mockupTilt, setMockupTilt] = useState({ x: 0, y: 0 })
  const serviceImage = getProductImage(service)
  const IconComponent = (service.slug && serviceIconMap[service.slug]) || Sparkles

  const handleMockupMove = (event) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const bounds = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2
    setMockupTilt({ x: y * -5, y: x * 7 })
  }

  const resetMockup = () => {
    setIsMockupActive(false)
    setMockupTilt({ x: 0, y: 0 })
  }

  return (
    <Link
      to={`/services/${service.slug}`}
      aria-label={service.name}
      className={`group/card relative block h-56 sm:h-64 w-full cursor-pointer overflow-hidden rounded-2xl border border-black/10 bg-neutral-900 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#A82F19] hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A82F19] ${className}`}
    >
      {/* Real service image presented as a lifted print mockup */}
      <div
        className="product-mockup-stage group/mockup absolute inset-0 overflow-hidden bg-[#e9e5df]"
        onPointerEnter={() => setIsMockupActive(true)}
        onPointerMove={handleMockupMove}
        onPointerLeave={resetMockup}
      >
        <img
          src={serviceImage}
          alt=""
          aria-hidden="true"
          loading="lazy"
          onError={(event) => {
            event.currentTarget.onerror = null
            event.currentTarget.src = '/assets/products/1 (1).jpg'
          }}
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="pointer-events-none absolute inset-0 bg-[#e9e5df]/35" />
        {serviceImage ? (
          <div
            className="service-mockup-object product-mockup-object absolute inset-[8%] flex items-center justify-center"
            style={{
              transform: `perspective(900px) rotateX(${mockupTilt.x}deg) rotateY(${mockupTilt.y}deg)`,
            }}
          >
            <div className="product-mockup-shadow absolute inset-[5%] rounded-[1.1rem] bg-black/30 blur-xl" />
            <div className="product-mockup-face relative h-full w-full overflow-hidden rounded-[1.1rem] border border-white/70 bg-white shadow-[10px_14px_24px_rgba(0,0,0,0.24)]">
              <img
                src={serviceImage}
                alt={service.name}
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.onerror = null
                  event.currentTarget.src = '/assets/products/1 (1).jpg'
                }}
                className="h-full w-full object-cover object-center"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-black/15" />
            </div>
            <div className="product-mockup-edge absolute right-[-2%] top-[6%] h-[88%] w-[5%] rounded-r-lg bg-[#c8c0b7]" />
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-xs font-bold uppercase tracking-widest text-black/40">
            ONPRINT PRESS
          </div>
        )}
        <span className="pointer-events-none absolute bottom-3 right-3 z-10 rounded-full border border-white/60 bg-white/85 px-2 py-1 text-[9px] font-extrabold uppercase tracking-[0.14em] text-black/65 shadow-sm backdrop-blur-md">
          {isMockupActive ? '3D view' : 'View mockup'}
        </span>
      </div>

      {/* Gradient overlay for perfect text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-black/20 transition-opacity duration-300 group-hover/card:via-black/65" />

      {/* Top Floating Badge */}
      <div className="absolute left-3.5 top-3.5 z-10 flex items-center gap-1.5">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-black/40 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-md border border-white/15 shadow-xs">
          <IconComponent className="h-3.5 w-3.5 text-[#A82F19]" />
          <span>Dubai Press</span>
        </span>
      </div>

      {/* Card Content at bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 text-white z-10">
        <h3 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug group-hover/card:text-[#A82F19] transition-colors">
          {service.name}
        </h3>

        {service.shortDescription && (
          <p className="mt-1 text-[11px] sm:text-xs text-white/80 line-clamp-2 font-normal leading-relaxed">
            {service.shortDescription}
          </p>
        )}

        <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2.5">
          <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold text-[#A82F19] group-hover/card:text-white transition-colors">
            <span>Explore Service</span>
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5" />
          </span>
          <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest text-white/50">
            Express UAE
          </span>
        </div>
      </div>
    </Link>
  )
}

