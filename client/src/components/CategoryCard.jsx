import { Link } from 'react-router-dom'
import { ArrowUpRight, Sparkles, Layers } from 'lucide-react'

export default function CategoryCard({ category, priority = false }) {
  if (!category) return null

  const imageUrl = category.image_url || category.image || '/assets/products/1 (1).jpg'
  const altText = category.image_alt || category.imageAlt || `${category.name} in Dubai`
  const categoryLink = `/categories/${category.slug}`

  return (
    <div className="group relative flex flex-col justify-between h-full overflow-hidden rounded-2xl border border-[#000000]/12 bg-[#FFFFFF] shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:border-[#A82F19] hover:shadow-xl">
      {/* Top Image Container with Fixed 4:3 Aspect Ratio */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#FFFFFF]">
        <img
          src={imageUrl}
          alt={altText}
          loading={priority ? 'eager' : 'lazy'}
          width={1200}
          height={900}
          onError={(e) => {
            e.target.onerror = null
            e.target.src = '/assets/products/1 (1).jpg'
          }}
          className="h-full w-full object-cover transition-transform duration-500 will-change-transform group-hover:scale-105"
        />

        {/* Subtle Gradient Overlay for Text Clarity */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Top Badges */}
        <div className="absolute left-3 top-3 flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#FFFFFF]/90 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest text-[#000000] backdrop-blur-md shadow-xs">
            <Sparkles className="h-3 w-3 text-[#A82F19]" />
            Dubai Press
          </span>
        </div>

        {category.productCount > 0 && (
          <div className="absolute right-3 top-3">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#000000]/80 px-2.5 py-1 text-[10px] font-bold text-[#FFFFFF] backdrop-blur-md">
              <Layers className="h-3 w-3 text-[#A82F19]" />
              {category.productCount} Products
            </span>
          </div>
        )}
      </div>

      {/* Card Body Content */}
      <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#A82F19]">
            PRINTING CATEGORY
          </span>
          <h3 className="font-display mt-1 text-lg font-bold tracking-tight text-[#000000] transition-colors group-hover:text-[#A82F19]">
            <Link to={categoryLink} className="focus:outline-none">
              <span className="absolute inset-0 z-10" aria-hidden="true" />
              {category.name}
            </Link>
          </h3>

          <p className="mt-2 text-xs leading-relaxed text-[#000000]/70 line-clamp-2">
            {category.description ||
              'High-precision commercial printing with bespoke finishing and express delivery in Dubai.'}
          </p>
        </div>

        {/* Footer Action Button */}
        <div className="mt-5 flex items-center justify-between border-t border-[#000000]/10 pt-4">
          <span className="inline-flex items-center gap-1 text-xs font-black text-[#A82F19] transition-transform duration-200 group-hover:translate-x-0.5">
            Explore Category
            <ArrowUpRight className="h-4 w-4" />
          </span>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#000000]/50">
            Express Turnaround
          </span>
        </div>
      </div>
    </div>
  )
}
