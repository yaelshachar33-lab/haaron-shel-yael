import { useNavigate } from 'react-router-dom'
import { Instagram, Mail, ArrowRight } from 'lucide-react'
import { useContent } from '../hooks/useContent'

export default function ContactPage() {
  const { content } = useContent()
  const navigate = useNavigate()
  const waNumber = content.phone.replace(/\D/g, '').replace(/^0/, '972')

  return (
    <div className="min-h-screen bg-cream-50" dir="rtl">

      {/* Header */}
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

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">

        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="h-px w-14 bg-taupe-300" />
          <span className="text-taupe-400">✦</span>
          <div className="h-px w-14 bg-taupe-300" />
        </div>

        <h1 className="font-frank text-4xl sm:text-5xl font-light text-charcoal mb-4">צרי קשר</h1>
        <p className="text-warm-gray text-base font-light mb-4 leading-relaxed">
          שמחה לשמוע ממך! יש שאלה על פריט? רוצה לדעת עוד פרטים? מוזמנת לפנות אלי ישירות בוואטסאפ ואחזור אליך בהקדם.
        </p>
        <p className="text-taupe-400 text-sm mb-14">עונה בימי א׳–ה׳ בין 9:00–21:00</p>

        <div className="flex flex-col gap-5 items-center">

          {/* WhatsApp */}
          <a
            href={`https://wa.me/${waNumber}`}
            target="_blank" rel="noopener noreferrer"
            className="w-full max-w-sm flex items-center gap-4 bg-white border border-cream-300 rounded-2xl px-6 py-5 hover:border-taupe-400 hover:shadow-md transition-all group"
          >
            <div className="w-11 h-11 rounded-full bg-[#25D366]/10 flex items-center justify-center text-xl shrink-0">📱</div>
            <div className="text-right">
              <p className="text-[11px] text-warm-gray tracking-widest uppercase mb-0.5">WhatsApp</p>
              <p className="text-charcoal font-medium">{content.phoneDisplay}</p>
            </div>
          </a>

          {/* Email */}
          <a
            href="mailto:yaelshachar33@gmail.com"
            className="w-full max-w-sm flex items-center gap-4 bg-white border border-cream-300 rounded-2xl px-6 py-5 hover:border-taupe-400 hover:shadow-md transition-all group"
          >
            <div className="w-11 h-11 rounded-full bg-blush-100 flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5 text-blush-400" />
            </div>
            <div className="text-right">
              <p className="text-[11px] text-warm-gray tracking-widest uppercase mb-0.5">אימייל</p>
              <p className="text-charcoal font-medium">yaelshachar33@gmail.com</p>
            </div>
          </a>

          {/* Instagram */}
          {content.instagram && (
            <a
              href={`https://instagram.com/${content.instagram.replace('@', '')}`}
              target="_blank" rel="noopener noreferrer"
              className="w-full max-w-sm flex items-center gap-4 bg-white border border-cream-300 rounded-2xl px-6 py-5 hover:border-taupe-400 hover:shadow-md transition-all group"
            >
              <div className="w-11 h-11 rounded-full bg-pink-50 flex items-center justify-center shrink-0">
                <Instagram className="w-5 h-5 text-pink-400" />
              </div>
              <div className="text-right">
                <p className="text-[11px] text-warm-gray tracking-widest uppercase mb-0.5">Instagram</p>
                <p className="text-charcoal font-medium">{content.instagram}</p>
              </div>
            </a>
          )}

        </div>

        <div className="flex items-center justify-center gap-4 mt-14">
          <div className="h-px w-14 bg-taupe-300" />
          <span className="text-taupe-400">✦</span>
          <div className="h-px w-14 bg-taupe-300" />
        </div>

        <p className="mt-6 text-xs text-warm-gray">מעדיפה לקבל פניות דרך WhatsApp לשירות מהיר יותר</p>
      </main>
    </div>
  )
}
