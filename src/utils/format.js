export function formatPrice(amount, symbol = '₹') {
  return `${symbol}${amount}`
}

export function formatTimestamp(date = new Date()) {
  return date.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

export function formatItemsForSheet(cart, menuItems, currencySymbol) {
  return cart
    .map(({ id, quantity }) => {
      const item = menuItems.find((m) => m.id === id)
      if (!item) return null
      return `${quantity}x ${item.name} (${currencySymbol}${item.price * quantity})`
    })
    .filter(Boolean)
    .join(', ')
}
