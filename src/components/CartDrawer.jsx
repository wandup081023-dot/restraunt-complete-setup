import LoadingSpinner from './LoadingSpinner'
import { formatPrice } from '../utils/format'

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  menuItems,
  currencySymbol,
  customerName,
  setCustomerName,
  specialInstructions,
  setSpecialInstructions,
  subtotal,
  itemCount,
  onPlaceOrder,
  isSubmitting,
  orderPlaced,
}) {
  if (!isOpen) return null

  const cartLines = cart
    .map(({ id, quantity }) => {
      const item = menuItems.find((m) => m.id === id)
      if (!item) return null
      return { ...item, quantity, lineTotal: item.price * quantity }
    })
    .filter(Boolean)

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-charcoal/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="animate-slide-up fixed inset-x-0 bottom-0 z-50 max-h-[90dvh] overflow-hidden rounded-t-3xl bg-white shadow-2xl">
        <div className="flex justify-center pt-3 pb-2">
          <div className="h-1.5 w-12 rounded-full bg-charcoal/20" />
        </div>
        <div className="flex items-center justify-between border-b border-charcoal/10 px-5 pb-4">
          <h2 className="font-heading text-2xl font-bold text-charcoal">Your Cart</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-cream text-xl text-charcoal"
            aria-label="Close cart"
          >
            ×
          </button>
        </div>

        <div className="max-h-[50dvh] overflow-y-auto px-5 py-4">
          {cartLines.length === 0 ? (
            <p className="py-8 text-center text-charcoal/60">Your cart is empty</p>
          ) : (
            <ul className="space-y-4">
              {cartLines.map((line) => (
                <li key={line.id} className="flex justify-between gap-3">
                  <div>
                    <p className="font-medium text-charcoal">
                      {line.quantity}× {line.name}
                    </p>
                    <p className="text-sm text-charcoal/60">
                      {formatPrice(line.price, currencySymbol)} each
                    </p>
                  </div>
                  <p className="font-semibold text-saffron">
                    {formatPrice(line.lineTotal, currencySymbol)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-charcoal/10 bg-cream px-5 py-4">
          <div className="mb-4 flex justify-between text-lg">
            <span className="font-medium">Subtotal ({itemCount} items)</span>
            <span className="font-bold text-saffron">
              {formatPrice(subtotal, currencySymbol)}
            </span>
          </div>

          <label className="mb-3 block">
            <span className="mb-1 block text-sm font-medium text-charcoal/80">
              Your name (optional)
            </span>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. Rahul"
              disabled={orderPlaced}
              className="min-h-12 w-full rounded-xl border border-charcoal/20 bg-white px-4 text-charcoal outline-none focus:border-saffron disabled:opacity-60"
            />
          </label>

          <label className="mb-4 block">
            <span className="mb-1 block text-sm font-medium text-charcoal/80">
              Special instructions (optional)
            </span>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g. Less spicy please"
              rows={2}
              disabled={orderPlaced}
              className="w-full resize-none rounded-xl border border-charcoal/20 bg-white px-4 py-3 text-charcoal outline-none focus:border-saffron disabled:opacity-60"
            />
          </label>

          <button
            type="button"
            onClick={onPlaceOrder}
            disabled={cartLines.length === 0 || isSubmitting || orderPlaced}
            className="flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-saffron text-lg font-semibold text-white transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner size="sm" className="border-white border-t-cream" />
                Placing Order...
              </>
            ) : orderPlaced ? (
              'Order Placed ✓'
            ) : (
              'Place Order'
            )}
          </button>
        </div>
      </div>
    </>
  )
}
