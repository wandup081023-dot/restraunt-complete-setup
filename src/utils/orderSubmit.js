import { formatItemsForSheet, formatTimestamp } from './format'
import { GOOGLE_SCRIPT_URL } from '../data/defaultSettings'

export function getGoogleScriptUrl(settings) {
  return settings?.googleScriptUrl?.trim() || GOOGLE_SCRIPT_URL
}

export async function submitOrderToGoogleSheets(scriptUrl, payload) {
  const url = scriptUrl?.trim() || GOOGLE_SCRIPT_URL

  await fetch(url, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  return { success: true }
}

export function buildOrderPayload({
  tableLabel,
  customerName,
  cartItems,
  subtotal,
  total,
  discountAmount = 0,
  discountPercent = 0,
  offerTitle = '',
  specialInstructions,
  currencySymbol = '₹',
}) {
  const notes = [specialInstructions?.trim()].filter(Boolean)
  if (discountAmount > 0) {
    notes.push(
      `Discount: ${discountPercent}% off (${offerTitle || "Offer"}) — saved ${currencySymbol}${discountAmount}`,
    )
  }

  return {
    timestamp: formatTimestamp(),
    table: tableLabel,
    customerName: customerName?.trim(),
    items: formatItemsForSheet(cartItems, currencySymbol),
    subtotal: `${currencySymbol}${subtotal}`,
    total: `${currencySymbol}${total}`,
    specialInstructions: notes.join(' | ') || '',
    status: 'New',
  }
}

export async function placeOrder({
  settings,
  tableLabel,
  customerName,
  cartItems,
  subtotal,
  total,
  discountAmount,
  discountPercent,
  offerTitle,
  specialInstructions,
}) {
  const currencySymbol = settings?.currencySymbol || '₹'
  const sheetPayload = buildOrderPayload({
    tableLabel,
    customerName,
    cartItems,
    subtotal,
    total,
    discountAmount,
    discountPercent,
    offerTitle,
    specialInstructions,
    currencySymbol,
  })

  await submitOrderToGoogleSheets(getGoogleScriptUrl(settings), sheetPayload)

  return { success: true, timestamp: sheetPayload.timestamp }
}

export async function fetchMenuFromSheets(scriptUrl) {
  const url = `${getGoogleScriptUrl({ googleScriptUrl: scriptUrl })}?action=getMenu`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Menu fetch failed')
  const data = await res.json()
  return data?.items?.length ? data.items : null
}
