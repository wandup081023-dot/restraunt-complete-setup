import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { defaultMenu } from './data/defaultMenu'
import { defaultSettings, STORAGE_KEYS } from './data/defaultSettings'
import { normalizeSettings } from './utils/SettingsContext'

if (!localStorage.getItem(STORAGE_KEYS.menu)) {
  localStorage.setItem(STORAGE_KEYS.menu, JSON.stringify(defaultMenu))
}

const storedSettings = localStorage.getItem(STORAGE_KEYS.settings)
if (!storedSettings) {
  localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(defaultSettings))
} else {
  try {
    localStorage.setItem(
      STORAGE_KEYS.settings,
      JSON.stringify(normalizeSettings(JSON.parse(storedSettings))),
    )
  } catch {
    /* ignore */
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
