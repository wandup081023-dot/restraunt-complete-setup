export function isOfferActive(settings) {
  if (!settings) return false
  if (settings.offerEnabled === true || settings.offerEnabled === 'true') return true
  if (settings.offerEnabled === false || settings.offerEnabled === 'false') return false
  return Boolean(settings.offerEnabled)
}

/** @param {number} cartTotal @param {object} settings */
export function getOrderPricing(cartTotal, settings) {
  const subtotal = cartTotal
  const offerActive = isOfferActive(settings)
  const percent = offerActive
    ? Math.min(100, Math.max(0, Number(settings.discountPercent) || 0))
    : 0
  const discountAmount = Math.round((subtotal * percent) / 100)
  const total = Math.max(0, subtotal - discountAmount)

  return {
    subtotal,
    discountPercent: percent,
    discountAmount,
    total,
    offerActive,
    hasDiscount: offerActive && percent > 0 && discountAmount > 0,
    offerTitle: settings?.offerTitle?.trim() || "Today's Offer",
    offerDescription: settings?.offerDescription?.trim() || '',
  }
}
