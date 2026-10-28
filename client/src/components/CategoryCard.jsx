import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight, Sparkles, Layers } from 'lucide-react'
import WhatsAppIcon from './WhatsAppIcon'
import { resolveCanonicalCategorySlug, getCategoryImage } from '../utils/categoryMapping'
import { getServiceWhatsAppUrl } from '../utils/whatsapp'
import { trackWhatsAppClick } from '../utils/analytics'

export default function CategoryCard({ category, priority = false, index = 0 }) {
  if (!category) return null

  const canonicalSlug = resolveCanonicalCategorySlug(category.slug)
  const imageUrl = getCategoryImage(category)
  const altText = category.image_alt || category.imageAlt || `${category.name} in Dubai`
  const categoryLink = `/categories/${canonicalSlug || category.slug}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{
        duration: 0.45,
        delay: Math.min((index % 6) * 0.07, 0.35),
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -5 }}
      className="group relative flex flex-col justify-between h-full overflow-hidden rounded-3xl border border-[#122240] bg-[#081226] text-[#F5F2EB] shadow-md transition-all duration-300 hover:border-[#D4AF65] hover:shadow-xl"
    >
      {/* Top Image Container */}
      <Link
        to={categoryLink}
        className="relative block aspect-[4/3] w-full overflow-hidden bg-[#040A18] border-b border-[#122240] focus:outline-none"
      >
        <img
          src={imageUrl}
          alt={altText}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          width={600}
          height={450}
          onError={(e) => {
            e.target.onerror = null
            e.target.src = '/assets/products/luxury_business_cards_dubai.jpg'
          }}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Ambient bottom vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#020611]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute left-3 top-3 flex items-center gap-1.5 z-20">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#040A18]/90 px-2.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-[#F5F2EB] shadow-xs border border-[#122240] backdrop-blur-md">
            <Sparkles className="h-3 w-3 text-[#D4AF65]" />
            Dubai Press
          </span>
        </div>

        {category.productCount > 0 && (
          <div className="absolute right-3 top-3 z-20">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#040A18]/90 px-2.5 py-0.5 text-[9.5px] font-bold text-[#F5F2EB] shadow-md border border-[#122240] backdrop-blur-md">
              <Layers className="h-3 w-3 text-[#D4AF65]" />
              {category.productCount} Items
            </span>
          </div>
        )}
      </Link>

      {/* Card Body Content */}
      <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
        <div>
          <span className="text-[9.5px] font-black uppercase tracking-widest text-[#D4AF65]">
            PRINTING CATEGORY
          </span>
          <h3 className="mt-1 text-base font-bold tracking-tight text-[#F5F2EB] transition-colors group-hover:text-[#D4AF65]">
            <Link to={categoryLink} className="hover:underline focus:outline-none">
              {category.name}
            </Link>
          </h3>
          <p className="mt-1 text-xs text-[#B0BECE] line-clamp-2 leading-relaxed">
            {category.description || `Explore precision custom ${category.name?.toLowerCase()} printing in Dubai.`}
          </p>
        </div>

        <div className="mt-4 flex items-center gap-2 border-t border-[#122240] pt-3.5">
          <Link
            to={categoryLink}
            className="flex-1 inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-full bg-[#D4AF65] hover:bg-[#C49E52] px-3.5 py-2 text-xs font-black uppercase tracking-wider text-[#040A18] transition-all shadow-xs"
          >
            <span>Browse</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>

          <a
            href={getServiceWhatsAppUrl(canonicalSlug || category.slug, {
              productName: category.name,
              slug: canonicalSlug || category.slug,
              pageUrl: `https://www.0nprint.com${categoryLink}`,
            })}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackWhatsAppClick({
                source_page: typeof window !== 'undefined' ? window.location.pathname : '/categories',
                service_name: category.name,
                product_name: category.name,
                button_location: 'category_card_footer',
                label: `category_card_${canonicalSlug || category.slug}`,
              })
            }
            aria-label={`Inquire about ${category.name} on WhatsApp`}
            title={`Inquire about ${category.name} on WhatsApp`}
            className="inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/15 px-3.5 py-2 text-[11px] font-bold text-emerald-300 hover:bg-[#25D366] hover:text-white transition-all shrink-0"
          >
            <WhatsAppIcon className="h-3.5 w-3.5 fill-current shrink-0" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </motion.div>
  )
}
