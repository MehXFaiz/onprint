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
      initial={{ opacity: 1, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{
        duration: 0.45,
        delay: Math.min((index % 6) * 0.07, 0.35),
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -5 }}
      className="group relative flex flex-col justify-between h-full overflow-hidden rounded-3xl border border-[#DED2C1] bg-[#FAF8F3] text-[#352719] shadow-md transition-all duration-300 hover:border-[#C5A989] hover:shadow-xl"
    >
      {/* Top Image Container */}
      <Link
        to={categoryLink}
        className="relative block aspect-[4/3] w-full overflow-hidden bg-[#F5F0E7] border-b border-[#DED2C1] focus:outline-none"
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
        <div className="absolute inset-0 bg-gradient-to-t from-[#EDE3D5]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute left-3 top-3 flex items-center gap-1.5 z-20">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#F5F0E7]/90 px-2.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-[#352719] shadow-xs border border-[#DED2C1] backdrop-blur-md">
            <Sparkles className="h-3 w-3 text-[#795C43]" />
            Dubai Press
          </span>
        </div>

        {category.productCount > 0 && (
          <div className="absolute right-3 top-3 z-20">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#F5F0E7]/90 px-2.5 py-0.5 text-[9.5px] font-bold text-[#352719] shadow-md border border-[#DED2C1] backdrop-blur-md">
              <Layers className="h-3 w-3 text-[#795C43]" />
              {category.productCount} Items
            </span>
          </div>
        )}
      </Link>

      {/* Card Body Content */}
      <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
        <div>
          <span className="text-[9.5px] font-black uppercase tracking-widest text-[#795C43]">
            PRINTING CATEGORY
          </span>
          <h3 className="mt-1 text-base font-bold tracking-tight text-[#352719] transition-colors group-hover:text-[#795C43]">
            <Link to={categoryLink} className="hover:underline focus:outline-none">
              {category.name}
            </Link>
          </h3>
          <p className="mt-1 text-xs text-[#756657] line-clamp-2 leading-relaxed">
            {category.description || `Explore precision custom ${category.name?.toLowerCase()} printing in Dubai.`}
          </p>
        </div>

        <div className="mt-4 flex items-center gap-2 border-t border-[#DED2C1] pt-3.5">
          <Link
            to={categoryLink}
            className="flex-1 inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-full bg-[#795C43] hover:bg-[#5D442E] px-3.5 py-2 text-xs font-black uppercase tracking-wider text-white transition-all shadow-xs"
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
            className="inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/15 px-3.5 py-2 text-[11px] font-bold text-emerald-700 hover:bg-[#25D366] hover:text-white transition-all shrink-0"
          >
            <WhatsAppIcon className="h-3.5 w-3.5 fill-current shrink-0" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </motion.div>
  )
}
