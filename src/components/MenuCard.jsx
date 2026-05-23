import { formatPrice } from '../utils/format'

export default function MenuCard({ item, quantity, onAdd, onRemove, currencySymbol }) {
  return (
    <article className="overflow-hidden rounded-2xl bg-white shadow-md transition-shadow hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 to-transparent" />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-heading text-lg font-semibold text-charcoal">{item.name}</h3>
          <span className="shrink-0 rounded-full bg-gold/20 px-2.5 py-1 text-sm font-semibold text-saffron">
            {formatPrice(item.price, currencySymbol)}
          </span>
        </div>
        <p className="mt-1 line-clamp-2 text-sm text-charcoal/70">{item.description}</p>
        <div className="mt-4 flex items-center justify-between">
          {quantity === 0 ? (
            <button
              type="button"
              onClick={onAdd}
              className="min-h-12 flex-1 rounded-xl bg-saffron px-4 py-3 text-sm font-semibold text-white transition-transform active:scale-95"
            >
              Add to Cart
            </button>
          ) : (
            <div className="flex min-h-12 flex-1 items-center justify-between rounded-xl border-2 border-saffron bg-cream">
              <button
                type="button"
                onClick={onRemove}
                className="flex h-12 w-12 items-center justify-center text-xl font-bold text-saffron transition-colors active:bg-saffron/10"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="text-lg font-bold text-charcoal">{quantity}</span>
              <button
                type="button"
                onClick={onAdd}
                className="flex h-12 w-12 items-center justify-center text-xl font-bold text-saffron transition-colors active:bg-saffron/10"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
