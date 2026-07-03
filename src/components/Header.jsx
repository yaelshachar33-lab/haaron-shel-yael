import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Header({ savedCount, showSaved, onToggleSaved }) {

  return (
    <header className="sticky top-0 z-40 bg-cream-100/95 backdrop-blur-sm border-b border-cream-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">

        {/* Saved button — right side placeholder for balance */}
        <div className="w-20" />

        {/* Logo centered */}
        <Link to="/" onClick={() => window.scrollTo(0,0)} className="shrink-0">
          <img src="/logo_yael.png" alt="הארון של יעל" className="h-24 w-auto object-contain" style={{mixBlendMode:'multiply'}} />
        </Link>

        {/* Saved */}
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
    </header>
  )
}
