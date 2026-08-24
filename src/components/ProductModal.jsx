import { useState, useEffect, useCallback, useRef } from 'react'
import { X, Heart, MessageCircle, ChevronRight, ChevronLeft, Package, Truck, ShoppingBag, Send, CheckCircle, ZoomIn } from 'lucide-react'
import emailjs from '@emailjs/browser'
import { db } from '../firebase'
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore'

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

function MobileLightbox({ src, alt, onClose }) {
  const [scale, setScale] = useState(1)
  const [translate, setTranslate] = useState({ x: 0, y: 0 })
  const touchRef = useRef({})

  const getDistance = (t1, t2) =>
    Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY)

  const getMidpoint = (t1, t2) => ({
    x: (t1.clientX + t2.clientX) / 2,
    y: (t1.clientY + t2.clientY) / 2,
  })

  const onTouchStart = (e) => {
    e.preventDefault()
    const touches = e.touches
    if (touches.length === 1) {
      touchRef.current = { mode: 'pan', lastX: touches[0].clientX, lastY: touches[0].clientY }
    } else if (touches.length === 2) {
      touchRef.current = {
        mode: 'pinch',
        lastDist: getDistance(touches[0], touches[1]),
        lastMid: getMidpoint(touches[0], touches[1]),
        lastScale: scale,
      }
    }
  }

  const onTouchMove = (e) => {
    e.preventDefault()
    const touches = e.touches
    const ref = touchRef.current
    if (ref.mode === 'pan' && touches.length === 1) {
      const dx = touches[0].clientX - ref.lastX
      const dy = touches[0].clientY - ref.lastY
      setTranslate(prev => ({ x: prev.x + dx, y: prev.y + dy }))
      touchRef.current.lastX = touches[0].clientX
      touchRef.current.lastY = touches[0].clientY
    } else if (ref.mode === 'pinch' && touches.length === 2) {
      const dist = getDistance(touches[0], touches[1])
      const newScale = Math.min(5, Math.max(1, ref.lastScale * (dist / ref.lastDist)))
      setScale(newScale)
    }
  }

  const onTouchEnd = (e) => {
    if (e.touches.length === 0 && touchRef.current.mode === 'pan') {
      // reset pan when zoomed out to 1
      setScale(prev => {
        if (prev <= 1.05) { setTranslate({ x: 0, y: 0 }); return 1 }
        return prev
      })
    }
    if (e.touches.length < 2) touchRef.current.mode = 'pan'
  }

  // prevent body scroll while lightbox open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div
      className="fixed inset-0 z-[200] bg-black flex items-center justify-center select-none"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <button
        className="absolute top-4 left-4 text-white bg-white/20 rounded-full p-2 z-10"
        onTouchEnd={e => { e.stopPropagation(); onClose() }}
        onClick={onClose}
      >
        <X className="w-5 h-5" />
      </button>
      <img
        src={src}
        alt={alt}
        className="max-w-full max-h-full object-contain"
        style={{
          transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
          transformOrigin: 'center center',
          transition: 'none',
          userSelect: 'none',
          pointerEvents: 'none',
        }}
        draggable={false}
      />
      {scale <= 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1.5 rounded-full pointer-events-none">
          גררי לתנועה · צבטי להגדלה
        </div>
      )}
    </div>
  )
}

function ZoomableImage({ src, alt }) {
  const [zoomed, setZoomed] = useState(false)
  const [origin, setOrigin] = useState('50% 50%')
  const [lightbox, setLightbox] = useState(false)

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1)
    const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1)
    setOrigin(`${x}% ${y}%`)
  }

  return (
    <>
      {/* Desktop: hover zoom */}
      <div
        className="hidden sm:block w-full h-full overflow-hidden cursor-zoom-in"
        onMouseEnter={() => setZoomed(true)}
        onMouseLeave={() => setZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <img
          key={src}
          src={src}
          alt={alt}
          className="w-full h-full object-cover animate-fade-in"
          style={{
            transform: zoomed ? 'scale(2.5)' : 'scale(1)',
            transformOrigin: origin,
            transition: zoomed ? 'transform-origin 0s' : 'transform 0.3s ease',
          }}
          draggable={false}
        />
        {!zoomed && (
          <div className="absolute bottom-3 left-3 bg-black/40 text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1 pointer-events-none">
            <ZoomIn className="w-3 h-3" />
            <span>העבירי עכבר להגדלה</span>
          </div>
        )}
      </div>

      {/* Mobile: tap to open lightbox */}
      <div
        className="sm:hidden w-full h-full overflow-hidden cursor-zoom-in"
        onClick={() => setLightbox(true)}
      >
        <img key={src} src={src} alt={alt} className="w-full h-full object-cover animate-fade-in" draggable={false} />
        <div className="absolute bottom-3 left-3 bg-black/40 text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1 pointer-events-none">
          <ZoomIn className="w-3 h-3" />
          <span>לחצי להגדלה</span>
        </div>
      </div>

      {lightbox && <MobileLightbox src={src} alt={alt} onClose={() => setLightbox(false)} />}
    </>
  )
}

export default function ProductModal({ product, isSaved, onClose, onToggleSave, whatsappNumber }) {
  const [activeImg, setActiveImg] = useState(0)
  const [showOrderPanel, setShowOrderPanel] = useState(false)
  const [showDeliveryForm, setShowDeliveryForm] = useState(false)
  const [formData, setFormData] = useState({ firstName: '', lastName: '', address: '', paymentRef: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [sendError, setSendError] = useState(false)

  const [showPickupForm, setShowPickupForm] = useState(false)
  const [pickupData, setPickupData] = useState({ firstName: '', lastName: '', paymentRef: '' })
  const [pickupSending, setPickupSending] = useState(false)
  const [pickupSent, setPickupSent] = useState(false)
  const [pickupError, setPickupError] = useState(false)
  const pickupFormRef = useRef(null)
  const deliveryFormRef = useRef(null)
  const orderPanelRef = useRef(null)

  const prev = useCallback(() => setActiveImg(i => Math.max(0, i - 1)), [])
  const next = useCallback(() => setActiveImg(i => Math.min(product.images.length - 1, i + 1)), [product.images.length])

  useEffect(() => {
    setActiveImg(0)
    setShowOrderPanel(false)
    setShowDeliveryForm(false)
    setSent(false)
    setSendError(false)
    setFormData({ firstName: '', lastName: '', address: '', paymentRef: '' })
    setShowPickupForm(false)
    setPickupSent(false)
    setPickupError(false)
    setPickupData({ firstName: '', lastName: '', paymentRef: '' })
  }, [product.id])

  const handlePickupSubmit = async (e) => {
    e.preventDefault()
    setPickupSending(true)
    setPickupError(false)
    try {
      await emailjs.send(
        EJ_SERVICE,
        EJ_TEMPLATE,
        {
          product_name: product.name,
          price:        product.pricePickup,
          first_name:   pickupData.firstName,
          last_name:    pickupData.lastName,
          address:      'איסוף עצמי – יתואם מראש',
          payment_ref:  pickupData.paymentRef,
        },
        { publicKey: EJ_KEY }
      )
      await addDoc(collection(db, 'orders'), {
        firstName:    pickupData.firstName,
        lastName:     pickupData.lastName,
        address:      'איסוף עצמי',
        paymentRef:   pickupData.paymentRef,
        productName:  product.name,
        price:        product.pricePickup,
        deliveryType: 'איסוף עצמי',
        orderDate:    new Date().toISOString(),
        status:       'הוזמן',
      })
      try {
        await updateDoc(doc(db, 'products', String(product.id)), { sold: true })
        onSold?.(product.id)
      } catch {}
      setPickupSent(true)
    } catch (err) {
      setPickupError(err?.text || err?.message || 'שגיאה לא ידועה')
    } finally {
      setPickupSending(false)
    }
  }

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
      await addDoc(collection(db, 'orders'), {
        firstName:   formData.firstName,
        lastName:    formData.lastName,
        address:     formData.address,
        paymentRef:  formData.paymentRef,
        productName: product.name,
        price:       product.priceDelivery,
        orderDate:   new Date().toISOString(),
        status:      'הוזמן',
      })
      try {
        await updateDoc(doc(db, 'products', String(product.id)), { sold: true })
        onSold?.(product.id)
      } catch {}
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
        className="relative w-full sm:max-w-4xl bg-cream-100 rounded-t-3xl sm:rounded-3xl overflow-hidden animate-modal-in h-[95vh] sm:h-auto sm:max-h-[95vh] flex flex-col"
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
          <div className="sm:w-[45%] shrink-0 bg-cream-200 max-h-[40vh] sm:max-h-none overflow-hidden sm:overflow-visible">
            <div className="relative aspect-square sm:aspect-[3/4] overflow-hidden">
              <ZoomableImage src={product.images[activeImg]} alt={`${product.name} – תמונה ${activeImg + 1}`} />

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
              <div className="flex justify-start gap-2 p-3 bg-cream-100">
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
          <div className="sm:w-[55%] p-4 sm:p-8 overflow-y-auto">
            <p className="text-xs text-taupe-500 font-medium tracking-widest uppercase mb-1">{product.type}</p>
            <div className="flex items-start justify-between gap-2 mb-1">
              <h2 className="font-frank text-2xl sm:text-3xl font-light text-charcoal">
                {product.name}
              </h2>
              <button
                onClick={onToggleSave}
                className={`shrink-0 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 mt-1 ${
                  isSaved ? 'bg-blush-100 text-rose-400' : 'bg-cream-200 text-warm-gray hover:bg-blush-100 hover:text-rose-400'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-rose-300' : ''}`} />
                {isSaved ? 'הסירי מהשמורים' : 'שמרי פריט'}
              </button>
            </div>
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
                {product.discount > 0 ? (
                  <div className="flex items-baseline justify-center gap-2">
                    <div className="font-frank text-2xl text-charcoal">₪{Math.round(product.pricePickup * (1 - product.discount / 100))}</div>
                    <div className="text-sm text-warm-gray line-through">₪{product.pricePickup}</div>
                  </div>
                ) : (
                  <div className="font-frank text-2xl text-charcoal">₪{product.pricePickup}</div>
                )}
              </div>
              <div className="flex-1 bg-blush-100 rounded-2xl p-4 text-center">
                <div className="flex items-center justify-center gap-1 text-warm-gray text-xs mb-1.5">
                  <Truck className="w-3.5 h-3.5" />
                  <span>כולל משלוח</span>
                </div>
                {product.discount > 0 ? (
                  <div className="flex items-baseline justify-center gap-2">
                    <div className="font-frank text-2xl text-charcoal">₪{Math.round(product.priceDelivery * (1 - product.discount / 100))}</div>
                    <div className="text-sm text-warm-gray line-through">₪{product.priceDelivery}</div>
                  </div>
                ) : (
                  <div className="font-frank text-2xl text-charcoal">₪{product.priceDelivery}</div>
                )}
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col gap-3">
              {product.sold && (
                <div className="bg-charcoal/10 border border-charcoal/20 rounded-2xl p-4 text-center">
                  <p className="text-sm font-semibold text-charcoal">הפריט נמכר</p>
                  <p className="text-xs text-warm-gray mt-1">פריט זה אינו זמין יותר</p>
                </div>
              )}

              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp w-full py-4 text-base"
              >
                <MessageCircle className="w-5 h-5" />
                צרי קשר ב-WhatsApp
              </a>

              {/* Single order button → panel */}
              {!product.sold && (
                <button
                  onClick={() => {
                    const opening = !showOrderPanel
                    setShowOrderPanel(p => !p)
                    setShowDeliveryForm(false); setSent(false); setSendError(false)
                    setShowPickupForm(false); setPickupSent(false); setPickupError(false)
                    if (opening) setTimeout(() => orderPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
                  }}
                  className="flex items-center justify-center gap-2 w-full py-3.5 px-5 rounded-full border border-cream-300 text-warm-gray hover:border-taupe-400 hover:text-charcoal text-sm font-medium transition-all duration-200"
                >
                  <ShoppingBag className="w-4 h-4" />
                  הזמנה
                </button>
              )}

              {!product.sold && showOrderPanel && (
                <div ref={orderPanelRef} className="bg-cream-200 rounded-2xl p-4 space-y-3 animate-fade-in">

                  {/* Option selectors */}
                  {!showDeliveryForm && !showPickupForm && !sent && !pickupSent && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setShowPickupForm(true); setTimeout(() => pickupFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50) }}
                        className="flex-1 flex flex-col items-center gap-1 py-3 px-2 bg-white border border-cream-300 rounded-xl hover:border-taupe-400 transition-colors"
                      >
                        <Package className="w-4 h-4 text-warm-gray" />
                        <span className="text-xs font-medium text-charcoal">איסוף עצמי</span>
                        <span className="text-sm font-bold text-charcoal">₪{product.discount > 0 ? Math.round(product.pricePickup * (1 - product.discount / 100)) : product.pricePickup}</span>
                      </button>
                      <button
                        onClick={() => { setShowDeliveryForm(true); setTimeout(() => deliveryFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50) }}
                        className="flex-1 flex flex-col items-center gap-1 py-3 px-2 bg-white border border-cream-300 rounded-xl hover:border-taupe-400 transition-colors"
                      >
                        <Truck className="w-4 h-4 text-warm-gray" />
                        <span className="text-xs font-medium text-charcoal">עם משלוח</span>
                        <span className="text-sm font-bold text-charcoal">₪{product.discount > 0 ? Math.round(product.priceDelivery * (1 - product.discount / 100)) : product.priceDelivery}</span>
                      </button>
                    </div>
                  )}

                  {/* Delivery form */}
                  {showDeliveryForm && !sent && (
                    <form ref={deliveryFormRef} onSubmit={handleDeliverySubmit} className="space-y-3 animate-fade-in">
                      <button type="button" onClick={() => setShowDeliveryForm(false)} className="text-xs text-warm-gray hover:text-charcoal flex items-center gap-1">
                        ← חזרה לבחירה
                      </button>
                      <div className="bg-white rounded-xl p-3 text-center border border-cream-300">
                        <p className="text-xs text-warm-gray mb-1">שלחי ביט / פייבוקס למספר</p>
                        <p className="font-frank text-2xl font-semibold text-charcoal tracking-wider">{whatsappNumber.replace('972', '0')}</p>
                        <p className="text-xs text-warm-gray mt-1">סכום לתשלום: <span className="font-bold text-charcoal text-sm">₪{product.discount > 0 ? Math.round(product.priceDelivery * (1 - product.discount / 100)) : product.priceDelivery}</span> (כולל משלוח)</p>
                      </div>
                      <p className="text-xs text-warm-gray text-center">לאחר התשלום — מלאי את הפרטים לביצוע ההזמנה</p>
                      <div className="flex gap-2">
                        <input required placeholder="שם פרטי" value={formData.firstName} onChange={e => setFormData(p => ({ ...p, firstName: e.target.value }))} className="flex-1 min-w-0 bg-white border border-cream-300 rounded-xl px-3 py-2.5 text-sm text-charcoal placeholder-warm-gray focus:outline-none focus:border-taupe-400" dir="rtl" />
                        <input required placeholder="שם משפחה" value={formData.lastName} onChange={e => setFormData(p => ({ ...p, lastName: e.target.value }))} className="flex-1 min-w-0 bg-white border border-cream-300 rounded-xl px-3 py-2.5 text-sm text-charcoal placeholder-warm-gray focus:outline-none focus:border-taupe-400" dir="rtl" />
                      </div>
                      <textarea required placeholder="כתובת מלאה (רחוב, מספר, עיר, מיקוד)" value={formData.address} onChange={e => setFormData(p => ({ ...p, address: e.target.value }))} rows={2} className="w-full bg-white border border-cream-300 rounded-xl px-3 py-2.5 text-sm text-charcoal placeholder-warm-gray focus:outline-none focus:border-taupe-400 resize-none" />
                      <input required placeholder="אסמכתא לתשלום – מספר אישור בן 13 ספרות" value={formData.paymentRef} onChange={e => setFormData(p => ({ ...p, paymentRef: e.target.value }))} className="w-full bg-white border border-cream-300 rounded-xl px-3 py-2.5 text-sm text-charcoal placeholder-warm-gray focus:outline-none focus:border-taupe-400" />
                      {sendError && <p className="text-xs text-red-500 text-center">שגיאה: {sendError}</p>}
                      <button type="submit" disabled={sending} className="flex items-center justify-center gap-2 w-full py-3 rounded-full bg-charcoal text-cream-100 text-sm font-medium hover:bg-taupe-600 transition-colors disabled:opacity-60">
                        <Send className="w-4 h-4" />
                        {sending ? 'שולחת...' : 'שלחי הזמנה'}
                      </button>
                    </form>
                  )}

                  {sent && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center animate-fade-in">
                      <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <p className="text-sm font-medium text-charcoal">ההזמנה נשלחה!</p>
                      <p className="text-xs text-warm-gray mt-1">אחזור אליך בהקדם</p>
                    </div>
                  )}

                  {/* Pickup form */}
                  {showPickupForm && !pickupSent && (
                    <form ref={pickupFormRef} onSubmit={handlePickupSubmit} className="space-y-3 animate-fade-in">
                      <button type="button" onClick={() => setShowPickupForm(false)} className="text-xs text-warm-gray hover:text-charcoal flex items-center gap-1">
                        ← חזרה לבחירה
                      </button>
                      <div className="bg-white rounded-xl p-3 text-center border border-cream-300">
                        <p className="text-xs text-warm-gray mb-1">שלחי ביט / פייבוקס למספר</p>
                        <p className="font-frank text-2xl font-semibold text-charcoal tracking-wider">{whatsappNumber.replace('972', '0')}</p>
                        <p className="text-xs text-warm-gray mt-1">סכום לתשלום: <span className="font-bold text-charcoal text-sm">₪{product.discount > 0 ? Math.round(product.pricePickup * (1 - product.discount / 100)) : product.pricePickup}</span> (איסוף עצמי)</p>
                      </div>
                      <p className="text-xs text-warm-gray text-center">לאחר התשלום — מלאי את הפרטים ושלחי הזמנה. האיסוף יתואם ב-WhatsApp</p>
                      <div className="flex gap-2">
                        <input required placeholder="שם פרטי" value={pickupData.firstName} onChange={e => setPickupData(p => ({ ...p, firstName: e.target.value }))} className="flex-1 min-w-0 bg-white border border-cream-300 rounded-xl px-3 py-2.5 text-sm text-charcoal placeholder-warm-gray focus:outline-none focus:border-taupe-400" dir="rtl" />
                        <input required placeholder="שם משפחה" value={pickupData.lastName} onChange={e => setPickupData(p => ({ ...p, lastName: e.target.value }))} className="flex-1 min-w-0 bg-white border border-cream-300 rounded-xl px-3 py-2.5 text-sm text-charcoal placeholder-warm-gray focus:outline-none focus:border-taupe-400" dir="rtl" />
                      </div>
                      <input required placeholder="אסמכתא לתשלום – מספר אישור בן 13 ספרות" value={pickupData.paymentRef} onChange={e => setPickupData(p => ({ ...p, paymentRef: e.target.value }))} className="w-full bg-white border border-cream-300 rounded-xl px-3 py-2.5 text-sm text-charcoal placeholder-warm-gray focus:outline-none focus:border-taupe-400" />
                      {pickupError && <p className="text-xs text-red-500 text-center">שגיאה: {pickupError}</p>}
                      <button type="submit" disabled={pickupSending} className="flex items-center justify-center gap-2 w-full py-3 rounded-full bg-charcoal text-cream-100 text-sm font-medium hover:bg-taupe-600 transition-colors disabled:opacity-60">
                        <Send className="w-4 h-4" />
                        {pickupSending ? 'שולחת...' : 'שלחי הזמנה'}
                      </button>
                    </form>
                  )}

                  {pickupSent && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center animate-fade-in">
                      <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <p className="text-sm font-medium text-charcoal">ההזמנה נשלחה!</p>
                      <p className="text-xs text-warm-gray mt-1">אחזור אליך בהקדם לתיאום</p>
                    </div>
                  )}

                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
