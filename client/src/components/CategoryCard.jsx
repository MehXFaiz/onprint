import { Link } from 'react-router-dom'
import { ArrowUpRight, Sparkles, Layers } from 'lucide-react'

export default function CategoryCard({ category, priority = false }) {
  if (!category) return null

  const imageUrl = category.image_url || category.image || '/assets/products/1 (1).jpg'
  const altText = category.image_alt || category.imageAlt || `${category.name} in Dubai`
  const categoryLink = `/categories/${category.slug}`

  return (
    <div className="group relative flex flex-col justify-between h-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-[#A82F19]/40 hover:shadow-md">
      {/* Top Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-50 border-b border-slate-100">
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
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Top Badge */}
        <div className="absolute left-3 top-3 flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-md bg-white/90 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-700 shadow-xs">
            <Sparkles className="h-3 w-3 text-[#A82F19]" />
            Dubai Press
          </span>
        </div>

        {category.productCount > 0 && (
          <div className="absolute right-3 top-3">
            <span className="inline-flex items-center gap-1 rounded-md bg-slate-900/85 px-2 py-0.5 text-[9px] font-bold text-white backdrop-blur-xs">
              <Layers className="h-3 w-3 text-amber-400" />
              {category.productCount} Items
            </span>
          </div>
        )}
      </div>

      {/* Card Body Content */}
      <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
        <div>
          <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#A82F19]">
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
    </div>
  )
}
