import { useState, useEffect, useCallback } from 'react'
import { X, Heart, MessageCircle, ChevronRight, ChevronLeft, Package, Truck, CreditCard, Send, CheckCircle } from 'lucide-react'
import emailjs from '@emailjs/browser'

const EJ_SERVICE  = import.meta.env.VITE_EMAILJS_SERVICE_ID  || 'service_iu828sa'
const EJ_TEMPLATE = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_3j8cm77'
const EJ_KEY      = import.meta.env.VITE_EMAILJS_PUBLIC_KEY  || 'kevgZjm-dmrw3sWlk'

const DETAIL_FIELDS = [
  ['type',      'סוג פריט'],
  ['size',      'מידה'],
  ['fabric',    'סוג בד'],
  ['brand',     'מותג'],
  ['color',     'צבע'],
  ['style',     'סגנון'],
  ['season',    'עונה'],
  ['condition', 'מצב'],
]

export default function ProductModal({ product, isSaved, onClose, onToggleSave, whatsappNumber }) {
  const [activeImg, setActiveImg] = useState(0)
  const [showBit, setShowBit] = useState(false)
  const [showDeliveryForm, setShowDeliveryForm] = useState(false)
  const [formData, setFormData] = useState({ firstName: '', lastName: '', address: '', paymentRef: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [sendError, setSendError] = useState(false)

  const prev = useCallback(() => setActiveImg(i => Math.max(0, i - 1)), [])
  const next = useCallback(() => setActiveImg(i => Math.min(product.images.length - 1, i + 1)), [product.images.length])

  useEffect(() => {
    setActiveImg(0)
    setShowDeliveryForm(false)
    setSent(false)
    setSendError(false)
    setFormData({ firstName: '', lastName: '', address: '', paymentRef: '' })
  }, [product.id])

  const handleDeliverySubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    setSendError(false)
    try {
      await emailjs.send(
        EJ_SERVICE,
        EJ_TEMPLATE,
        {
          product_name: product.name,
          price: product.priceDelivery,
          first_name: formData.firstName,
          last_name: formData.lastName,
          address: formData.address,
          payment_ref: formData.paymentRef,
        },
        { publicKey: EJ_KEY }
      )
      setSent(true)
    } catch (err) {
      setSendError(err?.text || err?.message || JSON.stringify(err) || 'שגיאה לא ידועה')
    } finally {
      setSending(false)
    }
  }

  useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') prev()
      if (e.key === 'ArrowLeft')  next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, prev, next])

  const waText  = encodeURIComponent(`היי יעל! ראיתי את "${product.name}" ורציתי לשאול לגביו 😊`)
  const waUrl   = `https://wa.me/${whatsappNumber}?text=${waText}`

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">

      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-charcoal/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      {/* Modal card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={product.name}
        className="relative w-full sm:max-w-4xl bg-cream-100 rounded-t-3xl sm:rounded-3xl overflow-hidden animate-modal-in max-h-[95vh] flex flex-col"
      >
        {/* Drag handle (mobile) */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-cream-300" />
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="סגירה"
          className="absolute top-4 left-4 z-10 w-9 h-9 rounded-full bg-cream-200/90 backdrop-blur-sm flex items-center justify-center hover:bg-cream-300 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Content */}
        <div className="flex flex-col sm:flex-row overflow-y-auto flex-1 min-h-0">

          {/* ── Left: images ── */}
          <div className="sm:w-[45%] shrink-0 bg-cream-200">
            <div className="relative aspect-[3/4] overflow-hidden">
              <img
                key={activeImg}
                src={product.images[activeImg]}
                alt={`${product.name} – תמונה ${activeImg + 1}`}
                className="w-full h-full object-cover animate-fade-in"
              />

              {((Date.now() - new Date(product.dateAdded).getTime()) / 86400000) <= 3 && (
                <div className="absolute top-4 right-4 bg-charcoal text-cream-100 text-xs px-3 py-1.5 rounded-full font-medium">
                  ✨ Just Landed
                </div>
              )}

              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prev}
                    disabled={activeImg === 0}
                    aria-label="תמונה קודמת"
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 backdrop-blur-sm flex items-center justify-center shadow disabled:opacity-25 hover:bg-white transition"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={next}
                    disabled={activeImg === product.images.length - 1}
                    aria-label="תמונה הבאה"
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 backdrop-blur-sm flex items-center justify-center shadow disabled:opacity-25 hover:bg-white transition"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {/* Dots */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {product.images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImg(i)}
                        aria-label={`תמונה ${i + 1}`}
                        className={`w-1.5 h-1.5 rounded-full transition-all ${i === activeImg ? 'bg-white w-4' : 'bg-white/60'}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex justify-end gap-2 p-3 bg-cream-100">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                      i === activeImg ? 'border-charcoal' : 'border-transparent opacity-50 hover:opacity-80'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Right: details ── */}
          <div className="sm:w-[55%] p-4 sm:p-8 sm:overflow-y-auto">
            <p className="text-xs text-taupe-500 font-medium tracking-widest uppercase mb-1">{product.type}</p>
            <h2 className="font-frank text-2xl sm:text-3xl font-light text-charcoal mb-1">
              {product.name}
            </h2>
            <p className="text-sm text-charcoal/70 mb-5">{product.brand}</p>

            {product.description && (
              <p className="text-sm sm:text-sm text-charcoal/80 leading-relaxed mb-5 pb-5 border-b border-cream-300">
                {product.description}
              </p>
            )}

            {/* Detail grid */}
            <div className="grid grid-cols-2 gap-2 mb-6">
              {DETAIL_FIELDS.map(([key, label]) => (
                <div key={key} className="bg-cream-200 rounded-xl p-3">
                  <div className="text-xs text-charcoal/60 mb-0.5 font-medium">{label}</div>
                  <div className="text-sm font-medium text-charcoal">{product[key]}</div>
                </div>
              ))}
            </div>

            {/* Pricing */}
            <div className="flex gap-3 mb-6">
              <div className="flex-1 bg-cream-200 rounded-2xl p-4 text-center">
                <div className="flex items-center justify-center gap-1 text-warm-gray text-xs mb-1.5">
                  <Package className="w-3.5 h-3.5" />
                  <span>איסוף עצמי</span>
                </div>
                <div className="font-frank text-2xl text-charcoal">₪{product.pricePickup}</div>
              </div>
              <div className="flex-1 bg-blush-100 rounded-2xl p-4 text-center">
                <div className="flex items-center justify-center gap-1 text-warm-gray text-xs mb-1.5">
                  <Truck className="w-3.5 h-3.5" />
                  <span>כולל משלוח</span>
                </div>
                <div className="font-frank text-2xl text-charcoal">₪{product.priceDelivery}</div>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col gap-3">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp w-full py-4 text-base"
              >
                <MessageCircle className="w-5 h-5" />
                צרי קשר ב-WhatsApp
              </a>

              {/* Delivery order form */}
              <button
                onClick={() => { setShowDeliveryForm(p => !p); setSent(false); setSendError(false) }}
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full border border-cream-300 text-warm-gray hover:border-taupe-400 hover:text-charcoal text-sm font-medium transition-all duration-200"
              >
                <Truck className="w-4 h-4" />
                הזמנה עם משלוח
              </button>

              {showDeliveryForm && !sent && (
                <form onSubmit={handleDeliverySubmit} className="bg-cream-200 rounded-2xl p-4 space-y-3 animate-fade-in">
                  <p className="text-xs text-warm-gray text-center mb-2">מלאי פרטים ונשלח אליך אישור</p>
                  <div className="flex gap-2">
                    <input
                      required
                      placeholder="שם פרטי"
                      value={formData.firstName}
                      onChange={e => setFormData(p => ({ ...p, firstName: e.target.value }))}
                      className="flex-1 bg-white border border-cream-300 rounded-xl px-3 py-2.5 text-sm text-charcoal placeholder-warm-gray focus:outline-none focus:border-taupe-400"
                    />
                    <input
                      required
                      placeholder="שם משפחה"
                      value={formData.lastName}
                      onChange={e => setFormData(p => ({ ...p, lastName: e.target.value }))}
                      className="flex-1 bg-white border border-cream-300 rounded-xl px-3 py-2.5 text-sm text-charcoal placeholder-warm-gray focus:outline-none focus:border-taupe-400"
                    />
                  </div>
                  <textarea
                    required
                    placeholder="כתובת מלאה (רחוב, מספר, עיר, מיקוד)"
                    value={formData.address}
                    onChange={e => setFormData(p => ({ ...p, address: e.target.value }))}
                    rows={2}
                    className="w-full bg-white border border-cream-300 rounded-xl px-3 py-2.5 text-sm text-charcoal placeholder-warm-gray focus:outline-none focus:border-taupe-400 resize-none"
                  />
                  <input
                    required
                    placeholder="אסמכתא לתשלום – מספר אישור בן 13 ספרות (ביט/פייבוקס)"
                    value={formData.paymentRef}
                    onChange={e => setFormData(p => ({ ...p, paymentRef: e.target.value }))}
                    className="w-full bg-white border border-cream-300 rounded-xl px-3 py-2.5 text-sm text-charcoal placeholder-warm-gray focus:outline-none focus:border-taupe-400"
                  />
                  <div className="text-center text-xs text-warm-gray">סכום לתשלום: <span className="font-semibold text-charcoal">₪{product.priceDelivery}</span></div>
                  {sendError && <p className="text-xs text-red-500 text-center">שגיאה: {sendError}</p>}
                  <button
                    type="submit"
                    disabled={sending}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-full bg-charcoal text-cream-100 text-sm font-medium hover:bg-taupe-600 transition-colors disabled:opacity-60"
                  >
                    <Send className="w-4 h-4" />
                    {sending ? 'שולחת...' : 'שלחי הזמנה'}
                  </button>
                </form>
              )}

              {sent && (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center animate-fade-in">
                  <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-charcoal">ההזמנה נשלחה!</p>
                  <p className="text-xs text-warm-gray mt-1">אחזור אליך בהקדם</p>
                </div>
              )}

              <button
                onClick={() => setShowBit(p => !p)}
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full border border-cream-300 text-warm-gray hover:border-taupe-400 hover:text-charcoal text-sm font-medium transition-all duration-200"
              >
                <CreditCard className="w-4 h-4" />
                תשלום בביט
              </button>

              {showBit && (
                <div className="bg-cream-200 rounded-2xl p-4 text-center space-y-1 animate-fade-in">
                  <p className="text-xs text-warm-gray">שלחי ביט למספר</p>
                  <p className="font-frank text-2xl text-charcoal tracking-wide">{whatsappNumber.replace('972', '0')}</p>
                  <p className="text-xs text-warm-gray">סכום: <span className="font-semibold text-charcoal">₪{product.pricePickup}</span> (איסוף) או <span className="font-semibold text-charcoal">₪{product.priceDelivery}</span> (משלוח)</p>
                  <p className="text-sm text-charcoal pt-1 font-medium">לאחר התשלום שלחי לי הודעה ב-WhatsApp</p>
                </div>
              )}

              <button
                onClick={onToggleSave}
                className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-full border text-sm font-medium transition-all duration-200 ${
                  isSaved
                    ? 'bg-blush-100 border-blush-300 text-charcoal'
                    : 'border-cream-300 text-warm-gray hover:border-taupe-400 hover:text-charcoal'
                }`}
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-300 text-rose-400' : ''}`} />
                {isSaved ? 'הסירי מהשמורים' : 'שמרי פריט'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
