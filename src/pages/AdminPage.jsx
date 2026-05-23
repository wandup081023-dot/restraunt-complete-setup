import { useState } from 'react'
import { Link } from 'react-router-dom'
import SettingsSection from '../components/admin/SettingsSection'
import MenuManagerSection from '../components/admin/MenuManagerSection'
import QRGeneratorSection from '../components/admin/QRGeneratorSection'
import { defaultSettings } from '../data/defaultSettings'
import { isAdminAuthenticated, setAdminAuthenticated } from '../utils/storage'

const SECTIONS = [
  { id: 'settings', label: 'Settings', icon: '⚙️' },
  { id: 'menu', label: 'Menu Manager', icon: '📋' },
  { id: 'qr', label: 'QR Generator', icon: '📱' },
]

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(isAdminAuthenticated)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [activeSection, setActiveSection] = useState('settings')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogin = (e) => {
    e.preventDefault()
    const settings = JSON.parse(localStorage.getItem('restaurant_settings') || '{}')
    const expected = settings.adminPassword || defaultSettings.adminPassword

    if (password === expected) {
      setAdminAuthenticated(true)
      setAuthenticated(true)
      setError('')
    } else {
      setError('Incorrect password')
    }
  }

  const handleLogout = () => {
    setAdminAuthenticated(false)
    setAuthenticated(false)
    setPassword('')
  }

  if (!authenticated) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-cream p-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-xl"
        >
          <h1 className="font-heading text-center text-3xl font-bold text-charcoal">Admin Login</h1>
          <p className="mt-2 text-center text-sm text-charcoal/60">
            Default password: admin123
          </p>
          <label className="mt-6 block">
            <span className="text-sm font-medium">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 min-h-14 w-full rounded-xl border border-charcoal/20 px-4 outline-none focus:border-saffron"
              placeholder="Enter admin password"
              autoFocus
            />
          </label>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            className="mt-6 min-h-14 w-full rounded-xl bg-saffron text-lg font-semibold text-white"
          >
            Login
          </button>
          <Link to="/menu?table=1" className="mt-4 block text-center text-sm text-saffron">
            ← Back to Menu
          </Link>
        </form>
      </div>
    )
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'menu':
        return <MenuManagerSection />
      case 'qr':
        return <QRGeneratorSection />
      default:
        return <SettingsSection />
    }
  }

  return (
    <div className="flex min-h-dvh bg-cream">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-charcoal/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-xl transition-transform lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="border-b border-charcoal/10 p-5">
          <h1 className="font-heading text-xl font-bold text-charcoal">Admin Panel</h1>
          <p className="text-xs text-charcoal/50">Restaurant QR Ordering</p>
        </div>
        <nav className="p-3">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                setActiveSection(s.id)
                setSidebarOpen(false)
              }}
              className={`mb-1 flex min-h-12 w-full items-center gap-3 rounded-xl px-4 text-left text-sm font-medium transition-colors ${
                activeSection === s.id
                  ? 'bg-saffron text-white'
                  : 'text-charcoal hover:bg-cream'
              }`}
            >
              <span>{s.icon}</span>
              {s.label}
            </button>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 border-t border-charcoal/10 p-4">
          <Link
            to="/menu?table=1"
            className="mb-2 block text-center text-sm text-saffron"
          >
            View Customer Menu
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="min-h-10 w-full rounded-lg border text-sm font-medium text-charcoal/70"
          >
            Logout
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-charcoal/10 bg-white px-4 py-3 lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="min-h-12 min-w-12 rounded-lg bg-cream text-xl"
            aria-label="Open menu"
          >
            ☰
          </button>
          <span className="font-heading font-semibold">
            {SECTIONS.find((s) => s.id === activeSection)?.label}
          </span>
          <div className="w-12" />
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-10">{renderSection()}</main>
      </div>
    </div>
  )
}
