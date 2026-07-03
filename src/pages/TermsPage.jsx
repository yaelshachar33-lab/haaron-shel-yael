import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useContent } from '../hooks/useContent'

export default function TermsPage() {
  const { content } = useContent()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-cream-100 font-heebo" dir="rtl">

      <header className="bg-cream-100/95 backdrop-blur-sm border-b border-cream-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="shrink-0">
            <img src="/logo_yael.png" alt="הארון של יעל" className="h-20 w-auto object-contain" style={{ mixBlendMode: 'multiply' }} />
          </button>
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-sm text-warm-gray hover:text-charcoal transition-colors">
            <ArrowRight className="w-4 h-4" />
            חזרה
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="font-frank text-4xl font-light text-charcoal mb-10 text-center">תקנון</h1>

        <div className="space-y-8 text-sm text-warm-gray leading-8">
          {(content.terms || []).map(section => (
            <div key={section.id}>
              <h2 className="font-frank text-xl font-light text-charcoal mb-2">{section.title}</h2>
              <p>{section.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button onClick={() => navigate('/')} className="btn-primary px-8 py-3">חזרה לפריטים</button>
        </div>
      </main>
    </div>
  )
}
