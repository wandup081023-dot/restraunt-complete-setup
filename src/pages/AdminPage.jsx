import { useState } from 'react'
import MenuManagerSection from '../components/admin/MenuManagerSection'
import QRGeneratorSection from '../components/admin/QRGeneratorSection'
import SettingsSection from '../components/admin/SettingsSection'
import { useSettings } from '../utils/SettingsContext'

const MenuIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <rect x="3" y="4" width="8" height="2" rx="1" fill={active ? 'currentColor' : 'rgba(245,240,232,0.56)'} />
    <rect x="3" y="9" width="14" height="2" rx="1" fill={active ? 'currentColor' : 'rgba(245,240,232,0.56)'} />
    <rect x="3" y="14" width="11" height="2" rx="1" fill={active ? 'currentColor' : 'rgba(245,240,232,0.56)'} />
  </svg>
)

const QRIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <rect x="3" y="3" width="6" height="6" rx="1" stroke={active ? 'currentColor' : 'rgba(245,240,232,0.56)'} strokeWidth="1.5" />
    <rect x="11" y="3" width="6" height="6" rx="1" stroke={active ? 'currentColor' : 'rgba(245,240,232,0.56)'} strokeWidth="1.5" />
    <rect x="3" y="11" width="6" height="6" rx="1" stroke={active ? 'currentColor' : 'rgba(245,240,232,0.56)'} strokeWidth="1.5" />
    <path d="M11 11h2v2h-2zM13 13h2v2h-2z" stroke={active ? 'currentColor' : 'rgba(245,240,232,0.56)'} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const SettingsIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <circle cx="10" cy="10" r="2.5" stroke={active ? 'currentColor' : 'rgba(245,240,232,0.56)'} strokeWidth="1.5" />
    <path d="M10 3v2M10 15v2M3 10h2M15 10h2" stroke={active ? 'currentColor' : 'rgba(245,240,232,0.56)'} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const NAV_ITEMS = [
  { id: 'menu', label: 'Menu Manager', Icon: MenuIcon, desc: 'Dishes & categories' },
  { id: 'qr', label: 'QR Codes', Icon: QRIcon, desc: 'Table QR generator' },
  { id: 'settings', label: 'Settings', Icon: SettingsIcon, desc: 'Offers & config' },
]

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState('menu')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const { settings } = useSettings()

  const restaurantName = settings?.restaurantName || 'Spice Garden'
  const activeItem = NAV_ITEMS.find((item) => item.id === activeSection)

  return (
    <div className="admin-shell flex min-h-dvh">
      {mobileNavOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      <aside
        className={`admin-sidebar fixed inset-y-0 left-0 z-50 flex w-[284px] flex-col transition-transform duration-500 ease-out lg:relative lg:translate-x-0 ${mobileNavOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="border-b border-[rgba(201,168,76,0.12)] px-6 py-7">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-[18px] border border-[rgba(201,168,76,0.2)] bg-[rgba(201,168,76,0.08)] text-[var(--gold-light)]">
              <span className="font-display text-xl font-semibold">{restaurantName.charAt(0)}</span>
            </div>
            <div>
              <p className="font-display text-2xl font-semibold leading-none text-[var(--text-primary)]">
                {restaurantName}
              </p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.28em] text-[rgba(245,240,232,0.48)]">
                Admin Dashboard
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-2 px-4 py-5">
          {NAV_ITEMS.map(({ id, label, Icon, desc }) => (
            <button
              key={id}
              type="button"
              className={`admin-nav-item ${activeSection === id ? 'active' : ''}`}
              onClick={() => {
                setActiveSection(id)
                setMobileNavOpen(false)
              }}
            >
              <Icon active={activeSection === id} />
              <div>
                <p className="text-sm font-medium leading-tight">{label}</p>
                <p className="mt-0.5 text-[10px] uppercase tracking-[0.16em] opacity-50">{desc}</p>
              </div>
            </button>
          ))}
        </nav>

        <div className="border-t border-[rgba(201,168,76,0.08)] px-6 py-5">
          <p className="text-center text-[10px] uppercase tracking-[0.24em] text-[rgba(245,240,232,0.4)]">
            Powered by Google Sheets
          </p>
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-[rgba(201,168,76,0.12)] bg-[rgba(10,10,10,0.86)] px-5 py-4 backdrop-blur-xl">
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(201,168,76,0.16)] bg-[rgba(255,255,255,0.02)] text-[var(--text-primary)] lg:hidden"
            aria-label="Open menu"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          <div className="min-w-0 flex-1">
            <p className="text-[10px] uppercase tracking-[0.34em] text-[var(--gold-light)]">Administration</p>
            <h1 className="mt-1 font-display text-3xl font-semibold text-[var(--text-primary)]">
              {activeItem?.label}
            </h1>
            <p className="text-sm text-[rgba(245,240,232,0.58)]">{activeItem?.desc}</p>
          </div>

          <div className="hidden items-center gap-2 rounded-full border border-[rgba(201,168,76,0.14)] bg-[rgba(255,255,255,0.02)] px-4 py-2 sm:flex">
            <span className="h-2 w-2 rounded-full bg-[var(--gold)] animate-pulse-soft" />
            <span className="text-xs uppercase tracking-[0.18em] text-[rgba(245,240,232,0.72)]">Live</span>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 lg:p-8">
          <div className="admin-content-card section-fade-enter mx-auto max-w-5xl rounded-[28px] p-5 lg:p-7" key={activeSection}>
            {activeSection === 'menu' && <MenuManagerSection />}
            {activeSection === 'qr' && <QRGeneratorSection />}
            {activeSection === 'settings' && <SettingsSection />}
          </div>
        </div>
      </main>
    </div>
  )
}
