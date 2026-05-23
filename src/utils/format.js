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

export function formatItemsForSheet(cartItems, currencySymbol = '₹') {
  return cartItems
    .map(
      (item) =>
        `${item.quantity}x ${item.name} (${currencySymbol}${item.price * item.quantity})`,
    )
    .join(', ')
}
