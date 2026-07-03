import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Plus, Edit2, Trash2, LogOut, Eye, Save, X,
  Image as ImageIcon, ChevronDown, Package, FileText,
} from 'lucide-react'
import { useProducts } from '../hooks/useProducts'
import { useContent } from '../hooks/useContent'
import { SIZES, BRANDS, SEASONS, STYLES, COLORS } from '../data/products'

// ── Change this to your own password ──────────────────────────────
const ADMIN_PASSWORD = 'yael1234'
// ──────────────────────────────────────────────────────────────────

const EMPTY = {
  name: '', type: '', size: '', fabric: '', brand: '',
  color: '', colorHex: '#C4A882', style: '', condition: '',
  pricePickup: '', priceDelivery: '', season: '', description: '',
  images: [''],
}

/* ── Small helpers ── */
function Label({ children }) {
  return <label className="block text-xs font-semibold text-gray-500 mb-1 tracking-wide">{children}</label>
}

const inp = 'w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-taupe-400 bg-white transition-colors'

/* ── Product Form (add / edit) ── */
function ProductForm({ initial, onSave, onCancel }) {
  const [f, setF] = useState(
    initial
      ? { ...initial, images: initial.images?.length ? initial.images : [''] }
      : EMPTY
  )
  const set = (k, v) => setF(p => ({ ...p, [k]: v }))
  const setImg = (i, v) => setF(p => ({ ...p, images: p.images.map((x, idx) => idx === i ? v : x) }))
  const addImg  = () => setF(p => ({ ...p, images: [...p.images, ''] }))
  const rmImg   = (i) => setF(p => ({ ...p, images: p.images.filter((_, idx) => idx !== i) }))

  const submit = (e) => {
    e.preventDefault()
    onSave({
      ...f,
      pricePickup:   Number(f.pricePickup),
      priceDelivery: Number(f.priceDelivery),
      images: f.images.filter(Boolean),
    })
  }

  const SelectField = ({ label, k, options }) => (
    <div>
      <Label>{label}</Label>
      <div className="relative">
        <select value={f[k]} onChange={e => set(k, e.target.value)} className={inp + ' appearance-none pl-8'}>
          <option value="">בחרי...</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
      </div>
    </div>
  )

  return (
    <form onSubmit={submit} dir="rtl" className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>שם הפריט *</Label>
          <input required value={f.name} onChange={e => set('name', e.target.value)}
            className={inp} placeholder="שמלת מידי פרחונית" />
        </div>
        <div>
          <Label>סוג פריט *</Label>
          <input required value={f.type} onChange={e => set('type', e.target.value)}
            className={inp} placeholder="שמלה / חצאית / חולצה..." />
        </div>

        <SelectField label="מידה *"  k="size"   options={SIZES} />
        <SelectField label="עונה"    k="season" options={SEASONS} />

        <div>
          <Label>מותג</Label>
          <input value={f.brand} onChange={e => set('brand', e.target.value)}
            list="brands-list" className={inp} placeholder="Zara, Mango..." />
          <datalist id="brands-list">{BRANDS.map(b => <option key={b} value={b} />)}</datalist>
        </div>
        <div>
          <Label>סגנון</Label>
          <input value={f.style} onChange={e => set('style', e.target.value)}
            list="styles-list" className={inp} placeholder="קז'ואל, אלגנטי..." />
          <datalist id="styles-list">{STYLES.map(s => <option key={s} value={s} />)}</datalist>
        </div>

        <div>
          <Label>צבע</Label>
          <div className="flex gap-2">
            <input value={f.color} onChange={e => set('color', e.target.value)}
              list="colors-list" className={inp + ' flex-1'} placeholder="לבן, שחור..." />
            <datalist id="colors-list">{COLORS.map(c => <option key={c} value={c} />)}</datalist>
            <input type="color" value={f.colorHex} onChange={e => set('colorHex', e.target.value)}
              className="w-10 h-10 border border-gray-200 rounded-xl cursor-pointer p-0.5 shrink-0" />
          </div>
        </div>
        <div>
          <Label>סוג בד</Label>
          <input value={f.fabric} onChange={e => set('fabric', e.target.value)}
            className={inp} placeholder="כותנה 100%, ויסקוז..." />
        </div>

        <div>
          <Label>מחיר איסוף (₪) *</Label>
          <input required type="number" min="0" value={f.pricePickup}
            onChange={e => set('pricePickup', e.target.value)} className={inp} placeholder="80" />
        </div>
        <div>
          <Label>מחיר כולל משלוח (₪) *</Label>
          <input required type="number" min="0" value={f.priceDelivery}
            onChange={e => set('priceDelivery', e.target.value)} className={inp} placeholder="100" />
        </div>
      </div>

      <div>
        <Label>מצב הפריט</Label>
        <input value={f.condition} onChange={e => set('condition', e.target.value)}
          className={inp} placeholder="מצוין – נלבש פעמיים / טוב מאוד / טוב" />
      </div>

      <div>
        <Label>תיאור חופשי</Label>
        <textarea value={f.description} onChange={e => set('description', e.target.value)}
          rows={3} className={inp + ' resize-none'}
          placeholder="ספרי על הפריט – מה מיוחד בו, מתי לבשת, למה אוהבת אותו..." />
      </div>

      {/* Image URLs */}
      <div>
        <Label>קישורי תמונות (URL)</Label>
        <p className="text-xs text-gray-400 mb-2">
          העלי תמונה ל-<a href="https://imgur.com/upload" target="_blank" rel="noreferrer" className="underline hover:text-taupe-500">Imgur</a> וקופי את הקישור
        </p>
        <div className="space-y-2">
          {f.images.map((img, i) => (
            <div key={i} className="flex gap-2 items-center">
              <ImageIcon className="w-4 h-4 text-gray-300 shrink-0" />
              <input
                value={img}
                onChange={e => setImg(i, e.target.value)}
                className={inp + ' flex-1'}
                placeholder="https://i.imgur.com/..."
              />
              {/* Preview thumbnail */}
              {img && (
                <img src={img} alt="" className="w-9 h-9 rounded-lg object-cover border border-gray-200 shrink-0"
                  onError={e => { e.target.style.display = 'none' }} />
              )}
              {f.images.length > 1 && (
                <button type="button" onClick={() => rmImg(i)}
                  className="text-gray-300 hover:text-red-400 transition-colors shrink-0">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
        <button type="button" onClick={addImg}
          className="mt-2 flex items-center gap-1 text-xs text-taupe-500 hover:text-charcoal transition-colors font-medium">
          <Plus className="w-3 h-3" /> תמונה נוספת
        </button>
      </div>

      {/* Submit */}
      <div className="flex gap-3 pt-2 border-t border-gray-100">
        <button type="submit"
          className="flex-1 flex items-center justify-center gap-2 bg-charcoal text-white rounded-xl py-3 text-sm font-medium hover:bg-taupe-600 transition-colors">
          <Save className="w-4 h-4" />
          {initial ? 'שמירת שינויים' : 'הוספת פריט'}
        </button>
        <button type="button" onClick={onCancel}
          className="px-5 border border-gray-200 text-gray-500 rounded-xl py-3 text-sm font-medium hover:bg-gray-50 transition-colors">
          ביטול
        </button>
      </div>
    </form>
  )
}

/* ── Login Screen ── */
function LoginScreen({ onLogin }) {
  const [pw, setPw]     = useState('')
  const [err, setErr]   = useState(false)

  const submit = (e) => {
    e.preventDefault()
    if (pw === ADMIN_PASSWORD) { onLogin() }
    else { setErr(true); setPw('') }
  }

  return (
    <div className="min-h-screen bg-cream-100 flex items-center justify-center px-4" dir="rtl">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-frank text-4xl font-light text-charcoal mb-2">הארון של יעל</h1>
          <p className="text-sm text-warm-gray">אזור ניהול</p>
        </div>
        <form onSubmit={submit} className="bg-white rounded-3xl shadow-sm p-8 space-y-4">
          <div>
            <Label>סיסמה</Label>
            <input
              type="password" value={pw} onChange={e => { setPw(e.target.value); setErr(false) }}
              className={inp + (err ? ' border-red-300' : '')}
              placeholder="הזיני סיסמה..."
              autoFocus
            />
            {err && <p className="text-red-400 text-xs mt-1">סיסמה שגויה</p>}
          </div>
          <button type="submit"
            className="w-full bg-charcoal text-white rounded-xl py-3 text-sm font-medium hover:bg-taupe-600 transition-colors">
            כניסה
          </button>
        </form>
        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-warm-gray hover:text-charcoal transition-colors">
            ← חזרה לאתר
          </Link>
        </div>
      </div>
    </div>
  )
}

/* ── About Editor ── */
function AboutEditor({ onSave }) {
  const { content, updateContent } = useContent()
  const [intro, setIntro]   = useState(content.aboutIntro || '')
  const [story, setStory]   = useState((content.aboutStory || []).map(s => s))
  const [values, setValues] = useState((content.aboutValues || []).map(v => ({ ...v })))
  const [quote, setQuote]   = useState(content.aboutClosingQuote || '')

  const setStoryLine = (i, v) => setStory(prev => prev.map((s, idx) => idx === i ? v : s))
  const addStory     = () => setStory(prev => [...prev, ''])
  const rmStory      = (i) => setStory(prev => prev.filter((_, idx) => idx !== i))

  const setVal  = (i, k, v) => setValues(prev => prev.map((val, idx) => idx === i ? { ...val, [k]: v } : val))
  const addVal  = () => setValues(prev => [...prev, { title: '', text: '' }])
  const rmVal   = (i) => setValues(prev => prev.filter((_, idx) => idx !== i))

  const submit = (e) => {
    e.preventDefault()
    updateContent({
      aboutIntro: intro,
      aboutStory: story.filter(Boolean),
      aboutValues: values.filter(v => v.title || v.text),
      aboutClosingQuote: quote,
    })
    onSave()
  }

  return (
    <form onSubmit={submit} dir="rtl" className="space-y-6">

      <div className="bg-taupe-300/20 rounded-2xl p-4 space-y-3">
        <h4 className="text-xs font-semibold text-charcoal tracking-wide uppercase">כותרת משנה</h4>
        <div>
          <Label>משפט תיאור קצר</Label>
          <input value={intro} onChange={e => setIntro(e.target.value)} className={inp} />
        </div>
      </div>

      <div className="bg-taupe-300/20 rounded-2xl p-4 space-y-3">
        <h4 className="text-xs font-semibold text-charcoal tracking-wide uppercase">הסיפור שלי</h4>
        {story.map((para, i) => (
          <div key={i} className="flex gap-2">
            <textarea
              value={para}
              onChange={e => setStoryLine(i, e.target.value)}
              rows={2}
              className={inp + ' flex-1 resize-none'}
              placeholder={`פסקה ${i + 1}`}
            />
            {story.length > 1 && (
              <button type="button" onClick={() => rmStory(i)} className="text-gray-300 hover:text-red-400 transition-colors self-start mt-1">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={addStory} className="text-xs text-taupe-500 hover:text-charcoal flex items-center gap-1">
          <Plus className="w-3 h-3" /> הוספת פסקה
        </button>
      </div>

      <div className="bg-taupe-300/20 rounded-2xl p-4 space-y-3">
        <h4 className="text-xs font-semibold text-charcoal tracking-wide uppercase">ערכים (כרטיסיות)</h4>
        {values.map((v, i) => (
          <div key={i} className="bg-white rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-warm-gray">כרטיסייה {i + 1}</span>
              <button type="button" onClick={() => rmVal(i)} className="text-gray-300 hover:text-red-400 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div>
              <Label>כותרת</Label>
              <input value={v.title} onChange={e => setVal(i, 'title', e.target.value)} className={inp} placeholder="צריכה מודעת..." />
            </div>
            <div>
              <Label>תוכן</Label>
              <textarea value={v.text} onChange={e => setVal(i, 'text', e.target.value)} rows={2} className={inp + ' resize-none'} placeholder="תיאור הערך..." />
            </div>
          </div>
        ))}
        <button type="button" onClick={addVal} className="text-xs text-taupe-500 hover:text-charcoal flex items-center gap-1">
          <Plus className="w-3 h-3" /> הוספת כרטיסייה
        </button>
      </div>

      <div className="bg-taupe-300/20 rounded-2xl p-4 space-y-3">
        <h4 className="text-xs font-semibold text-charcoal tracking-wide uppercase">משפט סיום</h4>
        <input value={quote} onChange={e => setQuote(e.target.value)} className={inp} />
      </div>

      <button type="submit"
        className="w-full flex items-center justify-center gap-2 bg-charcoal text-white rounded-xl py-3 text-sm font-medium hover:bg-taupe-600 transition-colors">
        <Save className="w-4 h-4" />
        שמירת עמוד עלי
      </button>
    </form>
  )
}

/* ── Terms Editor ── */
function TermsEditor({ onSave }) {
  const { content, updateContent } = useContent()
  const [sections, setSections] = useState(
    (content.terms || []).map(s => ({ ...s }))
  )

  const set = (id, key, val) =>
    setSections(prev => prev.map(s => s.id === id ? { ...s, [key]: val } : s))

  const add = () =>
    setSections(prev => [...prev, { id: Date.now(), title: '', text: '' }])

  const remove = (id) =>
    setSections(prev => prev.filter(s => s.id !== id))

  const submit = (e) => {
    e.preventDefault()
    updateContent({ terms: sections.filter(s => s.title || s.text) })
    onSave()
  }

  return (
    <form onSubmit={submit} dir="rtl" className="space-y-4">
      <p className="text-xs text-warm-gray">הכותרות יוצגו בפונט Frank Ruhl Libre (כמו כותרות האתר)</p>

      {sections.map((s, i) => (
        <div key={s.id} className="bg-taupe-300/20 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-warm-gray">סעיף {i + 1}</span>
            <button type="button" onClick={() => remove(s.id)}
              className="text-gray-300 hover:text-red-400 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div>
            <Label>כותרת</Label>
            <input
              value={s.title}
              onChange={e => set(s.id, 'title', e.target.value)}
              className={inp}
              placeholder="כללי / תשלום ומשלוח..."
            />
            {s.title && (
              <p className="font-frank text-xl font-light text-charcoal mt-1 opacity-50">
                תצוגה: {s.title}
              </p>
            )}
          </div>
          <div>
            <Label>תוכן</Label>
            <textarea
              value={s.text}
              onChange={e => set(s.id, 'text', e.target.value)}
              rows={3}
              className={inp + ' resize-none'}
              placeholder="הכניסי את תוכן הסעיף..."
            />
          </div>
        </div>
      ))}

      <button type="button" onClick={add}
        className="flex items-center gap-1.5 text-sm text-taupe-500 hover:text-charcoal transition-colors font-medium">
        <Plus className="w-4 h-4" /> הוספת סעיף חדש
      </button>

      <div className="pt-2 border-t border-gray-100">
        <button type="submit"
          className="w-full flex items-center justify-center gap-2 bg-charcoal text-white rounded-xl py-3 text-sm font-medium hover:bg-taupe-600 transition-colors">
          <Save className="w-4 h-4" />
          שמירת התקנון
        </button>
      </div>
    </form>
  )
}

function ContentEditor({ onSave }) {
  const { content, updateContent } = useContent()
  const [c, setC] = useState({ ...content, story: [...content.story], stats: content.stats.map(s => ({...s})) })
  const set = (k, v) => setC(p => ({ ...p, [k]: v }))

  const setStory = (i, v) => setC(p => ({ ...p, story: p.story.map((s, idx) => idx === i ? v : s) }))
  const addStory = () => setC(p => ({ ...p, story: [...p.story, ''] }))
  const rmStory  = (i) => setC(p => ({ ...p, story: p.story.filter((_, idx) => idx !== i) }))

  const setStat = (i, k, v) => setC(p => ({ ...p, stats: p.stats.map((s, idx) => idx === i ? { ...s, [k]: v } : s) }))

  const submit = (e) => {
    e.preventDefault()
    updateContent(c)
    onSave()
  }

  return (
    <form onSubmit={submit} dir="rtl" className="space-y-6">

      <div className="bg-taupe-300/20 rounded-2xl p-4 space-y-3">
        <h4 className="text-xs font-semibold text-charcoal tracking-wide uppercase">באנר עליון</h4>
        <div>
          <Label>תת-כותרת</Label>
          <input value={c.bannerSubtitle} onChange={e => set('bannerSubtitle', e.target.value)} className={inp} />
        </div>
        <div>
          <Label>טקסט כפתור</Label>
          <input value={c.bannerCta} onChange={e => set('bannerCta', e.target.value)} className={inp} />
        </div>
      </div>

      <div className="bg-taupe-300/20 rounded-2xl p-4 space-y-3">
        <h4 className="text-xs font-semibold text-charcoal tracking-wide uppercase">הסיפור האישי</h4>
        {c.story.map((para, i) => (
          <div key={i} className="flex gap-2">
            <textarea
              value={para}
              onChange={e => setStory(i, e.target.value)}
              rows={2}
              className={inp + ' flex-1 resize-none'}
              placeholder={`פסקה ${i + 1}`}
            />
            {c.story.length > 1 && (
              <button type="button" onClick={() => rmStory(i)} className="text-gray-300 hover:text-red-400 transition-colors self-start mt-1">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={addStory} className="text-xs text-taupe-500 hover:text-charcoal flex items-center gap-1">
          <Plus className="w-3 h-3" /> הוספת פסקה
        </button>
        <div>
          <Label>משפט מודגש (ציטוט)</Label>
          <input value={c.storyQuote} onChange={e => set('storyQuote', e.target.value)} className={inp} />
        </div>
      </div>

      <div className="bg-taupe-300/20 rounded-2xl p-4 space-y-4">
        <h4 className="text-xs font-semibold text-charcoal tracking-wide uppercase">סטטיסטיקות</h4>
        {c.stats.map((s, i) => (
          <div key={i} className="bg-white rounded-xl p-3 space-y-2">
            <span className="text-xs font-semibold text-warm-gray">נתון {i + 1}</span>
            <div className="flex gap-2">
              <div className="w-24 shrink-0">
                <Label>ערך</Label>
                <input value={s.value} onChange={e => setStat(i, 'value', e.target.value)} className={inp} placeholder="12+" />
              </div>
              <div className="flex-1">
                <Label>תיאור</Label>
                <input value={s.label} onChange={e => setStat(i, 'label', e.target.value)} className={inp} placeholder="פריטים זמינים" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-taupe-300/20 rounded-2xl p-4 space-y-3">
        <h4 className="text-xs font-semibold text-charcoal tracking-wide uppercase">פרטי קשר (פוטר)</h4>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>מספר טלפון (לקישור WA)</Label>
            <input value={c.phone} onChange={e => set('phone', e.target.value)} className={inp} placeholder="0524028228" />
          </div>
          <div>
            <Label>מספר טלפון (לתצוגה)</Label>
            <input value={c.phoneDisplay} onChange={e => set('phoneDisplay', e.target.value)} className={inp} placeholder="052-402-8228" />
          </div>
        </div>
        <div>
          <Label>אינסטגרם</Label>
          <input value={c.instagram} onChange={e => set('instagram', e.target.value)} className={inp} placeholder="@haaron_shel_yael" />
        </div>
        <div>
          <Label>טקסט פוטר</Label>
          <input value={c.footerTagline} onChange={e => set('footerTagline', e.target.value)} className={inp} />
        </div>
      </div>

      <button type="submit"
        className="w-full flex items-center justify-center gap-2 bg-charcoal text-white rounded-xl py-3 text-sm font-medium hover:bg-taupe-600 transition-colors">
        <Save className="w-4 h-4" />
        שמירת כל השינויים
      </button>
    </form>
  )
}

/* ── Main Admin Page ── */
export default function AdminPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts()
  const [loggedIn, setLoggedIn] = useState(false)
  const [tab, setTab]           = useState('products') // 'products' | 'content' | 'about' | 'terms'
  const [editing, setEditing]   = useState(null)
  const [adding, setAdding]     = useState(false)
  const [toast, setToast]       = useState('')

  if (!loggedIn) return <LoginScreen onLogin={() => setLoggedIn(true)} />

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  const handleAdd = (data) => {
    addProduct(data)
    setAdding(false)
    showToast('הפריט נוסף בהצלחה ✓')
  }

  const handleUpdate = (data) => {
    updateProduct(editing.id, data)
    setEditing(null)
    showToast('הפריט עודכן בהצלחה ✓')
  }

  const handleDelete = (id, name) => {
    if (!confirm(`למחוק את "${name}"?`)) return
    deleteProduct(id)
    showToast('הפריט נמחק')
  }

  const isFormOpen = adding || !!editing

  return (
    <div className="min-h-screen bg-gray-50 font-heebo" dir="rtl">

      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <span className="font-frank text-xl text-charcoal">הארון של יעל</span>
            <span className="text-warm-gray text-sm mr-3">— ניהול</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/"
              className="flex items-center gap-1.5 text-sm text-warm-gray hover:text-charcoal transition-colors">
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">צפייה באתר</span>
            </Link>
            <button onClick={() => setLoggedIn(false)}
              className="flex items-center gap-1.5 text-sm text-warm-gray hover:text-charcoal transition-colors">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">יציאה</span>
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        <div className="flex gap-1 bg-gray-100 rounded-2xl p-1 w-fit">
          {[['products', <Package className="w-4 h-4" />, 'פריטים'], ['content', <FileText className="w-4 h-4" />, 'תוכן האתר'], ['about', <FileText className="w-4 h-4" />, 'עמוד עלי'], ['terms', <FileText className="w-4 h-4" />, 'תקנון']].map(([id, icon, label]) => (
            <button key={id} onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                tab === id ? 'bg-white text-charcoal shadow-sm' : 'text-warm-gray hover:text-charcoal'
              }`}>
              {icon}{label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {tab === 'content' ? (
          <div className="max-w-2xl">
            <h2 className="text-lg font-semibold text-charcoal mb-6">עריכת תוכן האתר</h2>
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <ContentEditor onSave={() => showToast('התוכן עודכן בהצלחה ✓')} />
            </div>
          </div>
        ) : tab === 'about' ? (
          <div className="max-w-2xl">
            <h2 className="text-lg font-semibold text-charcoal mb-6">עריכת עמוד עלי</h2>
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <AboutEditor onSave={() => showToast('עמוד עלי עודכן בהצלחה ✓')} />
            </div>
          </div>
        ) : tab === 'terms' ? (
          <div className="max-w-2xl">
            <h2 className="text-lg font-semibold text-charcoal mb-6">עריכת תקנון</h2>
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <TermsEditor onSave={() => showToast('התקנון עודכן בהצלחה ✓')} />
            </div>
          </div>
        ) : (
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── Right panel: product list ── */}
          <div className="lg:w-1/2 xl:w-3/5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-charcoal">
                פריטים ({products.length})
              </h2>
              {!isFormOpen && (
                <button
                  onClick={() => { setAdding(true); setEditing(null) }}
                  className="flex items-center gap-1.5 bg-charcoal text-white text-sm px-4 py-2 rounded-full hover:bg-taupe-600 transition-colors">
                  <Plus className="w-4 h-4" />
                  הוספת פריט
                </button>
              )}
            </div>

            <div className="space-y-2">
              {products.map(p => (
                <div key={p.id}
                  className={`bg-white rounded-2xl p-4 flex items-center gap-4 border-2 transition-colors ${
                    editing?.id === p.id ? 'border-taupe-400' : 'border-transparent hover:border-gray-100'
                  }`}>
                  {/* Thumbnail */}
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-cream-200 shrink-0">
                    {p.images?.[0] ? (
                      <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-5 h-5 text-cream-300" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-charcoal text-sm truncate">{p.name}</p>
                      {(() => {
                        const diff = (Date.now() - new Date(p.dateAdded).getTime()) / (1000*60*60*24)
                        return diff <= 3 ? (
                          <span className="text-[10px] bg-charcoal text-white px-2 py-0.5 rounded-full shrink-0">Just Landed</span>
                        ) : null
                      })()}
                    </div>
                    <p className="text-xs text-warm-gray mt-0.5">
                      {p.brand} · מידה {p.size} · ₪{p.pricePickup}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => { setEditing(p); setAdding(false) }}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-warm-gray hover:bg-cream-100 hover:text-charcoal transition-colors">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id, p.name)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-warm-gray hover:bg-red-50 hover:text-red-400 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {products.length === 0 && (
                <div className="text-center py-16 text-warm-gray">
                  <Package className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">אין פריטים עדיין</p>
                </div>
              )}
            </div>
          </div>

          {/* ── Left panel: form ── */}
          <div className="lg:w-1/2 xl:w-2/5">
            {isFormOpen ? (
              <div className="bg-white rounded-3xl p-6 shadow-sm sticky top-24">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-semibold text-charcoal">
                    {adding ? 'פריט חדש' : `עריכת "${editing.name}"`}
                  </h3>
                  <button
                    onClick={() => { setAdding(false); setEditing(null) }}
                    className="text-gray-400 hover:text-charcoal transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="max-h-[calc(100vh-200px)] overflow-y-auto pl-1">
                  <ProductForm
                    initial={editing || null}
                    onSave={adding ? handleAdd : handleUpdate}
                    onCancel={() => { setAdding(false); setEditing(null) }}
                  />
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-8 text-center border-2 border-dashed border-gray-100">
                <Plus className="w-8 h-8 mx-auto text-gray-300 mb-3" />
                <p className="text-sm text-warm-gray mb-4">הוסיפי פריט חדש או לחצי על עריכה</p>
                <button
                  onClick={() => { setAdding(true); setEditing(null) }}
                  className="bg-charcoal text-white text-sm px-6 py-2.5 rounded-full hover:bg-taupe-600 transition-colors">
                  + הוספת פריט חדש
                </button>
              </div>
            )}
          </div>
        </div>
        )}
      </div>

      {/* Toast notification */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-charcoal text-white text-sm px-5 py-2.5 rounded-full shadow-lg animate-fade-in z-50">
          {toast}
        </div>
      )}
    </div>
  )
}
