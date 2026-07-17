import { Heart, Instagram } from 'lucide-react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useContent } from '../hooks/useContent'

export default function Footer() {
  const { content } = useContent()
  const year = new Date().getFullYear()
  const waNumber = content.phone.replace(/\D/g, '').replace(/^0/, '972')
  const navigate = useNavigate()
  const location = useLocation()

  const goToItems = (e) => {
    e.preventDefault()
    if (location.pathname === '/') {
      document.getElementById('items')?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/')
      setTimeout(() => document.getElementById('items')?.scrollIntoView({ behavior: 'smooth' }), 150)
    }
  }

  return (
    <footer className="bg-charcoal text-cream-200 mt-20" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-12">

          {/* Brand */}
          <div>
            <h3 className="font-frank text-4xl font-light text-cream-100 mb-4">הארון של יעל</h3>
            <p className="text-sm leading-relaxed text-cream-300">{content.footerTagline}</p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-[11px] font-medium tracking-[0.3em] uppercase text-taupe-300 mb-5">ניווט מהיר</h4>
            <ul className="space-y-3 text-sm text-cream-300">
              <li><Link to="/" onClick={() => window.scrollTo(0, 0)} className="hover:text-cream-100 transition-colors">דף הבית</Link></li>
              <li><a href="#items" onClick={goToItems} className="hover:text-cream-100 transition-colors">הפריטים</a></li>
              <li><Link to="/about" className="hover:text-cream-100 transition-colors">עלי</Link></li>

              <li><Link to="/terms" className="hover:text-cream-100 transition-colors">תקנון</Link></li>
              <li><Link to="/contact" className="hover:text-cream-100 transition-colors">צרי קשר</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[11px] font-medium tracking-[0.3em] uppercase text-taupe-300 mb-5">צרי קשר</h4>
            <p className="text-sm text-cream-300 mb-3">לכל שאלה – WhatsApp בלבד</p>
            <a
              href={`https://wa.me/${waNumber}`}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-cream-100 hover:text-blush-300 transition-colors"
            >
              📱 {content.phoneDisplay}
            </a>

            {content.instagram && (
              <div className="mt-6">
                <a
                  href={`https://instagram.com/${content.instagram.replace('@','')}`}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-cream-300 hover:text-cream-100 transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                  {content.instagram}
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-cream-300">
          <p>© {year} הארון של יעל. כל הזכויות שמורות.</p>
          <p className="flex items-center gap-1.5">
            עוצב באהבה
            <Heart className="w-3 h-3 fill-blush-300 text-blush-300" />
          </p>
        </div>
      </div>
    </footer>
  )
}
