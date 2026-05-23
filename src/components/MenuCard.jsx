import { useState, useRef } from 'react'
import { useCart } from '../utils/CartContext'
import { useToast } from './Toast'

const VEG_ICON = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <rect x="1" y="1" width="14" height="14" rx="2" stroke="#228B22" strokeWidth="1.5" />
    <circle cx="8" cy="8" r="4" fill="#228B22" />
  </svg>
)

const NON_VEG_ICON = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <rect x="1" y="1" width="14" height="14" rx="2" stroke="#C82828" strokeWidth="1.5" />
    <path d="M8 4l4 8H4z" fill="#C82828" />
  </svg>
)

const StarIcon = () => (
  <svg width="11" height="11" viewBox="0 0 12 12" fill="#1A1A1A">
    <path d="M6 1l1.5 3L11 4.5l-2.5 2.5.5 3.5L6 9 3 10.5l.5-3.5L1 4.5 4.5 4z" />
  </svg>
)

export default function MenuCard({ item }) {
  const { cartItems, addToCart, removeFromCart } = useCart()
  const addToast = useToast()
  const [imgError, setImgError] = useState(false)
  const [addPulse, setAddPulse] = useState(false)
  const btnRef = useRef(null)

  const qty = cartItems.find((c) => c.id === item.id)?.quantity || 0
  const inCart = qty > 0

  const placeholderBg = [
    'linear-gradient(145deg, #FDECD8 0%, #F7B731 100%)',
    'linear-gradient(145deg, #FFE8D6 0%, #E65C00 100%)',
    'linear-gradient(145deg, #FFF3E0 0%, #FF9800 100%)',
    'linear-gradient(145deg, #FCE4EC 0%, #E91E63 100%)',
  ]
  const bgIdx = item.name ? item.name.charCodeAt(0) % placeholderBg.length : 0

  const handleAdd = (e) => {
    e.stopPropagation()
    addToCart(item)
    setAddPulse(true)
    setTimeout(() => setAddPulse(false), 400)
    if (qty === 0) {
      addToast({ type: 'cart', message: `${item.name} added`, duration: 1600 })
    }
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect()
      const ripple = document.createElement('span')
      ripple.className = 'ripple-effect'
      const size = Math.max(rect.width, rect.height)
      ripple.style.cssText = `width:${size}px;height:${size}px;left:50%;top:50%;transform:translate(-50%,-50%);`
      btnRef.current.appendChild(ripple)
      setTimeout(() => ripple.remove(), 700)
    }
  }

  const handleRemove = (e) => {
    e.stopPropagation()
    removeFromCart(item.id)
  }

  return (
    <article className={`food-card group ${inCart ? 'in-cart' : ''}`}>
      <div className="food-card-image-wrap relative overflow-hidden" style={{ height: 148 }}>
        {item.image && !imgError ? (
          <img
            src={item.image}
            alt={item.name}
            onError={() => setImgError(true)}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center"
            style={{ background: placeholderBg[bgIdx] }}
          >
            <span className="font-display text-4xl font-bold text-white/40">
              {item.name?.charAt(0) || '?'}
            </span>
          </div>
        )}

        <div className="absolute left-2.5 top-2.5 z-10 rounded-lg bg-white/95 p-1 shadow-md backdrop-blur-sm">
          {item.isVeg ? <VEG_ICON /> : <NON_VEG_ICON />}
        </div>

        {item.isBestSeller && (
          <div className="absolute right-2.5 top-2.5 z-10">
            <span className="flex items-center gap-1 rounded-full bg-[#F7B731] px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-[#1A1A1A] shadow-lg">
              <StarIcon /> Best
            </span>
          </div>
        )}

        {inCart && (
          <div className="absolute bottom-2.5 left-2.5 z-10 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold text-[#E65C00] shadow-md">
            {qty} in cart
          </div>
        )}

        {!item.available && item.available !== undefined && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/55 backdrop-blur-[2px]">
            <span className="rounded-full bg-black/70 px-4 py-1.5 text-xs font-semibold text-white">
              Unavailable
            </span>
          </div>
        )}
      </div>

      <div className="p-3.5">
        <h3 className="font-display line-clamp-1 text-[15px] font-bold leading-tight text-[#1A1A1A]">
          {item.name}
        </h3>
        {item.description && (
          <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-[#8B7355]">
            {item.description}
          </p>
        )}

        <div className="mt-3 flex items-center justify-between gap-2">
          <div>
            <span className="text-lg font-bold text-[#E65C00]">₹{item.price}</span>
            {item.originalPrice > item.price && (
              <span className="ml-1.5 text-xs text-[#8B7355] line-through">
                ₹{item.originalPrice}
              </span>
            )}
          </div>

          {item.available !== false && (
            <div className="flex-shrink-0">
              {qty === 0 ? (
                <button
                  ref={btnRef}
                  type="button"
                  onClick={handleAdd}
                  className={`ripple-container qty-btn qty-btn-add ${addPulse ? 'scale-110' : ''}`}
                  style={{
                    width: 40,
                    height: 40,
                    transition: 'transform 0.25s cubic-bezier(0.34,1.2,0.64,1)',
                  }}
                  aria-label={`Add ${item.name}`}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 5v10M5 10h10" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </button>
              ) : (
                <div className="flex items-center gap-1.5 rounded-full border border-[rgba(230,92,0,0.2)] bg-[#FFF8F0] p-1">
                  <button
                    type="button"
                    onClick={handleRemove}
                    className="qty-btn qty-btn-remove"
                    style={{ width: 34, height: 34 }}
                    aria-label="Decrease"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M4 8h8" stroke="#E65C00" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                  </button>
                  <span
                    className={`min-w-[20px] text-center text-sm font-bold text-[#E65C00] transition-transform ${addPulse ? 'scale-125' : ''}`}
                  >
                    {qty}
                  </span>
                  <button
                    ref={btnRef}
                    type="button"
                    onClick={handleAdd}
                    className="ripple-container qty-btn qty-btn-add"
                    style={{ width: 34, height: 34 }}
                    aria-label="Increase"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 4v8M4 8h8" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
