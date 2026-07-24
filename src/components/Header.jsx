import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'

const NAV_TABS = ['בגדים', 'נעליים', 'אקססוריז', 'תיקים', 'צור קשר']

export default function Header({ savedCount, showSaved, onToggleSaved, activeCategory, onCategoryChange }) {

  const handleTab = (tab) => {
    if (tab === 'צור קשר') {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
      return
    }
    onCategoryChange(activeCategory === tab ? '' : tab)
    setTimeout(() => {
      document.getElementById('items')?.scrollIntoView({ behavior: 'smooth' })
    }, 50)
  }

  return (
    <header className="sticky top-0 z-40 bg-cream-100/95 backdrop-blur-sm border-b border-cream-300">

      {/* Top row: saved + title + placeholder */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">

        <div className="w-20" />

        <h1 className="font-frank text-2xl sm:text-3xl font-light text-charcoal tracking-wide text-center">
          הארון של יעל
        </h1>

        <div className="flex items-center justify-end w-20">
          <button
            onClick={onToggleSaved}
            className={`relative flex items-center gap-1.5 text-sm font-medium transition-colors duration-200 ${
              showSaved ? 'text-charcoal' : 'text-warm-gray hover:text-charcoal'
            }`}
            aria-label="פריטים שמורים"
          >
            <Heart className={`w-5 h-5 transition-all ${showSaved ? 'fill-rose-400 text-rose-400' : ''}`} />
            <span className="hidden sm:inline">שמורים</span>
            {savedCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-blush-300 text-charcoal text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-semibold">
                {savedCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Category tabs row */}
      <div className="border-t border-cream-300">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 flex items-center justify-center overflow-x-auto">
          {NAV_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => handleTab(tab)}
              className={`shrink-0 px-4 py-2.5 text-sm font-medium transition-colors duration-200 border-b-2 ${
                activeCategory === tab
                  ? 'border-charcoal text-charcoal'
                  : 'border-transparent text-warm-gray hover:text-charcoal'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    </header>
  )
}
