import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send } from 'lucide-react'
import { useProducts } from '../hooks/useProducts'
import { useContent } from '../hooks/useContent'

function buildSiteContext(products, content) {
  const available = products.filter(p => !p.sold)
  const productLines = available.map(p => {
    const price = p.discount > 0
      ? `₪${Math.round(p.pricePickup * (1 - p.discount / 100))} (מחיר מקורי ₪${p.pricePickup}, הנחה ${p.discount}%)`
      : `₪${p.pricePickup}`
    return `- ${p.name} | קטגוריה: ${p.category || 'כללי'} | מידה: ${p.size} | מחיר: ${price}${p.brand ? ` | מותג: ${p.brand}` : ''}`
  })

  const getTermText = (title) =>
    content.terms?.find(t => t.title === title)?.text || ''

  return `פרטי האתר:
שם: הארון של יעל
טלפון/ביט: ${content.phone || '0524028228'}
אינסטגרם: ${content.instagram || '@haaron_shel_yael'}

פריטים זמינים (${available.length} פריטים):
${productLines.join('\n') || 'אין פריטים זמינים כרגע'}

מדיניות משלוחים: ${getTermText('משלוחים')}
איסוף עצמי: ${getTermText('איסוף עצמי')}
ביטולים והחזרות: ${getTermText('ביטולים והחזרות')}
תשלום: ${getTermText('תשלום ומשלוח')}`
}

export default function ChatWidget() {
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

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end" dir="rtl">
      {open && (
        <div
          className="mb-3 w-80 bg-white rounded-2xl shadow-2xl border border-cream-200 flex flex-col overflow-hidden"
          style={{ height: '440px' }}
        >
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
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                <div
                  className={`max-w-[82%] px-3 py-2 rounded-2xl leading-relaxed text-right ${
                    m.role === 'user'
                      ? 'bg-cream-200 text-charcoal rounded-tr-sm'
                      : 'bg-charcoal text-cream-100 rounded-tl-sm'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
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
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-14 h-14 bg-rose-900 text-white rounded-full shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
        aria-label={open ? "סגרי צ'אט" : "פתחי צ'אט"}
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </div>
  )
}
