import { useState } from 'react'
import { GOOGLE_SCRIPT_URL } from '../../data/defaultSettings'
import { useSettings } from '../../utils/SettingsContext'
import { useToast } from '../Toast'

export default function SettingsSection() {
  const { settings, updateSettings } = useSettings()
  const addToast = useToast()
  const [form, setForm] = useState({ ...settings })

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }))

  const saveForm = () => {
    updateSettings({
      ...form,
      discountPercent: Math.min(100, Math.max(0, Number(form.discountPercent) || 0)),
    })
    addToast({ type: 'success', message: 'Settings saved — discount live on menu now' })
  }

  const handleSave = (e) => {
    e.preventDefault()
    saveForm()
  }

  const handleOfferToggle = (checked) => {
    const next = { ...form, offerEnabled: checked }
    setForm(next)
    updateSettings({
      ...next,
      discountPercent: Math.min(100, Math.max(0, Number(next.discountPercent) || 0)),
    })
    addToast({
      type: 'success',
      message: checked ? 'Today\'s offer turned ON' : 'Today\'s offer turned OFF',
    })
  }

  const generalFields = [
    { key: 'restaurantName', label: 'Restaurant Name', type: 'text' },
    { key: 'tagline', label: 'Tagline', type: 'text' },
    {
      key: 'googleScriptUrl',
      label: 'Google Apps Script Web App URL',
      type: 'url',
      placeholder: GOOGLE_SCRIPT_URL,
    },
    { key: 'menuBaseUrl', label: 'Menu Base URL (for QR codes)', type: 'url' },
    { key: 'tableCount', label: 'Default Table Count', type: 'number' },
    { key: 'phone', label: 'Phone', type: 'text' },
    { key: 'address', label: 'Address', type: 'text' },
    { key: 'openingHours', label: 'Opening Hours', type: 'text' },
  ]

  return (
    <form onSubmit={handleSave} className="max-w-2xl space-y-8">
      <section className="rounded-[28px] border border-[rgba(201,168,76,0.14)] bg-[rgba(16,16,16,0.92)] p-5 shadow-[0_18px_48px_rgba(0,0,0,0.28)]">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-2xl font-semibold text-[var(--text-primary)]">
              Today&apos;s Offer & Discount
            </h3>
            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[rgba(245,240,232,0.5)]">
              Turn ON and save — customers see discount in cart automatically.
            </p>
          </div>
          <label className="toggle-switch flex-shrink-0">
            <input
              type="checkbox"
              checked={Boolean(form.offerEnabled)}
              onChange={(e) => handleOfferToggle(e.target.checked)}
            />
            <span className="toggle-slider" />
          </label>
        </div>

        <div className={`space-y-4 ${!form.offerEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
          <label className="block">
            <span className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-[rgba(245,240,232,0.58)]">Offer title</span>
            <input
              type="text"
              value={form.offerTitle ?? ''}
              onChange={(e) => update('offerTitle', e.target.value)}
              placeholder="Today's Offer"
              className="input-field"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-[rgba(245,240,232,0.58)]">
              Offer message (shown to customers)
            </span>
            <textarea
              value={form.offerDescription ?? ''}
              onChange={(e) => update('offerDescription', e.target.value)}
              placeholder="Flat 10% off on all orders today!"
              rows={2}
              className="input-field resize-none"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-[rgba(245,240,232,0.58)]">Discount (%)</span>
            <input
              type="number"
              min="0"
              max="100"
              value={form.discountPercent ?? 0}
              onChange={(e) => update('discountPercent', e.target.value)}
              className="input-field"
            />
            <p className="mt-1 text-[10px] text-[rgba(245,240,232,0.48)]">
              Example: 10 = 10% off · ₹249 cart → ₹25 off → ₹224 total
            </p>
          </label>
        </div>

        {form.offerEnabled && (
          <div
            className="mt-4 rounded-[20px] border border-[rgba(201,168,76,0.14)] bg-[rgba(201,168,76,0.06)] px-4 py-3 text-sm"
          >
            <p className="font-medium text-[var(--gold-light)]">
              {form.offerTitle || "Today's Offer"}
              {Number(form.discountPercent) > 0 && ` · ${form.discountPercent}% OFF`}
            </p>
            {form.offerDescription && (
              <p className="mt-1 text-xs text-[rgba(245,240,232,0.58)]">{form.offerDescription}</p>
            )}
          </div>
        )}
      </section>

      <section>
        <h3 className="mb-1 font-display text-2xl font-semibold text-[var(--text-primary)]">Restaurant Settings</h3>
        <p className="mb-4 text-sm text-[rgba(245,240,232,0.56)]">
          Orders save to Google Sheets via your Apps Script URL.
        </p>

        <div className="space-y-4">
          {generalFields.map(({ key, label, type, placeholder }) => (
            <label key={key} className="block">
              <span className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-[rgba(245,240,232,0.58)]">{label}</span>
              <input
                type={type}
                value={form[key] ?? ''}
                onChange={(e) =>
                  update(key, type === 'number' ? Number(e.target.value) : e.target.value)
                }
                placeholder={placeholder}
                className="input-field"
              />
            </label>
          ))}
        </div>
      </section>

      <button type="submit" className="btn-secondary w-full sm:w-auto">
        Save All Settings
      </button>
    </form>
  )
}
