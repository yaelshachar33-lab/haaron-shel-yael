import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Leaf, Heart, Recycle, Sparkles } from 'lucide-react'
import { useContent } from '../hooks/useContent'

const ICONS = [
  <Recycle className="w-6 h-6 text-taupe-500" />,
  <Leaf className="w-6 h-6 text-taupe-500" />,
  <Heart className="w-6 h-6 text-taupe-500" />,
  <Sparkles className="w-6 h-6 text-taupe-500" />,
]

export default function AboutPage() {
  const { content } = useContent()
  const navigate = useNavigate()
  const values   = content.aboutValues || []
  const goHome   = () => navigate('/')

  return (
    <div className="min-h-screen bg-cream-100" dir="rtl">

      {/* Header */}
      <header className="bg-cream-100/95 backdrop-blur-sm border-b border-cream-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <button onClick={goHome} className="shrink-0">
            <img src="/logo_yael.png" alt="הארון של יעל" className="h-20 w-auto object-contain" style={{ mixBlendMode: 'multiply' }} />
          </button>
          <button onClick={goHome} className="flex items-center gap-2 text-sm text-warm-gray hover:text-charcoal transition-colors">
            <ArrowRight className="w-4 h-4" />
            חזרה
          </button>
        </div>
      </header>

      <main>

        {/* Hero */}
        <section className="bg-cream-100 pt-20 pb-8 px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px w-14 bg-taupe-300" />
              <span className="text-taupe-400">✦</span>
              <div className="h-px w-14 bg-taupe-300" />
            </div>
            <h1 className="font-frank text-5xl sm:text-6xl font-light text-charcoal mb-6">קצת עלי</h1>
            <p className="text-warm-gray text-base sm:text-lg font-light leading-relaxed">
              {content.aboutIntro}
            </p>
          </div>
        </section>

        {/* Story */}
        <section className="pt-4 pb-16 px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-warm-gray font-light leading-8 text-sm sm:text-base space-y-2">
              {(content.aboutStory || []).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="flex items-center justify-center gap-4 py-2">
          <div className="h-px w-20 bg-taupe-300" />
          <span className="text-taupe-400">✦</span>
          <div className="h-px w-20 bg-taupe-300" />
        </div>

        {/* Values */}
        {values.length > 0 && (
          <section className="py-16 px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-frank text-3xl font-light text-charcoal text-center mb-12">מה שמניע אותי</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {values.map(({ title, text }, i) => (
                  <div key={i} className="bg-white border border-cream-300 rounded-2xl p-7 hover:shadow-md transition-shadow">
                    <div className="w-11 h-11 rounded-full bg-cream-100 flex items-center justify-center mb-4">
                      {ICONS[i % ICONS.length]}
                    </div>
                    <h3 className="font-frank text-xl font-light text-charcoal mb-2">{title}</h3>
                    <p className="text-sm text-warm-gray font-light leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Closing quote */}
        {content.aboutClosingQuote && (
          <section className="py-16 px-4 text-center bg-cream-100">
            <div className="max-w-xl mx-auto">
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="h-px w-14 bg-taupe-300" />
                <span className="text-taupe-400">✦</span>
                <div className="h-px w-14 bg-taupe-300" />
              </div>
              <p className="font-frank text-2xl font-light text-charcoal">
                {content.aboutClosingQuote}
              </p>
            </div>
          </section>
        )}

      </main>
    </div>
  )
}
