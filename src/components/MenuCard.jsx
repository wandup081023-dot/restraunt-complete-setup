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

const TrashIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
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
      { threshold: 0.1 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const placeholderColors = [
    'rgba(201,168,76,0.15)',
    'rgba(232,213,163,0.12)',
    'rgba(201,168,76,0.1)',
    'rgba(245,240,232,0.06)',
  ]
  const bgIdx = item.name ? item.name.charCodeAt(0) % placeholderColors.length : 0

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

  // Remove all qty of this item
  const handleRemoveAll = (e) => {
    e.stopPropagation()
    for (let i = 0; i < qty; i++) removeFromCart(item.id)
  }

  return (
    <article
      ref={cardRef}
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(28,28,28,0.98)',
        borderRadius: '20px',
        border: inCart ? '1px solid rgba(201,168,76,0.35)' : '1px solid rgba(201,168,76,0.08)',
        overflow: 'hidden',
        boxShadow: inCart
          ? '0 8px 28px rgba(0,0,0,0.35), 0 0 0 1px rgba(201,168,76,0.1)'
          : '0 8px 28px rgba(0,0,0,0.28)',
        transition: 'opacity 0.5s ease, transform 0.5s ease, border-color 0.3s ease, box-shadow 0.3s ease',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(12px)',
        cursor: 'default',
        width: '100%',
      }}
      className="food-card-article"
    >
      {/* ── IMAGE SECTION ── */}
      <div style={{
        position: 'relative',
        width: '100%',
        paddingTop: '62.5%', /* 16:10 ratio */
        overflow: 'hidden',
        flexShrink: 0,
      }}>
        {/* Actual image or placeholder */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: placeholderColors[bgIdx],
        }}>
          {item.image && !imgError ? (
            <img
              src={item.image}
              alt={item.name}
              onError={() => setImgError(true)}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.6s ease',
                display: 'block',
              }}
              loading="lazy"
            />
          ) : (
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: `linear-gradient(145deg, ${placeholderColors[bgIdx]}, rgba(10,10,10,0.9))`,
            }}>
              <span style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '4rem',
                fontWeight: 700,
                color: 'rgba(201,168,76,0.25)',
              }}>
                {item.name?.charAt(0) || '?'}
              </span>
            </div>
          )}
        </div>

        {/* Dark gradient overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, transparent 20%, rgba(10,10,10,0.15) 55%, rgba(10,10,10,0.88) 100%)',
          pointerEvents: 'none',
          zIndex: 1,
        }} />

        {/* Veg/Non-veg badge */}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          zIndex: 2,
          background: 'rgba(10,10,10,0.72)',
          borderRadius: '50%',
          padding: '6px',
          border: '1px solid rgba(201,168,76,0.16)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {item.isVeg ? <VEG_ICON /> : <NON_VEG_ICON />}
        </div>

        {/* Best seller badge */}
        {item.isBestSeller && (
          <div style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            zIndex: 2,
          }}>
            <span style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: 'rgba(201,168,76,0.12)',
              border: '1px solid rgba(201,168,76,0.2)',
              borderRadius: '9999px',
              padding: '4px 10px',
              fontSize: '9px',
              fontWeight: 700,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#E8D5A3',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            }}>
              <StarIcon /> Best
            </span>
          </div>
        )}

        {/* In cart badge */}
        {inCart && (
          <div style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            zIndex: 2,
            background: 'rgba(10,10,10,0.82)',
            border: '1px solid rgba(201,168,76,0.16)',
            borderRadius: '9999px',
            padding: '3px 10px',
            fontSize: '10px',
            fontWeight: 700,
            color: '#E8D5A3',
            backdropFilter: 'blur(8px)',
          }}>
            {qty} in cart
          </div>
        )}

        {/* Unavailable overlay */}
        {item.available === false && (
          <div style={{
            position: 'absolute',
            inset: 0,
            zIndex: 3,
            background: 'rgba(10,10,10,0.68)',
            backdropFilter: 'blur(2px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <span style={{
              background: 'rgba(10,10,10,0.92)',
              border: '1px solid rgba(201,168,76,0.16)',
              borderRadius: '9999px',
              padding: '6px 18px',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#E8D5A3',
            }}>
              Unavailable
            </span>
          </div>
        )}

        {/* Item name + category overlaid on image */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 2,
          padding: '16px',
        }}>
          <p style={{
            fontSize: '10px',
            textTransform: 'uppercase',
            letterSpacing: '0.3em',
            color: 'rgba(245,240,232,0.46)',
            margin: '0 0 4px',
          }}>
            {item.category || 'Chef Choice'}
          </p>
          <h3 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '22px',
            fontWeight: 600,
            lineHeight: 1.1,
            color: '#F5F0E8',
            margin: 0,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
          }}>
            {item.name}
          </h3>
        </div>
      </div>

      {/* ── CONTENT SECTION ── */}
      <div style={{
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        flex: 1,
      }}>
        {/* Description */}
        {item.description && (
          <p style={{
            fontSize: '12px',
            lineHeight: 1.6,
            color: 'rgba(245,240,232,0.58)',
            margin: 0,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}>
            {item.description}
          </p>
        )}

        {/* Price + Add button */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          marginTop: 'auto',
        }}>
          {/* Price */}
          <div style={{ minWidth: 0 }}>
            <span style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.5rem',
              fontWeight: 600,
              color: '#E8D5A3',
            }}>
              ₹{item.price}
            </span>
            {item.originalPrice > item.price && (
              <span style={{
                marginLeft: '8px',
                fontSize: '12px',
                color: 'rgba(245,240,232,0.4)',
                textDecoration: 'line-through',
              }}>
                ₹{item.originalPrice}
              </span>
            )}
          </div>

          {/* Add / Qty controls */}
          {item.available !== false && (
            <div style={{ flexShrink: 0 }}>
              {qty === 0 ? (
                <button
                  ref={btnRef}
                  type="button"
                  onClick={handleAdd}
                  className="ripple-container"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '40px',
                    minWidth: '80px',
                    padding: '0 20px',
                    borderRadius: '9999px',
                    border: `1px solid ${addPulse ? 'rgba(201,168,76,0.6)' : 'rgba(201,168,76,0.32)'}`,
                    background: addPulse ? 'rgba(201,168,76,0.12)' : 'transparent',
                    color: '#E8D5A3',
                    fontSize: '11px',
                    fontFamily: "'Jost', sans-serif",
                    letterSpacing: '0.24em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    transform: addPulse ? 'scale(1.02)' : 'scale(1)',
                  }}
                  aria-label={`Add ${item.name}`}
                >
                  ADD
                </button>
              ) : (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}>
                  {/* Qty stepper */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0',
                    borderRadius: '9999px',
                    border: '1px solid rgba(201,168,76,0.18)',
                    background: 'rgba(10,10,10,0.8)',
                    padding: '2px',
                    height: '36px',
                  }}>
                    <button
                      type="button"
                      onClick={handleRemove}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        border: 'none',
                        background: 'transparent',
                        color: '#E8D5A3',
                        fontSize: '18px',
                        lineHeight: 1,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'background 0.2s',
                      }}
                      aria-label="Decrease"
                    >−</button>
                    <span style={{
                      minWidth: '22px',
                      textAlign: 'center',
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: '16px',
                      fontWeight: 600,
                      color: '#E8D5A3',
                      transform: addPulse ? 'scale(1.15)' : 'scale(1)',
                      transition: 'transform 0.2s',
                    }}>
                      {qty}
                    </span>
                    <button
                      ref={btnRef}
                      type="button"
                      onClick={handleAdd}
                      className="ripple-container"
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        border: 'none',
                        background: '#C9A84C',
                        color: '#111111',
                        fontSize: '18px',
                        lineHeight: 1,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      aria-label="Increase"
                    >+</button>
                  </div>

                  {/* Trash button */}
                  <button
                    type="button"
                    onClick={handleRemoveAll}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      border: '1px solid rgba(220,80,80,0.2)',
                      background: 'transparent',
                      color: 'rgba(220,80,80,0.7)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'background 0.2s',
                      flexShrink: 0,
                    }}
                    aria-label={`Remove ${item.name}`}
                  >
                    <TrashIcon />
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