import { useState } from 'react'
import { GOOGLE_SCRIPT_URL } from '../../data/defaultSettings'
import { getSettings, saveSettings } from '../../utils/storage'
import Toast from '../Toast'

export default function SettingsSection() {
  const [form, setForm] = useState(getSettings)
  const [toast, setToast] = useState(null)

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }))

  const handleSave = (e) => {
    e.preventDefault()
    saveSettings(form)
    setToast({ message: 'Settings saved successfully!', type: 'success' })
  }

  const fields = [
    { key: 'restaurantName', label: 'Restaurant Name', type: 'text' },
    { key: 'restaurantLogo', label: 'Restaurant Logo URL', type: 'url' },
    {
      key: 'googleScriptUrl',
      label: 'Google Apps Script Web App URL',
      type: 'url',
      placeholder: GOOGLE_SCRIPT_URL,
    },
    { key: 'currencySymbol', label: 'Currency Symbol', type: 'text' },
    {
      key: 'baseUrl',
      label: 'Website Base URL (for QR codes)',
      type: 'url',
      placeholder: 'https://myrestaurant.vercel.app',
    },
  ]

  return (
    <div>
      <h2 className="font-heading text-2xl font-bold text-charcoal">Settings</h2>
      <p className="mt-1 text-sm text-charcoal/60">
        Configure restaurant details and Google Sheets integration. Saved to your browser.
      </p>

      <form onSubmit={handleSave} className="mt-6 space-y-4">
        {fields.map(({ key, label, type, placeholder }) => (
          <label key={key} className="block">
            <span className="mb-1 block text-sm font-medium text-charcoal">{label}</span>
            <input
              type={type}
              value={form[key] || ''}
              onChange={(e) => update(key, e.target.value)}
              placeholder={placeholder}
              className="min-h-12 w-full rounded-xl border border-charcoal/20 bg-white px-4 outline-none focus:border-saffron"
            />
          </label>
        ))}

        <button
          type="submit"
          className="min-h-12 rounded-xl bg-saffron px-8 font-semibold text-white shadow-md active:scale-[0.98]"
        >
          Save Settings
        </button>
      </form>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  )
}
