import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useContent } from '../hooks/useContent'

const SECTIONS = [
  {
    title: 'כללי',
    text: 'מדיניות פרטיות זו מסבירה כיצד הארון של יעל אוסף, שומר ומשתמש במידע שמוסרים לנו במסגרת ביצוע הזמנה או יצירת קשר. השימוש באתר מהווה הסכמה למדיניות זו.',
  },
  {
    title: 'איזה מידע נאסף',
    text: 'במסגרת ביצוע הזמנה אנו אוספים את הפרטים הבאים בלבד: שם מלא, כתובת למשלוח, כתובת דוא"ל ומספר אסמכתא לתשלום. פרטים אלה נמסרים מרצון על ידי הלקוחה בעת מילוי טופס ההזמנה.',
  },
  {
    title: 'מטרת השימוש במידע',
    text: 'המידע משמש אך ורק לצורך עיבוד ההזמנה, תיאום המשלוח ויצירת קשר בנוגע להזמנה. לא נעשה שימוש במידע למטרות שיווק, פרסום או כל מטרה אחרת.',
  },
  {
    title: 'שמירה ואבטחת המידע',
    text: 'המידע נשמר בשירות Firebase של חברת Google, המאובטח בתקני אבטחה מחמירים. הגישה למידע מוגבלת לבעלת האתר בלבד.',
  },
  {
    title: 'שיתוף מידע עם צד שלישי',
    text: 'המידע אינו נמסר לצדדים שלישיים, למעט חברת השליחויות לצורך ביצוע המשלוח (שם וכתובת בלבד). לא נמכר ולא מועבר מידע לגורמי שיווק.',
  },
  {
    title: 'עוגיות (Cookies)',
    text: 'האתר עושה שימוש מינימלי בעוגיות הנדרשות לתפקוד בסיסי בלבד, כגון שמירת פריטים מועדפים. אין שימוש בעוגיות לצרכי מעקב או פרסום.',
  },
  {
    title: 'זכויות המשתמש',
    text: 'בהתאם לחוק הגנת הפרטיות, תשמ"א-1981, כל לקוחה רשאית לבקש לעיין במידע השמור עליה, לתקנו או למחוק אותו. לבקשות מסוג זה ניתן לפנות בוואטסאפ.',
  },
  {
    title: 'יצירת קשר בנושא פרטיות',
    text: 'לכל שאלה או בקשה בנוגע למדיניות הפרטיות ניתן לפנות אלי ישירות בוואטסאפ ואשמח לעזור.',
  },
]

export default function PrivacyPage() {
  const { content } = useContent()
  const navigate = useNavigate()
  const year = new Date().getFullYear()

  return (
    <div className="min-h-screen bg-cream-100 font-heebo" dir="rtl">

      <header className="bg-cream-100/95 backdrop-blur-sm border-b border-cream-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="font-frank text-2xl font-light text-charcoal tracking-wide"
          >
            הארון של יעל
          </button>
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-sm text-warm-gray hover:text-charcoal transition-colors">
            <ArrowRight className="w-4 h-4" />
            חזרה
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="font-frank text-4xl font-light text-charcoal mb-3 text-center">מדיניות פרטיות</h1>
        <p className="text-center text-xs text-warm-gray mb-10">עודכן לאחרונה: {year}</p>

        <div className="space-y-8 text-sm text-warm-gray leading-8">
          {SECTIONS.map(section => (
            <div key={section.title}>
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
