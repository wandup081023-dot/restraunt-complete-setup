import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useCart } from '../utils/CartContext'
import { useSettings } from '../utils/SettingsContext'
import { placeOrder } from '../utils/orderSubmit'
import { formatPrice } from '../utils/format'
import { getOrderPricing } from '../utils/pricing'
import OrderConfirmation from './OrderConfirmation'
import LoadingSpinner from './LoadingSpinner'

export default function CartDrawer({ isOpen, onClose }) {
  const [searchParams] = useSearchParams()
  const tableNumber = searchParams.get('table') || '1'
  const tableLabel = `Table ${tableNumber}`

  const { settings } = useSettings()
  const { cartItems, cartTotal, cartCount, clearCart } = useCart()
  const currencySymbol = settings?.currencySymbol || '₹'

  const pricing = useMemo(
    () => getOrderPricing(cartTotal, settings),
    [cartTotal, settings],
  )

  const [customerName, setCustomerName] = useState('')
  const [specialInstructions, setSpecialInstructions] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [placedSnapshot, setPlacedSnapshot] = useState(null)
  const [error, setError] = useState('')

  const nameValid = customerName.trim().length >= 2

  if (!isOpen && !showConfirmation) return null

  const handlePlaceOrder = async () => {
    if (cartCount === 0 || orderPlaced) return
    if (!nameValid) {
      setError('Please enter your name to place the order.')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      await placeOrder({
        settings,
        tableLabel,
        customerName: customerName.trim(),
        cartItems,
        subtotal: pricing.subtotal,
        total: pricing.total,
        discountAmount: pricing.discountAmount,
        discountPercent: pricing.discountPercent,
        offerTitle: pricing.offerTitle,
        specialInstructions,
      })

      setPlacedSnapshot({
        tableNumber,
        customerName: customerName.trim(),
        cartItems: [...cartItems],
        pricing: { ...pricing },
      })
      setOrderPlaced(true)
      setShowConfirmation(true)
      onClose()
    } catch {
      setError('Could not save your order. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNewOrder = () => {
    clearCart()
    setCustomerName('')
    setSpecialInstructions('')
    setOrderPlaced(false)
    setShowConfirmation(false)
    setPlacedSnapshot(null)
    setError('')
  }

  if (showConfirmation && placedSnapshot) {
    return (
      <OrderConfirmation
        tableNumber={placedSnapshot.tableNumber}
        customerName={placedSnapshot.customerName}
        cartItems={placedSnapshot.cartItems}
        pricing={placedSnapshot.pricing}
        currencySymbol={currencySymbol}
        onDone={handleNewOrder}
      />
    )
  }

  if (!isOpen) return null

  return (
    <>
      <div className="cart-drawer-overlay" onClick={onClose} aria-hidden="true" />

      <div className="cart-drawer">
        <div className="cart-drawer-handle" />

        <div className="flex items-center justify-between border-b border-[rgba(201,168,76,0.12)] px-5 pb-4 pt-2">
          <div>
            <h2 className="font-display text-3xl font-semibold text-[var(--text-primary)]">Your Cart</h2>
            <p className="mt-1 flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-[rgba(245,240,232,0.5)]">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
              {tableLabel} · {cartCount} {cartCount === 1 ? 'item' : 'items'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(201,168,76,0.14)] bg-[rgba(255,255,255,0.02)] text-2xl text-[var(--text-primary)] transition-colors hover:bg-[rgba(201,168,76,0.08)]"
            aria-label="Close cart"
          >
            ×
          </button>
        </div>

        {pricing.offerActive && pricing.discountPercent > 0 && (
          <div className="mx-5 mb-3 rounded-[22px] border border-[rgba(201,168,76,0.16)] bg-[rgba(201,168,76,0.06)] px-4 py-3">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
              {pricing.offerTitle} — {pricing.discountPercent}% OFF
            </p>
            {pricing.hasDiscount && (
              <p className="mt-2 text-xs text-[rgba(245,240,232,0.68)]">
                You save {formatPrice(pricing.discountAmount, currencySymbol)} on this order
              </p>
            )}
          </div>
        )}

        <div className="max-h-[42dvh] space-y-3 overflow-y-auto px-5 py-3">
          {cartItems.length === 0 ? (
            <div className="py-16 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-[rgba(201,168,76,0.18)] bg-[rgba(201,168,76,0.06)] text-[var(--gold-light)]">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 4h16l-1.5 10.5a2 2 0 01-2 1.5H7.5a2 2 0 01-2-1.5L4 4z" />
                </svg>
              </div>
              <p className="text-[rgba(245,240,232,0.6)]">Your cart is empty</p>
            </div>
          ) : (
            cartItems.map((item, i) => (
              <div
                key={item.id}
                className="cart-line-item"
                style={{ animation: `fadeUp 0.35s ease ${i * 50}ms both` }}
              >
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-[rgba(201,168,76,0.14)] bg-[rgba(255,255,255,0.03)] font-display text-lg font-semibold text-[var(--gold-light)]">
                  {item.name?.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[var(--text-primary)]">
                    {item.quantity}× {item.name}
                  </p>
                  <p className="text-xs text-[rgba(245,240,232,0.58)]">
                    {formatPrice(item.price, currencySymbol)} each
                  </p>
                </div>
                <p className="font-display text-lg font-semibold text-[var(--accent)]">
                  {formatPrice(item.price * item.quantity, currencySymbol)}
                </p>
              </div>
            ))
          )}
        </div>

        <div className="cart-checkout-panel px-5 pb-[max(20px,env(safe-area-inset-bottom))] pt-4">
          <div className="mb-4 space-y-2 rounded-[22px] border border-[rgba(201,168,76,0.14)] bg-[rgba(255,255,255,0.02)] p-4">
            <div className="flex justify-between text-sm text-[rgba(245,240,232,0.68)]">
              <span>Subtotal</span>
              <span>{formatPrice(pricing.subtotal, currencySymbol)}</span>
            </div>
            {pricing.hasDiscount && (
              <div className="flex justify-between rounded-xl border border-[rgba(201,168,76,0.14)] bg-[rgba(201,168,76,0.06)] px-3 py-2 text-sm text-[var(--gold-light)]">
                <span>Discount ({pricing.discountPercent}%)</span>
                <span>−{formatPrice(pricing.discountAmount, currencySymbol)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-[rgba(201,168,76,0.14)] pt-3 text-lg">
              <span className="font-medium text-[var(--text-primary)]">Total</span>
              <span className="font-display text-2xl font-semibold text-[var(--accent)]">
                {formatPrice(pricing.total, currencySymbol)}
              </span>
            </div>
          </div>

          <label className="mb-3 block">
            <span className="mb-2 block text-[10px] uppercase tracking-[0.26em] text-[rgba(245,240,232,0.5)]">
              Your name <span className="text-red-500">*</span>
            </span>
            <input
              type="text"
              value={customerName}
              onChange={(e) => {
                setCustomerName(e.target.value)
                if (error) setError('')
              }}
              placeholder="Enter your name"
              className="input-field"
              aria-invalid={!nameValid && customerName.length > 0}
            />
            {!nameValid && (
              <p className="mt-1 text-[10px] text-[rgba(29,35,48,0.48)]">Required — at least 2 characters</p>
            )}
          </label>

          <label className="mb-4 block">
            <span className="mb-2 block text-[10px] uppercase tracking-[0.26em] text-[rgba(245,240,232,0.5)]">
              Special instructions
            </span>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="Less spicy, extra napkins..."
              rows={2}
              className="input-field resize-none"
            />
          </label>

          {error && (
            <p className="mb-3 rounded-xl border border-[rgba(220,80,80,0.22)] bg-[rgba(220,80,80,0.1)] px-3 py-2 text-center text-sm text-[rgba(245,240,232,0.92)]">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={handlePlaceOrder}
            disabled={cartItems.length === 0 || isSubmitting || !nameValid}
            className="btn-primary w-full disabled:opacity-50"
            style={{ borderRadius: 18, minHeight: 56, fontSize: 16 }}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <LoadingSpinner fullScreen={false} />
                PLACING YOUR ORDER
              </span>
            ) : (
              <>PLACE ORDER · {formatPrice(pricing.total, currencySymbol)}</>
            )}
          </button>
        </div>
      </div>
    </>
  )
}
