import { useState, useEffect, useMemo } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import FilterBar from './components/FilterBar'
import ProductGrid from './components/ProductGrid'
import ProductModal from './components/ProductModal'
import Footer from './components/Footer'
import { useProducts } from './hooks/useProducts'
import { WHATSAPP_NUMBER } from './data/products'

function isJustLanded(dateAdded) {
  const diff = (Date.now() - new Date(dateAdded).getTime()) / (1000 * 60 * 60 * 24)
  return diff <= 3
}

const DEFAULT_FILTERS = {
  size: '', color: '', brand: '', season: '', style: '', maxPrice: 500,
}

export default function MainSite() {
  const { products } = useProducts()
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [filters, setFilters]     = useState(DEFAULT_FILTERS)
  const [sortBy, setSortBy]       = useState('newest')
  const [showSaved, setShowSaved] = useState(false)
  const [savedIds, setSavedIds]   = useState(() => {
    try { return JSON.parse(localStorage.getItem('savedItems') || '[]') } catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem('savedItems', JSON.stringify(savedIds))
  }, [savedIds])

  useEffect(() => {
    document.body.style.overflow = selectedProduct ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [selectedProduct])

  const toggleSave = (id) =>
    setSavedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  const enriched = useMemo(() =>
    products.map(p => ({ ...p, isJustLanded: isJustLanded(p.dateAdded) })),
    [products]
  )

  const displayed = useMemo(() => {
    let list = showSaved ? enriched.filter(p => savedIds.includes(p.id)) : enriched
    if (filters.size)   list = list.filter(p => p.size === filters.size)
    if (filters.color)  list = list.filter(p => p.color === filters.color)
    if (filters.brand)  list = list.filter(p => p.brand === filters.brand)
    if (filters.season) list = list.filter(p => p.season === filters.season)
    if (filters.style)  list = list.filter(p => p.style === filters.style)
    list = list.filter(p => p.pricePickup <= filters.maxPrice)
    if (sortBy === 'newest')     list = [...list].sort((a,b) => new Date(b.dateAdded) - new Date(a.dateAdded))
    if (sortBy === 'price-asc')  list = [...list].sort((a,b) => a.pricePickup - b.pricePickup)
    if (sortBy === 'price-desc') list = [...list].sort((a,b) => b.pricePickup - a.pricePickup)
    return list
  }, [enriched, filters, sortBy, savedIds, showSaved])

  return (
    <div className="min-h-screen bg-cream-100 font-heebo" dir="rtl">
      <Header
        savedCount={savedIds.length}
        showSaved={showSaved}
        onToggleSaved={() => setShowSaved(v => !v)}
      />
      <Hero />
      <main id="items">
        <div className="sticky top-[65px] z-30">
          <FilterBar
            filters={filters}
            setFilters={setFilters}
            sortBy={sortBy}
            setSortBy={setSortBy}
            defaultFilters={DEFAULT_FILTERS}
            products={enriched}
          />
        </div>
        <ProductGrid
          products={displayed}
          savedIds={savedIds}
          onProductClick={setSelectedProduct}
          onToggleSave={toggleSave}
        />
      </main>
      <Footer />
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isSaved={savedIds.includes(selectedProduct.id)}
          onClose={() => setSelectedProduct(null)}
          onToggleSave={() => toggleSave(selectedProduct.id)}
          whatsappNumber={WHATSAPP_NUMBER}
        />
      )}
    </div>
  )
}
