import { Heart } from 'lucide-react'

export default function ProductCard({ product, isSaved, onProductClick, onToggleSave }) {
  return (
    <article
      className="group bg-white rounded-2xl overflow-hidden card-hover cursor-pointer animate-fade-in"
      onClick={() => onProductClick(product)}
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-cream-200">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Just Landed badge */}
        {product.isJustLanded && (
          <div className="absolute top-3 right-3 bg-charcoal text-cream-100 text-[11px] px-3 py-1 rounded-full font-medium tracking-wide z-10">
            ✨ Just Landed
          </div>
        )}

        {/* Save button */}
        <button
          onClick={e => { e.stopPropagation(); onToggleSave(product.id) }}
          aria-label={isSaved ? 'הסירי מהשמורים' : 'שמרי פריט'}
          className="absolute top-3 left-3 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm transition-transform hover:scale-110 active:scale-95"
        >
          <Heart
            className={`w-4 h-4 transition-colors duration-200 ${
              isSaved ? 'fill-rose-400 text-rose-400' : 'text-warm-gray'
            }`}
          />
        </button>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-charcoal/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-5">
          <span className="bg-white text-charcoal text-xs px-5 py-2.5 rounded-full font-medium translate-y-3 group-hover:translate-y-0 transition-transform duration-300 shadow-md">
            צפייה בפריט
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 sm:p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-medium text-charcoal text-sm sm:text-[15px] leading-snug line-clamp-1">
            {product.name}
          </h3>
          <span className="shrink-0 text-[10px] text-warm-gray bg-cream-200 px-2 py-0.5 rounded-full">
            {product.size}
          </span>
        </div>

        <p className="text-xs text-warm-gray mb-3">{product.brand}</p>

        <div className="flex items-center justify-between">
          <span className="font-semibold text-charcoal text-sm sm:text-base">
            ₪{product.pricePickup}
          </span>
          <span className="text-[11px] text-taupe-500 font-medium">
            פרטים ←
          </span>
        </div>
      </div>
    </article>
  )
}
