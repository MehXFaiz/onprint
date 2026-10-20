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
      whileHover={{ y: -5 }}
      className="group relative flex flex-col justify-between h-full overflow-hidden rounded-3xl border border-[#1E2C4F] bg-[#14213D] text-[#F5F3EE] shadow-md transition-all duration-300 hover:border-[#D6C29A] hover:shadow-xl"
    >
      {/* Top Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0B132B] border-b border-[#1E2C4F]">
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
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Ambient bottom vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#070D1E]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute left-3 top-3 flex items-center gap-1.5 z-20">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#0B132B]/90 px-2.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-[#F5F3EE] shadow-xs border border-[#1E2C4F] backdrop-blur-md">
            <Sparkles className="h-3 w-3 text-[#D6C29A]" />
            Dubai Press
          </span>
        </div>

        {category.productCount > 0 && (
          <div className="absolute right-3 top-3 z-20">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#0B132B]/90 px-2.5 py-0.5 text-[9.5px] font-bold text-[#F5F3EE] shadow-md border border-[#1E2C4F] backdrop-blur-md">
              <Layers className="h-3 w-3 text-[#D6C29A]" />
              {category.productCount} Items
            </span>
          </div>
        )}
      </div>

      {/* Card Body Content */}
      <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
        <div>
          <span className="text-[9.5px] font-black uppercase tracking-widest text-[#D6C29A]">
            PRINTING CATEGORY
          </span>
          <h3 className="mt-1 text-base font-bold tracking-tight text-[#F5F3EE] transition-colors group-hover:text-[#D6C29A]">
            <Link to={categoryLink} className="focus:outline-none">
              <span className="absolute inset-0 z-10" aria-hidden="true" />
              {category.name}
            </Link>
          </h3>
          <p className="mt-1 text-xs text-[#A0AEC0] line-clamp-2 leading-relaxed">
            {category.description || `Explore precision custom ${category.name?.toLowerCase()} printing in Dubai.`}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-[#1E2C4F] pt-3 text-xs font-bold text-[#F5F3EE] group-hover:text-[#D6C29A] transition-colors">
          <span>Explore Category</span>
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[#D6C29A]" />
        </div>
      </div>
    </motion.div>
  )
}
