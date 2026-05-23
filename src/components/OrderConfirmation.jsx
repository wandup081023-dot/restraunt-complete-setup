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
    <div className="order-success-screen flex items-center justify-center px-4 py-8">
      <div className="flex w-full max-w-lg flex-col items-center">
        <div className="order-success-ring relative mb-8">
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none" aria-hidden="true">
            <circle
              cx="60"
              cy="60"
              r="45"
              className="order-success-circle"
              stroke="rgba(201,168,76,0.9)"
              strokeWidth="2.5"
              fill="rgba(9,9,9,0.84)"
            />
          </svg>

          <div className="success-check-circle absolute inset-[18px] flex items-center justify-center rounded-full">
            <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
              <path
                d="M14 27l8 8 16-20"
                stroke="var(--gold-light)"
                strokeWidth="4.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="order-success-check"
              />
            </svg>
          </div>
        </div>

      <div className="text-center section-fade-enter" style={{ animationDelay: '0.2s' }}>
        <p className="text-[10px] uppercase tracking-[0.42em] text-[var(--gold-light)]">
          Success
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-[var(--text-primary)] md:text-5xl">
          Order Placed!
        </h1>
        <p className="mt-3 text-base text-[rgba(245,240,232,0.68)] md:text-lg">
          Table <span className="text-[var(--accent)]">{tableNumber}</span>
          {customerName && (
            <span>
              {' '}
              · <span className="text-[var(--text-primary)]">{customerName}</span>
            </span>
          )}
        </p>
      </div>

      {cartItems.length > 0 && (
        <div
          className="card-glass mx-auto mt-8 w-full max-w-sm rounded-[28px] p-6 section-fade-enter"
          style={{ animationDelay: '0.35s' }}
        >
          <p className="mb-4 text-[10px] uppercase tracking-[0.28em] text-[rgba(245,240,232,0.5)]">
            Order summary
          </p>
          <ul className="max-h-48 space-y-3 overflow-y-auto">
            {cartItems.map((item) => (
              <li key={item.id} className="flex justify-between gap-3 text-sm text-[rgba(245,240,232,0.72)]">
                <span>
                  <span className="font-semibold text-[var(--accent)]">{item.quantity}×</span> {item.name}
                </span>
                <span className="shrink-0 text-[rgba(245,240,232,0.64)]">
                  {formatPrice(item.price * item.quantity, currencySymbol)}
                </span>
              </li>
            ))}
          </ul>
          {pricing?.hasDiscount && (
            <div className="mt-4 space-y-1 border-t border-[rgba(201,168,76,0.14)] pt-3 text-sm">
              <div className="flex justify-between text-[rgba(245,240,232,0.68)]">
                <span>Subtotal</span>
                <span>{formatPrice(pricing.subtotal, currencySymbol)}</span>
              </div>
              <div className="flex justify-between text-[var(--accent)]">
                <span>Discount</span>
                <span>−{formatPrice(pricing.discountAmount, currencySymbol)}</span>
              </div>
            </div>
          )}
          <div className="mt-4 flex justify-between border-t border-[rgba(201,168,76,0.14)] pt-4">
            <span className="font-display text-xl font-semibold text-[var(--text-primary)]">Total paid</span>
            <span className="font-display text-3xl font-semibold text-[var(--accent)]">
              {formatPrice(total, currencySymbol)}
            </span>
          </div>
        </div>
      )}

      <p
        className="mt-6 max-w-xs text-center text-[rgba(245,240,232,0.62)] section-fade-enter"
        style={{ animationDelay: '0.5s' }}
      >
        Our team will serve you shortly.
        <br />
        <span className="text-sm text-[rgba(245,240,232,0.46)]">Sit back and enjoy.</span>
      </p>

      <button
        type="button"
        onClick={onDone}
        className="btn-secondary mt-8 w-full max-w-sm section-fade-enter"
        style={{ animationDelay: '0.6s', minHeight: 56, borderRadius: 18 }}
      >
        NEW ORDER
      </button>
      </div>
    </div>
  )
}
