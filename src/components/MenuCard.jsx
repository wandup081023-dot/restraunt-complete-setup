import { useEffect, useRef, useState } from 'react'
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
  <svg width="11" height="11" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
    <path d="M6 1l1.5 3L11 4.5l-2.5 2.5.5 3.5L6 9 3 10.5l.5-3.5L1 4.5 4.5 4z" />
  </svg>
)

export default function MenuCard({ item }) {
  const { cartItems, addToCart, removeFromCart } = useCart()
  const addToast = useToast()
  const [imgError, setImgError] = useState(false)
  const [addPulse, setAddPulse] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const btnRef = useRef(null)
  const cardRef = useRef(null)

  const qty = cartItems.find((c) => c.id === item.id)?.quantity || 0
  const inCart = qty > 0

  useEffect(() => {
    const node = cardRef.current
    if (!node || typeof IntersectionObserver === 'undefined') {
      setIsVisible(true)
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.18 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const placeholderBg = [
    'linear-gradient(145deg, rgba(201,168,76,0.24) 0%, rgba(20,20,20,0.92) 100%)',
    'linear-gradient(145deg, rgba(232,213,163,0.18) 0%, rgba(20,20,20,0.95) 100%)',
    'linear-gradient(145deg, rgba(201,168,76,0.14) 0%, rgba(9,9,9,0.96) 100%)',
    'linear-gradient(145deg, rgba(245,240,232,0.08) 0%, rgba(20,20,20,0.96) 100%)',
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
    <article
      ref={cardRef}
      className={`food-card group overflow-hidden rounded-[24px] ${inCart ? 'in-cart' : ''} ${isVisible ? 'opacity-100' : 'translate-y-3 opacity-0'}`}
      style={{ transition: 'opacity 0.7s ease, transform 0.7s ease, border-color 0.3s ease, box-shadow 0.3s ease' }}
    >
      <div className="food-card-image-wrap relative overflow-hidden" style={{ aspectRatio: '16 / 10' }}>
        {item.image && !imgError ? (
          <img
            src={item.image}
            alt={item.name}
            onError={() => setImgError(true)}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            loading="lazy"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center"
            style={{ background: placeholderBg[bgIdx] }}
          >
            <span className="font-display text-5xl font-bold text-[rgba(245,240,232,0.18)]">
              {item.name?.charAt(0) || '?'}
            </span>
          </div>
        )}

        <div className="absolute left-3 top-3 z-10 rounded-full border border-[rgba(201,168,76,0.16)] bg-[rgba(10,10,10,0.72)] p-1.5 backdrop-blur-md shadow-sm">
          {item.isVeg ? <VEG_ICON /> : <NON_VEG_ICON />}
        </div>

        {item.isBestSeller && (
          <div className="absolute right-3 top-3 z-10">
            <span className="flex items-center gap-1 rounded-full border border-[rgba(201,168,76,0.2)] bg-[rgba(201,168,76,0.12)] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.22em] text-[var(--gold-light)] shadow-lg">
              <StarIcon /> Best
            </span>
          </div>
        )}

        {inCart && (
          <div className="absolute bottom-3 left-3 z-10 rounded-full border border-[rgba(201,168,76,0.16)] bg-[rgba(10,10,10,0.82)] px-2.5 py-1 text-[10px] font-bold text-[var(--gold-light)] shadow-md backdrop-blur-md">
            {qty} in cart
          </div>
        )}

        {!item.available && item.available !== undefined && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-[rgba(10,10,10,0.68)] backdrop-blur-[2px]">
            <span className="rounded-full border border-[rgba(201,168,76,0.16)] bg-[rgba(10,10,10,0.92)] px-4 py-1.5 text-xs font-semibold tracking-[0.2em] text-[var(--gold-light)] uppercase">
              Unavailable
            </span>
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 z-[1] p-4">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[rgba(245,240,232,0.46)]">
            {item.category || 'Chef Choice'}
          </p>
          <h3 className="mt-1 line-clamp-1 font-display text-[22px] font-semibold leading-none text-[var(--text-primary)]">
            {item.name}
          </h3>
        </div>
      </div>

      <div className="space-y-4 p-4">
        {item.description && (
          <p className="line-clamp-2 text-[12px] leading-6 text-[rgba(245,240,232,0.66)]">
            {item.description}
          </p>
        )}

        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="font-display text-2xl font-semibold text-[var(--gold-light)]">₹{item.price}</span>
            {item.originalPrice > item.price && (
              <span className="ml-2 text-xs text-[rgba(245,240,232,0.45)] line-through">
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
                  className={`ripple-container flex h-11 items-center justify-center rounded-full border px-5 text-[11px] uppercase tracking-[0.24em] transition-all duration-300 ${addPulse ? 'scale-[1.02]' : ''}`}
                  style={{
                    minWidth: 92,
                    borderColor: addPulse ? 'rgba(201,168,76,0.52)' : 'rgba(201,168,76,0.32)',
                    background: addPulse ? 'rgba(201,168,76,0.1)' : 'transparent',
                    color: 'var(--gold-light)',
                    boxShadow: addPulse ? '0 0 0 1px rgba(201,168,76,0.14), 0 14px 28px rgba(0,0,0,0.24)' : 'none',
                  }}
                  aria-label={`Add ${item.name}`}
                >
                  ADD
                </button>
              ) : (
                <div className="flex items-center gap-2 rounded-full border border-[rgba(201,168,76,0.16)] bg-[rgba(10,10,10,0.8)] p-1 backdrop-blur-md shadow-sm">
                  <button
                    type="button"
                    onClick={handleRemove}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(201,168,76,0.16)] text-[var(--gold-light)]"
                    aria-label="Decrease"
                  >
                    <span className="text-lg leading-none">−</span>
                  </button>
                  <span
                    className={`min-w-[22px] text-center font-display text-lg font-semibold text-[var(--gold-light)] transition-transform ${addPulse ? 'scale-110' : ''}`}
                  >
                    {qty}
                  </span>
                  <button
                    ref={btnRef}
                    type="button"
                    onClick={handleAdd}
                    className="ripple-container flex h-9 w-9 items-center justify-center rounded-full bg-[var(--gold)] text-[#111111]"
                    aria-label="Increase"
                  >
                    <span className="text-lg leading-none">+</span>
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
