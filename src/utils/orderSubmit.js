import { formatItemsForSheet, formatTimestamp } from './format'

const GOOGLE_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbzQhNqdIFkFGWViJdUvCNQ2hlAuHSMMJ4-EO0nrX9Ra7yS9kuzB21hVJfA-W3Qei8qRVg/exec'

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
  cart,
  menuItems,
  total,
  specialInstructions,
  currencySymbol,
}) {
  const timestamp = formatTimestamp()
  const items = formatItemsForSheet(cart, menuItems, currencySymbol)

  return {
    timestamp,
    table: tableLabel,
    customerName: customerName?.trim() || 'Guest',
    items,
    total: `${currencySymbol}${total}`,
    specialInstructions: specialInstructions?.trim() || '',
    status: 'New',
  }
}

export async function placeOrder({
  settings,
  tableLabel,
  customerName,
  cart,
  menuItems,
  total,
  specialInstructions,
}) {
  const currencySymbol = settings.currencySymbol || '₹'
  const timestamp = formatTimestamp()

  const sheetPayload = buildOrderPayload({
    tableLabel,
    customerName,
    cart,
    menuItems,
    total,
    specialInstructions,
    currencySymbol,
  })

  await submitOrderToGoogleSheets(getGoogleScriptUrl(settings), sheetPayload)

  return { success: true, timestamp }
}
