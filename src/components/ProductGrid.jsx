import ProductCard from './ProductCard'

export default function ProductGrid({ products, savedIds, onProductClick, onToggleSave }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

      {/* Section header */}
      <div className="flex items-end justify-between mb-6 sm:mb-8">
        <h2 className="font-frank text-3xl font-light text-charcoal">הפריטים שלי</h2>
        <span className="text-sm text-warm-gray">{products.length} פריטים</span>
      </div>

      {products.length === 0 ? (
        <div className="py-28 text-center">
          <p className="font-frank text-3xl text-taupe-300 font-light mb-3">לא נמצאו פריטים</p>
          <p className="text-sm text-warm-gray">נסי לשנות או לנקות את הסינון</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              isSaved={savedIds.includes(product.id)}
              onProductClick={onProductClick}
              onToggleSave={onToggleSave}
            />
          ))}
        </div>
      )}
    </section>
  )
}
