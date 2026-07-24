import { useState } from 'react'
import { SlidersHorizontal, ChevronDown, X } from 'lucide-react'
import { SIZES } from '../data/products'

const BRANDS_EXCLUDE = ['ASOS', 'Shein', 'Wrangler']
const STYLES_EXCLUDE = ['ערבי', 'ערבי-רומנטי', "ויטג'"]

const SORT_OPTIONS = [
  { value: 'newest',     label: 'חדש ביותר' },
  { value: 'price-asc',  label: 'מחיר: מהזול ליקר' },
  { value: 'price-desc', label: 'מחיר: מהיקר לזול' },
]

function Select({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block text-[11px] text-warm-gray mb-1.5 font-medium tracking-wide">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full appearance-none bg-white border border-cream-300 text-charcoal text-sm rounded-xl px-4 py-2.5 pl-8 focus:outline-none focus:border-taupe-400 transition-colors cursor-pointer"
        >
          <option value="">הכל</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-warm-gray pointer-events-none" />
      </div>
    </div>
  )
}

export default function FilterBar({ filters, setFilters, sortBy, setSortBy, defaultFilters, products = [] }) {
  const [open, setOpen] = useState(false)

  const set = (key, val) => setFilters(prev => ({ ...prev, [key]: val }))

  const unique = (key) => [...new Set(products.map(p => p[key]).filter(Boolean))].sort()

  const activeCount = [
    filters.size, filters.color, filters.brand, filters.season, filters.style,
    filters.maxPrice < 500 ? 'price' : '',
  ].filter(Boolean).length

  return (
    <div className="bg-cream-100/95 backdrop-blur-sm border-b border-cream-300">

      {/* Control row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <button
          onClick={() => setOpen(v => !v)}
          className="flex items-center gap-2 text-sm font-medium text-charcoal hover:text-taupe-500 transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>סינון</span>
          {activeCount > 0 && (
            <span className="bg-charcoal text-cream-100 text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-semibold">
              {activeCount}
            </span>
          )}
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-warm-gray hidden sm:inline">מיון לפי:</span>
          <div className="relative">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="appearance-none bg-cream-200 border border-cream-300 text-charcoal text-sm rounded-full px-4 py-2 pl-7 cursor-pointer focus:outline-none focus:border-taupe-400"
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-warm-gray pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Expanded filter panel */}
      {open && (
        <div className="border-t border-cream-300 bg-cream-50 px-4 sm:px-6 py-5 animate-fade-in">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <Select label="מידה"  value={filters.size}   onChange={v => set('size', v)}   options={SIZES} />
              <Select label="צבע"   value={filters.color}  onChange={v => set('color', v)}  options={unique('color')} />
              <Select label="מותג"  value={filters.brand}  onChange={v => set('brand', v)}  options={unique('brand').filter(b => !BRANDS_EXCLUDE.includes(b))} />
              <Select label="עונה"  value={filters.season} onChange={v => set('season', v)} options={unique('season')} />
              <Select label="סגנון" value={filters.style}  onChange={v => set('style', v)}  options={unique('style').filter(s => !STYLES_EXCLUDE.includes(s))} />

              {/* Price range */}
              <div>
                <label className="block text-[11px] text-warm-gray mb-1.5 font-medium tracking-wide">
                  מחיר עד: <span className="text-charcoal font-semibold">₪{filters.maxPrice}</span>
                </label>
                <input
                  type="range"
                  min={0} max={500} step={10}
                  value={filters.maxPrice}
                  onChange={e => set('maxPrice', Number(e.target.value))}
                  className="w-full mt-1"
                />
                <div className="flex justify-between text-[10px] text-warm-gray mt-1">
                  <span>₪0</span><span>₪500</span>
                </div>
              </div>
            </div>

            {activeCount > 0 && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setFilters(defaultFilters)}
                  className="flex items-center gap-1 text-xs text-warm-gray hover:text-charcoal transition-colors"
                >
                  <X className="w-3 h-3" />
                  נקה את כל הסינונים
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
