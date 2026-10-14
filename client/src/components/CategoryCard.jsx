import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight, Sparkles, Layers } from 'lucide-react'

export default function CategoryCard({ category, priority = false, index = 0 }) {
  if (!category) return null

  let imageUrl = category.image_url || category.image
  if (!imageUrl || imageUrl.includes('trae.ai')) {
    imageUrl = `/uploads/categories/${category.slug}.jpg`
  }
  const altText = category.image_alt || category.imageAlt || `${category.name} in Dubai`
  const categoryLink = `/categories/${category.slug}`

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
      whileHover={{ y: -6 }}
      className="group relative flex flex-col justify-between h-full overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_4px_20px_-4px_rgba(15,23,42,0.06)] transition-all duration-300 hover:border-[#A82F19]/40 hover:shadow-[0_20px_35px_-8px_rgba(168,47,25,0.13),0_10px_20px_-6px_rgba(15,23,42,0.05)]"
    >
      {/* Top Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-b from-slate-100/90 via-slate-50 to-slate-100/70 border-b border-slate-100">
        <img
          src={imageUrl}
          alt={altText}
          loading={priority ? 'eager' : 'lazy'}
          width={1200}
          height={900}
          onError={(e) => {
            e.target.onerror = null
            e.target.src = `/uploads/categories/${category.slug}.jpg`
          }}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]"
        />

        {/* Ambient bottom vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Shimmer sweep */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -translate-x-[160%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/35 to-transparent skew-x-[-25deg] pointer-events-none z-10"
        />

        {/* Top Badges */}
        <div className="absolute left-3 top-3 flex items-center gap-1.5 z-20">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-slate-700 shadow-xs border border-slate-200/80 backdrop-blur-md">
            <Sparkles className="h-3 w-3 text-[#A82F19]" />
            Dubai Press
          </span>
        </div>

        {category.productCount > 0 && (
          <div className="absolute right-3 top-3 z-20">
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/90 px-2.5 py-0.5 text-[9.5px] font-bold text-white shadow-md border border-white/10 backdrop-blur-md">
              <Layers className="h-3 w-3 text-amber-400" />
              {category.productCount} Items
            </span>
          </div>
        )}
      </div>

      {/* Card Body Content */}
      <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
        <div>
          <span className="text-[9.5px] font-extrabold uppercase tracking-widest text-[#A82F19]">
            PRINTING CATEGORY
          </span>
          <h3 className="font-display mt-1 text-base font-bold tracking-tight text-slate-900 transition-colors group-hover:text-[#A82F19]">
            <Link to={categoryLink} className="focus:outline-none">
              <span className="absolute inset-0 z-10" aria-hidden="true" />
              {category.name}
            </Link>
          </h3>
          <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {category.description || `Explore precision custom ${category.name?.toLowerCase()} printing in Dubai.`}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-bold text-[#A82F19]">
          <span>Explore Category</span>
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </motion.div>
  )
}
