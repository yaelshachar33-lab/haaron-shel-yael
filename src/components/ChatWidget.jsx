import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send } from 'lucide-react'
import { useProducts } from '../hooks/useProducts'
import { useContent } from '../hooks/useContent'

function buildSiteContext(products, content) {
  const available = products.filter(p => !p.sold)
  const productLines = available.map((p, i) => {
    const price = p.discount > 0
      ? `₪${Math.round(p.pricePickup * (1 - p.discount / 100))} (מקורי ₪${p.pricePickup}, הנחה ${p.discount}%)`
      : `₪${p.pricePickup}`
    return [
      `פריט ${i + 1} [ID:${p.id}]: ${p.name}`,
      `  קטגוריה: ${p.category || 'כללי'} | מידה: ${p.size} | מחיר: ${price}`,
      p.brand       ? `  מותג: ${p.brand}` : '',
      p.color       ? `  צבע: ${p.color}` : '',
      p.description ? `  תיאור: ${p.description}` : '',
    ].filter(Boolean).join('\n')
  })

  const getTermText = (title) =>
    content.terms?.find(t => t.title === title)?.text || ''

  return `פרטי האתר:
שם: הארון של יעל
ליצירת קשר: דרך עמוד "צור קשר" באתר בלבד — אל תשתפי מספר טלפון בשיחה

פריטים זמינים (${available.length} פריטים):
${productLines.join('\n') || 'אין פריטים זמינים כרגע'}

מדיניות משלוחים: ${getTermText('משלוחים')}
איסוף עצמי: ${getTermText('איסוף עצמי')}
ביטולים והחזרות: ${getTermText('ביטולים והחזרות')}
תשלום: ${getTermText('תשלום ומשלוח')}`
}

function parseProducts(text, products) {
  const tags = [...text.matchAll(/\[PRODUCT_ID:([^\]]+)\]/g)].map(m => m[1].trim())
  const found = tags.map(id =>
    products.find(p => String(p.id) === String(id) && !p.sold)
  ).filter(Boolean)
  const seen = new Set()
  const unique = found.filter(p => seen.has(p.id) ? false : seen.add(p.id))
  const cleanText = text.replace(/\[PRODUCT_ID:[^\]]+\]/g, '').trim()
  return { cleanText, foundProducts: unique }
}

function ProductCard({ product, onProductClick }) {
  const price = product.discount > 0
    ? Math.round(product.pricePickup * (1 - product.discount / 100))
    : product.pricePickup
  return (
    <button
      onClick={() => onProductClick?.(product)}
      className="flex items-center gap-2 bg-cream-100 border border-cream-300 rounded-xl p-2 w-full text-right hover:border-taupe-400 transition-colors mt-2"
    >
      <img
        src={product.images?.[0]}
        alt={product.name}
        className="w-14 h-14 rounded-lg object-cover shrink-0"
      />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-charcoal truncate">{product.name}</p>
        {product.brand && <p className="text-[10px] text-warm-gray truncate">{product.brand}</p>}
        <p className="text-xs font-bold text-charcoal mt-0.5">₪{price}</p>
      </div>
      <span className="text-[10px] text-taupe-500 shrink-0">לפרטים ›</span>
    </button>
  )
}

export default function ChatWidget({ onProductClick }) {
  const INITIAL_MSG = { role: 'assistant', content: 'היי! אני כאן לעזור 😊 יש שאלות על הפריטים, המשלוחים או כל דבר אחר?' }

  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('chatHistory')
      return saved ? JSON.parse(saved) : [INITIAL_MSG]
    } catch { return [INITIAL_MSG] }
  })
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const { products } = useProducts()
  const { content } = useContent()

  useEffect(() => {
    try { localStorage.setItem('chatHistory', JSON.stringify(messages)) } catch {}
  }, [messages])

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [messages, open])

  const send = async () => {
    if (!input.trim() || loading) return
    const userMsg = { role: 'user', content: input.trim() }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    // Skip initial assistant greeting — it's covered by the system prompt
    const apiMessages = newMessages.slice(1).map(m => ({ role: m.role, content: m.content }))

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          siteContext: buildSiteContext(products, content),
        }),
      })
      const data = await res.json()
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: data.content || 'מצטערת, משהו השתבש. נסי שוב.' }
      ])
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'מצטערת, אין חיבור כרגע. נסי שוב בעוד רגע.' }
      ])
    } finally {
      setLoading(false)
    }
  }

  const chatPanel = (
    <>
      {/* Header */}
      <div className="bg-charcoal text-cream-100 px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full" />
          <span className="font-frank text-sm">הארון של יעל</span>
        </div>
        <button onClick={() => setOpen(false)} aria-label="סגרי צ'אט">
          <X className="w-4 h-4 opacity-70 hover:opacity-100 transition-opacity" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm">
        {messages.map((m, i) => {
          if (m.role === 'assistant') {
            const { cleanText, foundProducts } = parseProducts(m.content, products)
            return (
              <div key={i} className="flex justify-end">
                <div className="max-w-[82%] w-full">
                  <div className="px-3 py-2 rounded-2xl rounded-tl-sm leading-relaxed text-right bg-charcoal text-cream-100">
                    {cleanText}
                  </div>
                  {foundProducts.map(p => (
                    <ProductCard key={p.id} product={p} onProductClick={onProductClick} />
                  ))}
                </div>
              </div>
            )
          }
          return (
            <div key={i} className="flex justify-start">
              <div className="max-w-[82%] px-3 py-2 rounded-2xl rounded-tr-sm leading-relaxed text-right bg-cream-200 text-charcoal">
                {m.content}
              </div>
            </div>
          )
        })}
        {loading && (
          <div className="flex justify-end">
            <div className="bg-charcoal text-cream-100 px-3 py-2 rounded-2xl rounded-tl-sm text-xs opacity-60 flex gap-1 items-center">
              <span className="animate-bounce" style={{ animationDelay: '0ms' }}>•</span>
              <span className="animate-bounce" style={{ animationDelay: '150ms' }}>•</span>
              <span className="animate-bounce" style={{ animationDelay: '300ms' }}>•</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-cream-200 p-3 flex gap-2 shrink-0">
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
          placeholder="כתבי הודעה..."
          className="flex-1 text-sm bg-cream-100 rounded-xl px-3 py-2 outline-none text-right placeholder:text-warm-gray/60"
          dir="rtl"
        />
        <button
          onClick={send}
          disabled={!input.trim() || loading}
          className="bg-charcoal text-cream-100 rounded-xl p-2 disabled:opacity-30 hover:bg-charcoal/80 transition-colors shrink-0"
          aria-label="שלחי"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </>
  )

  return (
    <div dir="rtl">
      {/* Mobile: full-screen overlay so keyboard doesn't cut it off */}
      {open && (
        <div className="sm:hidden fixed inset-0 z-[100] bg-white flex flex-col">
          {chatPanel}
        </div>
      )}

      {/* Desktop: floating widget */}
      {open && (
        <div
          className="hidden sm:flex fixed bottom-24 right-6 z-50 flex-col w-80 bg-white rounded-2xl shadow-2xl border border-cream-200 overflow-hidden"
          style={{ height: '440px' }}
        >
          {chatPanel}
        </div>
      )}

      {/* Toggle button */}
      <div className="fixed bottom-6 right-6 z-[101]">
        <button
          onClick={() => setOpen(v => !v)}
          className="w-14 h-14 text-white rounded-full shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
          style={{ backgroundColor: '#B5714F' }}
          aria-label={open ? "סגרי צ'אט" : "פתחי צ'אט"}
        >
          {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        </button>
      </div>
    </div>
  )
}
