import { Link } from 'react-router-dom'
import { ArrowUpRight, Sparkles, Eye, Check } from 'lucide-react'
import { getProductImage } from '../assets/productImages'

export default function ProductCard({
  product,
  featured = false,
  variant = 'glass',
  onQuickView
}) {
  if (!product) return null

  const isFeatured = featured || product.featured
  const productImage = getProductImage(product)
  const categoryName = typeof product.category === 'object' ? product.category?.name : (product.category || '')

  const handleQuickView = (e) => {
    if (onQuickView) {
      e.preventDefault()
      e.stopPropagation()
      onQuickView(product)
    }
  }

  // Derive 2 to 4 key features dynamically
  const deriveFeatures = () => {
    if (Array.isArray(product.features) && product.features.length > 0) {
      return product.features.slice(0, 3)
    }
    const list = []
    if (product.minimumQuantity) {
      list.push(`Min. Order: ${product.minimumQuantity} units`)
    }
    if (product.specifications?.materials?.[0]?.label) {
      list.push(product.specifications.materials[0].label)
    } else {
      list.push('High-Precision Custom Print')
    }
    if (product.specifications?.finishes?.[0]?.label) {
      list.push(product.specifications.finishes[0].label)
    } else {
      list.push('Bespoke Corporate Finishing')
    }
    return list.slice(0, 3)
  }

  const featuresList = deriveFeatures()

  return (
    <div
      className={`group relative flex flex-col justify-between h-full overflow-hidden rounded-2xl border border-[#000000]/12 bg-[#FFFFFF] shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:border-[#A82F19] hover:shadow-xl ${
        isFeatured ? 'lg:col-span-2 lg:flex-row' : ''
      }`}
    >
      {/* Product Image Area */}
      <div
        className={`relative overflow-hidden bg-[#FFFFFF] ${
          isFeatured ? 'aspect-[16/10] lg:w-1/2 lg:aspect-auto' : 'aspect-[4/3] w-full'
        }`}
      >
        {productImage ? (
          <img
            src={productImage}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#000000]/5 text-xs font-bold uppercase tracking-widest text-[#000000]/50">
            ONPRINT PRESS
          </div>
        )}

        {/* Soft Hover Overlay */}
        <div className="absolute inset-0 bg-[#000000]/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Featured / Category Top-Left Badge */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2 pointer-events-none">
          {isFeatured && (
            <span className="inline-flex items-center gap-1 rounded-md bg-[#A82F19] px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest text-[#FFFFFF] shadow-xs">
              <Sparkles className="h-3 w-3 text-[#FFFFFF]" />
              Featured
            </span>
          )}
        </div>

        {/* Floating Price Badge in Top-Right Corner */}
        {product.price && (
          <div className="absolute top-3 right-3 z-10 pointer-events-none">
            <span className="inline-flex items-center rounded-md bg-[#A82F19] px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[#FFFFFF] shadow-md">
              FROM AED {product.price}
            </span>
          </div>
        )}
      </div>

      {/* Product Information Section */}
      <div className="flex flex-1 flex-col justify-between p-5 sm:p-6 bg-[#FFFFFF]">
        <div className="space-y-2">
          {/* Category */}
          {categoryName && (
            <span className="block text-[10px] font-extrabold uppercase tracking-widest text-[#A82F19]">
              {categoryName}
            </span>
          )}

          {/* Product Name */}
          <h3 className="font-display text-base sm:text-lg font-black tracking-tight text-[#000000] transition-colors duration-200 group-hover:text-[#A82F19] line-clamp-1">
            {product.name}
          </h3>

          {/* Short Description */}
          <p className="text-xs leading-relaxed text-[#000000]/70 line-clamp-2">
            {product.shortDescription || product.description}
          </p>

          {/* Product Features List */}
          {featuresList.length > 0 && (
            <div className="pt-2 border-t border-[#000000]/8 space-y-1.5">
              <span className="block text-[9px] font-extrabold uppercase tracking-wider text-[#000000]/50">
                Key Features
              </span>
              {featuresList.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs font-medium text-[#000000]/85">
                  <Check className="h-3.5 w-3.5 shrink-0 text-[#A82F19]" />
                  <span className="truncate">{feat}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action / CTA Bar */}
        <div className="mt-5 pt-4 border-t border-[#000000]/10 flex items-center gap-2">
          <Link
            to={`/products/${product.slug}`}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#A82F19] border border-[#A82F19] px-4 py-2.5 text-xs font-extrabold uppercase tracking-wider text-[#FFFFFF] transition-all duration-300 hover:bg-[#000000] hover:border-[#000000] cursor-pointer shadow-xs active:scale-[0.98]"
          >
            <span>Explore Product</span>
            <ArrowUpRight className="h-4 w-4 text-[#FFFFFF]" />
          </Link>

          {onQuickView && (
            <button
              type="button"
              onClick={handleQuickView}
              aria-label="Quick View Product"
              className="inline-flex items-center justify-center rounded-xl border border-[#000000]/20 bg-[#FFFFFF] p-2.5 text-[#000000] transition-all hover:border-[#A82F19] hover:bg-[#A82F19] hover:text-[#FFFFFF] cursor-pointer active:scale-95"
            >
              <Eye className="h-4 w-4 text-current" />
            </button>
          )}
        </div>
      </div>

      {/* Subtle bottom ONPRINT red accent line */}
      <div className="h-1 w-0 bg-[#A82F19] transition-all duration-300 ease-out group-hover:w-full" />
    </div>
  )
}
