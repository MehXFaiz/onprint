import { Link } from 'react-router-dom'
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
import WhatsAppIcon from './WhatsAppIcon'
import { getProductImage } from '../assets/productImages'
import { getServiceWhatsAppUrl } from '../utils/whatsapp'
import { trackWhatsAppClick } from '../utils/analytics'

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
  'digital-offset-printing': FileText,
  'corporate-gift-customization': Award,
  'custom-labels-die-cut-stickers': Sparkles,
  'executive-business-stationery': CreditCard,
  'large-format-exhibition-signage': Sparkles,
}

export default function ServiceCard({ service, className = '' }) {
  if (!service) return null

  const serviceImage = getProductImage(service)
  const IconComponent = (service.slug && serviceIconMap[service.slug]) || Sparkles
  const serviceLink = `/services/${service.slug}`

  return (
    <div
      className={`group/card relative flex flex-col justify-between h-full overflow-hidden rounded-2xl border border-[#DED2C1] bg-[#FAF8F3] text-[#352719] shadow-md transition-all duration-300 card-hover-lift hover-shimmer ${className}`}
    >
      {/* Top Image Container */}
      <Link
        to={serviceLink}
        className="relative block aspect-[4/3] w-full overflow-hidden bg-[#F5F0E7] border-b border-[#DED2C1] focus:outline-none"
      >
        <img
          src={serviceImage}
          alt={service.imageAlt || service.name}
          loading="lazy"
          decoding="async"
          width={400}
          height={300}
          onError={(event) => {
            event.currentTarget.onerror = null
            event.currentTarget.src = '/assets/products/luxury_business_cards_dubai.jpg'
          }}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover/card:scale-105"
        />

        {/* Top Badges */}
        <div className="absolute left-3 top-3 flex items-center gap-1.5 z-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F5F0E7]/90 px-2.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-[#352719] shadow-xs border border-[#DED2C1] backdrop-blur-xs">
            <IconComponent className="h-3 w-3 text-[#795C43]" />
            <span>Dubai Press</span>
          </span>
        </div>

        <div className="absolute right-3 top-3 z-10">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#F5F0E7]/90 border border-[#DED2C1] px-2.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-[#795C43] backdrop-blur-xs">
            Express 24h
          </span>
        </div>
      </Link>

      {/* Card Body Content */}
      <div className="flex flex-1 flex-col justify-between p-5 bg-[#FAF8F3]">
        <div>
          <span className="text-[9.5px] font-bold uppercase tracking-widest text-[#795C43]">
            COMMERCIAL SERVICE
          </span>
          <h3 className="font-display mt-1 text-base font-bold tracking-tight text-[#352719] transition-colors group-hover/card:text-[#795C43] leading-snug line-clamp-1">
            <Link to={serviceLink} className="hover:underline focus:outline-none">
              {service.name}
            </Link>
          </h3>

          {service.shortDescription && (
            <p className="mt-1.5 text-xs text-[#756657] line-clamp-2 leading-relaxed font-normal">
              {service.shortDescription}
            </p>
          )}
        </div>

        {/* Footer Actions: Explore + Direct WhatsApp Inquiry */}
        <div className="mt-4 flex items-center gap-2 border-t border-[#DED2C1] pt-3.5">
          <Link
            to={serviceLink}
            className="flex-1 inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-full bg-[#795C43] hover:bg-[#5D442E] px-3.5 py-2 text-xs font-black uppercase tracking-wider text-white transition-all shadow-xs"
          >
            <span>Explore</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>

          <a
            href={getServiceWhatsAppUrl(service.slug, {
              productName: service.name,
              slug: service.slug,
              pageUrl: `https://www.0nprint.com${serviceLink}`,
            })}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackWhatsAppClick({
                source_page: typeof window !== 'undefined' ? window.location.pathname : '/services',
                service_name: service.name,
                product_name: service.name,
                button_location: 'service_card_footer',
                label: `service_card_${service.slug}`,
              })
            }
            aria-label={`Inquire about ${service.name} on WhatsApp`}
            title={`Inquire about ${service.name} on WhatsApp`}
            className="inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/15 px-3.5 py-2 text-[11px] font-bold text-emerald-300 hover:bg-[#25D366] hover:text-white transition-all shrink-0"
          >
            <WhatsAppIcon className="h-3.5 w-3.5 fill-current shrink-0" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  )
}
