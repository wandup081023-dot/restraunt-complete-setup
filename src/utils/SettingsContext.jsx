import { createContext, useContext, useState } from 'react'
import { GOOGLE_SCRIPT_URL } from '../data/defaultSettings'

const SettingsContext = createContext(null)

const DEFAULT_SETTINGS = {
  restaurantName: 'Spice Garden',
  tagline: 'Authentic Flavours Since 1994',
  googleScriptUrl: GOOGLE_SCRIPT_URL,
  menuBaseUrl: typeof window !== 'undefined' ? `${window.location.origin}/menu` : '/menu',
  tableCount: 10,
  currency: 'INR',
  currencySymbol: '₹',
  gstPercent: 5,
  enableGst: true,
  primaryColor: '#C9A84C',
  logoUrl: '',
  openingHours: '11:00 AM – 11:00 PM',
  phone: '',
  address: '',
  upiId: '',
  offerEnabled: true,
  offerTitle: "Today's Offer",
  offerDescription: 'Flat 10% off on your order today!',
  discountPercent: 10,
}

export function normalizeSettings(parsed = {}) {
  return {
    ...DEFAULT_SETTINGS,
    ...parsed,
    googleScriptUrl: parsed.googleScriptUrl?.trim() || GOOGLE_SCRIPT_URL,
    offerEnabled:
      parsed.offerEnabled !== undefined
        ? parsed.offerEnabled === true || parsed.offerEnabled === 'true'
        : DEFAULT_SETTINGS.offerEnabled,
    discountPercent: Math.min(
      100,
      Math.max(0, Number(parsed.discountPercent ?? DEFAULT_SETTINGS.discountPercent) || 0),
    ),
    offerTitle: parsed.offerTitle ?? DEFAULT_SETTINGS.offerTitle,
    offerDescription: parsed.offerDescription ?? DEFAULT_SETTINGS.offerDescription,
  }
}

function loadSettings() {
  try {
    const stored = localStorage.getItem('restaurant_settings')
    if (stored) {
      return normalizeSettings(JSON.parse(stored))
    }
  } catch {
    /* ignore */
  }
  return { ...DEFAULT_SETTINGS }
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(loadSettings)

  const updateSettings = (updates) => {
    const next = normalizeSettings({ ...settings, ...updates })
    setSettings(next)
    try {
      localStorage.setItem('restaurant_settings', JSON.stringify(next))
    } catch {
      /* ignore */
    }
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
  return ctx
}
