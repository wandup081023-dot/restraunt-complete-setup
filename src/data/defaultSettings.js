export const GOOGLE_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbzQhNqdIFkFGWViJdUvCNQ2hlAuHSMMJ4-EO0nrX9Ra7yS9kuzB21hVJfA-W3Qei8qRVg/exec'

export const defaultSettings = {
  restaurantName: 'Spice Garden Restaurant',
  restaurantLogo:
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&q=80',
  tagline: 'Authentic Flavours Since 1994',
  googleScriptUrl: GOOGLE_SCRIPT_URL,
  currencySymbol: '₹',
  adminPassword: 'admin123',
  baseUrl: typeof window !== 'undefined' ? window.location.origin : '',
  menuBaseUrl: typeof window !== 'undefined' ? `${window.location.origin}/menu` : '/menu',
  offerEnabled: true,
  offerTitle: "Today's Offer",
  offerDescription: 'Flat 10% off on your order today!',
  discountPercent: 10,
}

export const STORAGE_KEYS = {
  settings: 'restaurant_settings',
  menu: 'restaurant_menu',
  adminAuth: 'restaurant_admin_auth',
}
