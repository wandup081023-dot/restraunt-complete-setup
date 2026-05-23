import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { defaultMenuItems } from './data/defaultMenu'
import { defaultSettings, STORAGE_KEYS } from './data/defaultSettings'
import { getSettings, saveSettings } from './utils/storage'

if (!localStorage.getItem(STORAGE_KEYS.menu)) {
  localStorage.setItem(STORAGE_KEYS.menu, JSON.stringify(defaultMenuItems))
}
if (!localStorage.getItem(STORAGE_KEYS.settings)) {
  localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(defaultSettings))
} else {
  const settings = getSettings()
  if (!settings.googleScriptUrl?.trim()) {
    saveSettings(settings)
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
