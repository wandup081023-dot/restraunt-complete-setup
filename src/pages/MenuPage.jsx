import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import MenuCard from '../components/MenuCard'
import CartDrawer from '../components/CartDrawer'
import CategoryTabs from '../components/CategoryTabs'
import LoadingSpinner from '../components/LoadingSpinner'
import { useCart } from '../utils/CartContext'
import { useSettings } from '../utils/SettingsContext'
import { defaultMenu } from '../data/defaultMenu'
import { fetchMenuFromSheets } from '../utils/orderSubmit'
import { getMenuItems } from '../utils/storage'
import { getOrderPricing } from '../utils/pricing'

const CATEGORY_LABELS = {
  All: 'All Dishes',
  Starters: 'Starters',
  Mains: 'Main Course',
  Breads: 'Bread Basket',
  Rice: 'Rice Specials',
  Desserts: 'Desserts',
  Drinks: 'Drinks',
}

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M13 13l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const FilterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path d="M2 4h14M5 9h8M8 14h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const SparkIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path d="M9 1.8l1.4 4.4L15 7.5l-4.6 1.3L9 13.2 7.6 8.8 3 7.5l4.6-1.3L9 1.8z" fill="currentColor" />
  </svg>
)

// ─── HERO SECTION ────────────────────────────────────────────────────────────
function HeroSection({ onBrowseMenu, onOpenCart, cartCount, cartTotal }) {
  const [searchParams] = useSearchParams()
  const tableNumber = searchParams.get('table') || '1'

  return (
    <div style={{
      background: '#0d0d0d',
      width: '100%',
      fontFamily: "'Jost', sans-serif",
      color: '#F5F0E8',
      boxSizing: 'border-box',
    }}>
      {/* ── MAIN GRID ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'clamp(300px, 50%, 700px) 1fr',
        minHeight: '100svh',
      }}
        className="hero-responsive-grid"
      >
        {/* LEFT COLUMN */}
        <div style={{
          padding: 'clamp(1.5rem, 4vw, 2.5rem)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderRight: '0.5px solid rgba(201,168,76,0.2)',
          boxSizing: 'border-box',
          minWidth: 0,
        }}>
          {/* Top bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '38px', height: '38px', borderRadius: '50%',
                border: '1px solid rgba(201,168,76,0.5)', overflow: 'hidden', flexShrink: 0,
              }}>
                <img
                  src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=80&q=80"
                  alt="restaurant logo"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '15px', letterSpacing: '0.12em' }}>
                Zafran
              </span>
            </div>
            <span style={{
              fontSize: '11px', letterSpacing: '0.18em', color: '#C9A84C',
              border: '0.5px solid rgba(201,168,76,0.4)', padding: '5px 14px',
              borderRadius: '20px', whiteSpace: 'nowrap',
            }}>
              TABLE {tableNumber}
            </span>
          </div>

          {/* Hero text */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 'clamp(2rem,4vw,3rem) 0 2rem' }}>
            <div style={{ width: '48px', height: '1px', background: '#C9A84C', marginBottom: '1.5rem' }} />
            <p style={{ fontSize: '11px', letterSpacing: '0.2em', color: '#888', textTransform: 'uppercase', marginBottom: '1.2rem' }}>
              Today's Special
            </p>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(2.4rem, 5vw, 5rem)',
              fontWeight: 400,
              lineHeight: 1.05,
              color: '#F5F0E8',
              margin: '0 0 1.5rem',
            }}>
              Every dish,<br />
              a <span style={{ color: '#C9A84C', fontStyle: 'italic' }}>story</span><br />
              on your plate.
            </h1>
            <p style={{
              fontSize: '14px', color: '#888', fontWeight: 300,
              letterSpacing: '0.04em', marginBottom: '2.5rem',
              lineHeight: 1.7, maxWidth: '340px',
            }}>
              Handcrafted flavours rooted in tradition. Discover our curated menu and order directly from your table.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={onBrowseMenu}
                style={{
                  background: '#C9A84C', color: '#0d0d0d', border: 'none',
                  padding: '14px 28px', fontFamily: "'Jost', sans-serif",
                  fontSize: '13px', letterSpacing: '0.14em', textTransform: 'uppercase',
                  cursor: 'pointer', borderRadius: '2px', fontWeight: 500,
                  minHeight: '48px', transition: 'background 0.25s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#E8D5A3'}
                onMouseLeave={e => e.currentTarget.style.background = '#C9A84C'}
              >
                Browse Menu →
              </button>
              <button
                onClick={onBrowseMenu}
                style={{
                  background: 'transparent', color: '#F5F0E8',
                  border: '0.5px solid rgba(245,240,232,0.3)',
                  padding: '14px 28px', fontFamily: "'Jost', sans-serif",
                  fontSize: '13px', letterSpacing: '0.14em', textTransform: 'uppercase',
                  cursor: 'pointer', borderRadius: '2px', minHeight: '48px',
                  transition: 'all 0.25s',
                }}
              >
                Chef&apos;s Picks
              </button>
            </div>
          </div>

          {/* Stats row */}
          <div style={{
            display: 'flex', gap: 'clamp(1rem,3vw,2.5rem)',
            paddingTop: '1.5rem',
            borderTop: '0.5px solid rgba(255,255,255,0.08)',
          }}>
            {[['48+', 'Dishes'], ['5', 'Categories'], ['30yr', 'Heritage']].map(([num, label], i) => (
              <React.Fragment key={label}>
                {i > 0 && <div style={{ width: '0.5px', background: 'rgba(255,255,255,0.08)' }} />}
                <div>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.6rem', color: '#C9A84C', margin: 0 }}>{num}</p>
                  <p style={{ fontSize: '11px', color: '#888', letterSpacing: '0.1em', margin: '4px 0 0' }}>{label}</p>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN — hidden on mobile via CSS class */}
        <div className="hero-right-panel" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1.2, overflow: 'hidden' }}>
            <img
              src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=800&q=85"
              alt="featured dish"
              style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.75) contrast(1.05)' }}
            />
          </div>
          <div style={{
            flex: 1, background: '#161616', padding: '2rem 2.5rem',
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            borderTop: '0.5px solid rgba(201,168,76,0.15)',
          }}>
            <p style={{ fontSize: '10px', letterSpacing: '0.22em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: '0.8rem' }}>
              Tempting Choice
            </p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', fontWeight: 400, color: '#F5F0E8', margin: '0 0 0.5rem' }}>
              Paneer Tikka
            </h2>
            <p style={{ fontSize: '13px', color: '#888', fontWeight: 300, marginBottom: '1.2rem', lineHeight: 1.6 }}>
              Cottage cheese marinated in spiced yogurt, slow-grilled to perfection over charcoal.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.6rem', color: '#C9A84C' }}>₹249</span>
              <span style={{ fontSize: '10px', letterSpacing: '0.15em', color: '#C9A84C', border: '0.5px solid rgba(201,168,76,0.4)', padding: '4px 12px', borderRadius: '2px' }}>
                + Best Seller
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* CART BAR — only when items in cart */}
      {cartCount > 0 && (
        <div
          onClick={onOpenCart}
          style={{
            background: '#1a1a1a', borderTop: '0.5px solid rgba(201,168,76,0.25)',
            padding: '1rem 2.5rem', display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '36px', height: '36px',
              border: '0.5px solid rgba(201,168,76,0.4)', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px',
            }}>🛍</div>
            <div>
              <p style={{ fontSize: '13px', color: '#F5F0E8', margin: 0 }}>View Order</p>
              <p style={{ fontSize: '11px', color: '#888', margin: '4px 0 0' }}>{cartCount} item{cartCount > 1 ? 's' : ''}</p>
            </div>
          </div>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem', color: '#C9A84C' }}>
            ₹{cartTotal}
          </span>
        </div>
      )}

      {/* MOBILE RESPONSIVE STYLES */}
      <style>{`
        @media (max-width: 768px) {
          .hero-responsive-grid {
            grid-template-columns: 1fr !important;
            min-height: 100svh !important;
          }
          .hero-right-panel {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}

// ─── CART FAB ────────────────────────────────────────────────────────────────
function CartCTA({ count, pricing, onClick, pulse }) {
  if (count === 0) return null
  return (
    <div className={`cart-fab ${pulse ? 'cart-fab-flash' : ''}`}>
      <div className="cart-fab-glow" />
      <button type="button" onClick={onClick} className="cart-fab-btn" aria-label={`View cart, ${count} items`}>
        <div className="flex items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(255,255,255,0.45)] bg-white/70 text-[var(--accent)]">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
              <path d="M4 4h14l-1.5 10.5a2 2 0 01-2 1.5H7.5a2 2 0 01-2-1.5L4 4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
              <path d="M8 4V3a3 3 0 016 0v1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[var(--accent)] px-1 text-[10px] font-bold text-white">
              {count}
            </span>
          </div>
          <div className="text-left">
            <p className="text-[10px] uppercase tracking-[0.28em] text-[rgba(15,23,42,0.52)]">View order</p>
            <p className="mt-0.5 text-sm font-medium text-[var(--text-primary)]">{count} {count === 1 ? 'item' : 'items'}</p>
          </div>
        </div>
        <div className="text-right">
          {pricing?.hasDiscount && (
            <p className="text-[11px] text-[rgba(15,23,42,0.45)] line-through">₹{pricing.subtotal}</p>
          )}
          <p className="font-display text-2xl font-semibold text-[var(--accent)]">₹{pricing.total}</p>
        </div>
      </button>
    </div>
  )
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function MenuPage() {
  const [searchParams] = useSearchParams()
  const tableNumber = searchParams.get('table') || '1'
  const { settings } = useSettings()
  const { cartCount, cartTotal } = useCart()

  const cartPricing = useMemo(() => getOrderPricing(cartTotal, settings), [cartTotal, settings])

  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [filter, setFilter] = useState('all')
  const [showFilterMenu, setShowFilterMenu] = useState(false)
  const [cartFlash, setCartFlash] = useState(false)

  const previousCount = useRef(cartCount)
  const searchRef = useRef(null)
  const sectionRefs = useRef({})

  // ── FIX 1: Scroll to top on mount ──────────────────────────────────────────
  useEffect(() => {
    window.scrollTo(0, 0)
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }
  }, [])

  useEffect(() => {
    const load = async () => {
      try {
        if (settings?.googleScriptUrl) {
          const remote = await fetchMenuFromSheets(settings.googleScriptUrl)
          if (remote?.length) {
            setMenuItems(remote)
            setLoading(false)
            return
          }
        }
      } catch { /* fall through */ }
      const local = getMenuItems()
      setMenuItems(local?.length ? local : defaultMenu)
      setLoading(false)
    }
    load()
  }, [settings])

  useEffect(() => {
    if (showSearch) searchRef.current?.focus()
  }, [showSearch])

  useEffect(() => {
    if (cartCount > previousCount.current) {
      setCartFlash(true)
      const timer = window.setTimeout(() => setCartFlash(false), 900)
      previousCount.current = cartCount
      return () => window.clearTimeout(timer)
    }
    previousCount.current = cartCount
    return undefined
  }, [cartCount])

  useEffect(() => {
    if (searchQuery || filter !== 'all' || activeCategory === 'All') return
    sectionRefs.current[activeCategory]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [activeCategory, searchQuery, filter])

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(menuItems.map(item => item.category).filter(Boolean)))],
    [menuItems],
  )

  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      if (item.available === false) return false
      const matchCat = activeCategory === 'All' || item.category === activeCategory
      const query = searchQuery.trim().toLowerCase()
      const matchSearch = !query || item.name?.toLowerCase().includes(query) || item.description?.toLowerCase().includes(query)
      const matchFilter = filter === 'all' || (filter === 'veg' ? item.isVeg : !item.isVeg)
      return matchCat && matchSearch && matchFilter
    })
  }, [menuItems, activeCategory, searchQuery, filter])

  const catCounts = useMemo(() => {
    const map = {}
    menuItems.forEach(item => {
      const key = item.category || 'Other'
      map[key] = (map[key] || 0) + 1
    })
    return map
  }, [menuItems])

  if (loading) return <LoadingSpinner message="Curating the menu..." />

  const shouldShowSections = !searchQuery && filter === 'all'

  const handleBrowseMenu = () => {
    const target = document.getElementById('menu-by-course')
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="menu-page min-h-dvh" style={{ paddingBottom: cartCount > 0 ? 118 : 36 }}>
      <HeroSection
        onBrowseMenu={handleBrowseMenu}
        onOpenCart={() => setCartOpen(true)}
        cartCount={cartCount}
        cartTotal={cartTotal}
      />

      <main className="mx-auto max-w-7xl px-4 pb-10 pt-4 md:px-6 lg:px-8">
        <section className="section-fade-enter mt-7" style={{ animationDelay: '120ms' }} id="menu-by-course">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] uppercase tracking-[0.38em] text-[rgba(245,240,232,0.46)]">Menu by course</p>
              <h2 className="mt-2 font-display text-4xl font-semibold text-[var(--text-primary)]">
                Choose your course, then linger.
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Search button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowSearch(v => !v)}
                  className={`flex h-12 items-center gap-2 rounded-full border px-4 text-xs uppercase tracking-[0.22em] ${showSearch ? 'border-[rgba(201,168,76,0.34)] bg-[rgba(201,168,76,0.08)] text-[var(--gold-light)]' : 'border-[rgba(201,168,76,0.18)] bg-[rgba(255,255,255,0.02)] text-[rgba(245,240,232,0.7)]'}`}
                  aria-label="Search menu"
                >
                  <SearchIcon /> Search
                </button>
              </div>

              {/* Filter button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowFilterMenu(v => !v)}
                  className={`flex h-12 items-center gap-2 rounded-full border px-4 text-xs uppercase tracking-[0.22em] ${filter !== 'all' ? 'border-[rgba(201,168,76,0.34)] bg-[rgba(201,168,76,0.08)] text-[var(--gold-light)]' : 'border-[rgba(201,168,76,0.18)] bg-[rgba(255,255,255,0.02)] text-[rgba(245,240,232,0.7)]'}`}
                  aria-label="Filter options"
                >
                  <FilterIcon />
                  {filter === 'veg' ? 'Veg' : filter === 'nonveg' ? 'Non-Veg' : 'Filter'}
                </button>

                {showFilterMenu && (
                  <>
                    <div className="fixed inset-0 z-20" onClick={() => setShowFilterMenu(false)} />
                    <div className="absolute right-0 top-14 z-30 w-44 overflow-hidden rounded-[20px] border border-[rgba(201,168,76,0.16)] bg-[rgba(15,15,15,0.96)] shadow-[0_28px_80px_rgba(0,0,0,0.32)] backdrop-blur-xl">
                      {[{ id: 'all', label: 'All Items' }, { id: 'veg', label: 'Veg Only' }, { id: 'nonveg', label: 'Non-Veg' }].map(entry => (
                        <button
                          key={entry.id}
                          type="button"
                          className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm transition-colors hover:bg-[rgba(201,168,76,0.08)] ${filter === entry.id ? 'text-[var(--gold-light)]' : 'text-[rgba(245,240,232,0.72)]'}`}
                          onClick={() => { setFilter(entry.id); setShowFilterMenu(false) }}
                        >
                          <span>{entry.label}</span>
                          {filter === entry.id && <span className="text-[var(--gold-light)]">•</span>}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {showSearch && (
            <div className="mt-4">
              <div className="relative">
                <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[rgba(245,240,232,0.42)]">
                  <SearchIcon />
                </div>
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search dishes, ingredients, or moods"
                  className="input-field h-14 rounded-full pl-12 pr-14"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(201,168,76,0.22)] text-[var(--gold-light)]"
                    aria-label="Clear search"
                  >×</button>
                )}
              </div>
            </div>
          )}

          {(searchQuery || filter !== 'all') && (
            <div className="mt-4 flex items-center justify-between border-t border-[rgba(201,168,76,0.14)] pt-4">
              <p className="text-sm text-[rgba(245,240,232,0.72)]">
                <span className="font-medium text-[var(--text-primary)]">{filteredItems.length}</span> dishes
                {searchQuery && <span> for <span className="text-[var(--gold-light)]">"{searchQuery}"</span></span>}
              </p>
              <button type="button" onClick={() => { setSearchQuery(''); setFilter('all') }} className="text-xs uppercase tracking-[0.22em] text-[var(--gold-light)]">
                Clear
              </button>
            </div>
          )}
        </section>

        <section className="mt-6">
          <div className="mb-4">
            <CategoryTabs categories={categories} activeCategory={activeCategory} onChange={setActiveCategory} counts={catCounts} />
          </div>

          {shouldShowSections ? (
            <div className="space-y-10">
              {categories.filter(cat => cat !== 'All').map((category, index) => {
                const categoryItems = menuItems.filter(item => item.available !== false && item.category === category)
                if (!categoryItems.length) return null
                return (
                  <section
                    key={category}
                    ref={node => { if (node) sectionRefs.current[category] = node }}
                    id={`section-${category}`}
                    className="section-fade-enter rounded-[30px] border border-[rgba(201,168,76,0.12)] bg-[rgba(20,20,20,0.94)] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-sm"
                    style={{ animationDelay: `${120 + index * 80}ms` }}
                  >
                    <div className="flex flex-col gap-3 border-b border-[rgba(201,168,76,0.1)] pb-4 md:flex-row md:items-end md:justify-between">
                      <div className="max-w-xl">
                        <p className="text-[10px] uppercase tracking-[0.38em] text-[rgba(245,240,232,0.4)]">{String(index + 1).padStart(2, '0')}</p>
                        <h3 className="mt-1 font-display text-3xl font-semibold text-[var(--text-primary)]">
                          {CATEGORY_LABELS[category] || category}
                        </h3>
                        <p className="mt-1 text-sm text-[rgba(245,240,232,0.66)]">
                          {category === 'Starters' && 'Begin with something bright, crisp, and memorable.'}
                          {category === 'Mains' && 'The heart of the meal, composed with depth and warmth.'}
                          {category === 'Breads' && 'Freshly made accompaniments to complete the table.'}
                          {category === 'Rice' && 'Fragrant, rich, and layered for a satisfying finish.'}
                          {category === 'Desserts' && 'A final note that lands softly and lingers.'}
                          {category === 'Drinks' && 'Cooling pours and refreshing pairings for the table.'}
                        </p>
                      </div>
                      <div className="inline-flex items-center gap-2 rounded-full bg-[rgba(201,168,76,0.08)] px-3 py-2 text-[10px] uppercase tracking-[0.24em] text-[var(--gold-light)]">
                        <SparkIcon /> {categoryItems.length} dishes
                      </div>
                    </div>
                    <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {categoryItems.map((item, itemIndex) => (
                        <div key={item.id} className="section-fade-enter" style={{ animationDelay: `${180 + itemIndex * 50}ms`, animationFillMode: 'both' }}>
                          <MenuCard item={item} />
                        </div>
                      ))}
                    </div>
                  </section>
                )
              })}
            </div>
          ) : (
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredItems.map((item, index) => (
                <div key={item.id || index} className="section-fade-enter" style={{ animationDelay: `${Math.min(index, 8) * 70}ms`, animationFillMode: 'both' }}>
                  <MenuCard item={item} />
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <CartCTA count={cartCount} pricing={cartPricing} onClick={() => setCartOpen(true)} pulse={cartFlash} />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  )
}