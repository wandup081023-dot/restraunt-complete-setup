import { formatPrice } from '../utils/format'

export default function OrderConfirmation({
  tableNumber,
  cart,
  menuItems,
  total,
  currencySymbol,
  onNewOrder,
}) {
  const lines = cart
    .map(({ id, quantity }) => {
      const item = menuItems.find((m) => m.id === id)
      if (!item) return null
      return { name: item.name, quantity, total: item.price * quantity }
    })
    .filter(Boolean)

  return (
    <div className="animate-fade-in fixed inset-0 z-[60] flex items-center justify-center bg-cream p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl">
        <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center">
          <span className="absolute inset-0 animate-ping rounded-full bg-green-400/30" />
          <div className="checkmark-pop relative flex h-20 w-20 items-center justify-center rounded-full bg-green-500 text-4xl text-white shadow-lg shadow-green-500/30">
            ✓
          </div>
        </div>

        <h2 className="font-heading text-3xl font-bold text-charcoal">
          Order Placed Successfully!
        </h2>

        <p className="mt-2 text-lg font-semibold text-saffron">Table {tableNumber}</p>

        <div className="mt-6 rounded-2xl bg-cream p-4 text-left">
          <p className="mb-3 text-sm font-medium text-charcoal/70">Your order</p>
          <ul className="space-y-2">
            {lines.map((line) => (
              <li key={line.name} className="flex justify-between text-sm">
                <span>
                  {line.quantity}× {line.name}
                </span>
                <span className="font-medium text-charcoal">
                  {formatPrice(line.total, currencySymbol)}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 flex justify-between border-t border-charcoal/10 pt-3 text-lg font-bold">
            <span>Total</span>
            <span className="text-saffron">{formatPrice(total, currencySymbol)}</span>
          </p>
        </div>

        <p className="mt-5 text-charcoal/80">
          Our team will serve you shortly 😊
        </p>

        <button
          type="button"
          onClick={onNewOrder}
          className="mt-6 min-h-14 w-full rounded-xl bg-saffron text-lg font-semibold text-white shadow-md transition-transform active:scale-[0.98]"
        >
          New Order
        </button>
      </div>
    </div>
  )
}
