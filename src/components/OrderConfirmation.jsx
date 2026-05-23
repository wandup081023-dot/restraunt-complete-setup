import { formatPrice } from '../utils/format'

export default function OrderConfirmation({
  tableNumber,
  customerName,
  cartItems = [],
  pricing,
  currencySymbol = '₹',
  onDone,
}) {
  const total = pricing?.total ?? 0

  return (
    <div className="order-success-screen">
      <div className="order-success-ring">
        <div className="success-check-circle">
          <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
            <path
              d="M14 27l8 8 16-20"
              stroke="white"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="order-success-check"
            />
          </svg>
        </div>
      </div>

      <div className="text-center section-fade-enter" style={{ animationDelay: '0.2s' }}>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E65C00]">
          Success
        </p>
        <h1 className="font-display mt-2 text-3xl font-bold text-[#1A1A1A] md:text-4xl">
          Order Placed!
        </h1>
        <p className="mt-2 text-lg text-[#5A4A3A]">
          Table <span className="font-bold text-[#E65C00]">{tableNumber}</span>
          {customerName && (
            <span>
              {' '}
              · <span className="font-medium">{customerName}</span>
            </span>
          )}
        </p>
      </div>

      {cartItems.length > 0 && (
        <div
          className="card-glass mx-auto mt-8 w-full max-w-sm p-6 section-fade-enter"
          style={{ animationDelay: '0.35s' }}
        >
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-[#8B7355]">
            Order summary
          </p>
          <ul className="max-h-48 space-y-3 overflow-y-auto">
            {cartItems.map((item) => (
              <li key={item.id} className="flex justify-between gap-3 text-sm">
                <span className="text-[#1A1A1A]">
                  <span className="font-bold text-[#E65C00]">{item.quantity}×</span> {item.name}
                </span>
                <span className="shrink-0 font-semibold">
                  {formatPrice(item.price * item.quantity, currencySymbol)}
                </span>
              </li>
            ))}
          </ul>
          {pricing?.hasDiscount && (
            <div className="mt-4 space-y-1 border-t border-[rgba(230,92,0,0.1)] pt-3 text-sm">
              <div className="flex justify-between text-[#5A4A3A]">
                <span>Subtotal</span>
                <span>{formatPrice(pricing.subtotal, currencySymbol)}</span>
              </div>
              <div className="flex justify-between font-medium text-green-700">
                <span>Discount</span>
                <span>−{formatPrice(pricing.discountAmount, currencySymbol)}</span>
              </div>
            </div>
          )}
          <div className="mt-4 flex justify-between border-t border-[rgba(230,92,0,0.15)] pt-4">
            <span className="font-display text-lg font-bold">Total paid</span>
            <span className="font-display text-2xl font-bold text-[#E65C00]">
              {formatPrice(total, currencySymbol)}
            </span>
          </div>
        </div>
      )}

      <p
        className="mt-6 max-w-xs text-center text-[#5A4A3A] section-fade-enter"
        style={{ animationDelay: '0.5s' }}
      >
        Our team will serve you shortly 😊
        <br />
        <span className="text-sm text-[#8B7355]">Sit back and enjoy!</span>
      </p>

      <button
        type="button"
        onClick={onDone}
        className="btn-primary mt-8 w-full max-w-sm section-fade-enter"
        style={{ animationDelay: '0.6s', minHeight: 56, borderRadius: 18 }}
      >
        New Order
      </button>
    </div>
  )
}
