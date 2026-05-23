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

        <div className="flex items-center justify-between border-b border-[rgba(230,92,0,0.08)] px-5 pb-4 pt-1">
          <div>
            <h2 className="font-display text-2xl font-bold text-[#1A1A1A]">Your Cart</h2>
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-[#8B7355]">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500" />
              {tableLabel} · {cartCount} {cartCount === 1 ? 'item' : 'items'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-[rgba(26,26,26,0.06)] text-xl text-[#1A1A1A] transition-colors hover:bg-[rgba(230,92,0,0.1)]"
            aria-label="Close cart"
          >
            ×
          </button>
        </div>

        {pricing.offerActive && pricing.discountPercent > 0 && (
          <div className="mx-5 mb-3 rounded-2xl border border-[rgba(247,183,49,0.35)] bg-gradient-to-r from-[rgba(230,92,0,0.08)] to-[rgba(247,183,49,0.12)] px-4 py-3">
            <p className="text-sm font-bold text-[#E65C00]">
              🎉 {pricing.offerTitle} — {pricing.discountPercent}% OFF
            </p>
            {pricing.hasDiscount && (
              <p className="mt-1 text-xs font-semibold text-green-700">
                You save {formatPrice(pricing.discountAmount, currencySymbol)} on this order
              </p>
            )}
          </div>
        )}

        <div className="max-h-[42dvh] space-y-2.5 overflow-y-auto px-5 py-2">
          {cartItems.length === 0 ? (
            <div className="py-14 text-center">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(230,92,0,0.08)]">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#E65C00" strokeWidth="1.5">
                  <path d="M4 4h16l-1.5 10.5a2 2 0 01-2 1.5H7.5a2 2 0 01-2-1.5L4 4z" />
                </svg>
              </div>
              <p className="text-[#8B7355]">Your cart is empty</p>
            </div>
          ) : (
            cartItems.map((item, i) => (
              <div
                key={item.id}
                className="cart-line-item"
                style={{ animation: `fadeUp 0.35s ease ${i * 50}ms both` }}
              >
                <div
                  className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl font-display text-lg font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #E65C00, #F7B731)' }}
                >
                  {item.name?.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-[#1A1A1A]">
                    {item.quantity}× {item.name}
                  </p>
                  <p className="text-xs text-[#8B7355]">
                    {formatPrice(item.price, currencySymbol)} each
                  </p>
                </div>
                <p className="font-bold text-[#E65C00]">
                  {formatPrice(item.price * item.quantity, currencySymbol)}
                </p>
              </div>
            ))
          )}
        </div>

        <div className="cart-checkout-panel">
          <div className="mb-3 space-y-2 rounded-2xl bg-white/80 p-4">
            <div className="flex justify-between text-sm text-[#5A4A3A]">
              <span>Subtotal</span>
              <span>{formatPrice(pricing.subtotal, currencySymbol)}</span>
            </div>
            {pricing.hasDiscount && (
              <div className="flex justify-between rounded-xl bg-green-50 px-3 py-2 text-sm font-semibold text-green-800">
                <span>Discount ({pricing.discountPercent}%)</span>
                <span>−{formatPrice(pricing.discountAmount, currencySymbol)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-[rgba(230,92,0,0.1)] pt-2 text-lg font-bold">
              <span>Total</span>
              <span className="text-gradient-saffron text-xl font-bold" style={{ WebkitTextFillColor: '#E65C00' }}>
                {formatPrice(pricing.total, currencySymbol)}
              </span>
            </div>
          </div>

          <label className="mb-3 block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#8B7355]">
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
              <p className="mt-1 text-[10px] text-[#8B7355]">Required — at least 2 characters</p>
            )}
          </label>

          <label className="mb-4 block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#8B7355]">
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
            <p className="mb-3 rounded-xl bg-red-50 px-3 py-2 text-center text-sm text-red-600">
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
                Placing your order...
              </span>
            ) : (
              <>Place Order · {formatPrice(pricing.total, currencySymbol)}</>
            )}
          </button>
        </div>
      </div>
    </>
  )
}
