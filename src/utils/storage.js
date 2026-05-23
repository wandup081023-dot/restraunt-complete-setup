import { defaultMenu } from '../data/defaultMenu'
import { defaultSettings, GOOGLE_SCRIPT_URL, STORAGE_KEYS } from '../data/defaultSettings'

export function getSettings() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.settings)
    if (stored) {
      const parsed = JSON.parse(stored)
      const merged = { ...defaultSettings, ...parsed }
      if (!parsed.googleScriptUrl?.trim()) {
        merged.googleScriptUrl = GOOGLE_SCRIPT_URL
      }
      return merged
    }
  } catch {
    /* ignore */
  }
  return { ...defaultSettings }
}

export function saveSettings(settings) {
  localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings))
  window.dispatchEvent(new Event('settings-updated'))
}

export function getMenuItems() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.menu)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch {
    /* ignore */
  }
  return [...defaultMenu]
}

export function saveMenuItems(items) {
  localStorage.setItem(STORAGE_KEYS.menu, JSON.stringify(items))
  window.dispatchEvent(new Event('menu-updated'))
}

export function isAdminAuthenticated() {
  return sessionStorage.getItem(STORAGE_KEYS.adminAuth) === 'true'
}

export function setAdminAuthenticated(value) {
  if (value) {
    sessionStorage.setItem(STORAGE_KEYS.adminAuth, 'true')
  } else {
    sessionStorage.removeItem(STORAGE_KEYS.adminAuth)
  }
}
