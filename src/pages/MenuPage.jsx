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

const SECTION_IMAGES = {
  Starters: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
  Mains: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80',
  Breads: 'https://images.unsplash.com/photo-1627308595216-3f62a8f7d8b0?auto=format&fit=crop&w=1200&q=80',
  Rice: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d1c?auto=format&fit=crop&w=1200&q=80',
  Desserts: 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=1200&q=80',
  Drinks: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=1200&q=80',
  All: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80',
}

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

function HeroSection({ onBrowseMenu, onOpenCart, cartCount, cartTotal }) {
  const [searchParams] = useSearchParams()
  const tableNumber = searchParams.get('table') || '1'

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Jost:wght@300;400;500&display=swap');
        .hero-wrap { background: #0d0d0d; min-height: 100vh; width: 100%; font-family: 'Jost', sans-serif; color: #F5F0E8; overflow: hidden; }
        .hero-grid { display: grid; grid-template-columns: 1fr 1fr; min-height: calc(100vh - 64px); }
        .hero-left { padding: 2.5rem; display: flex; flex-direction: column; justify-content: space-between; border-right: 0.5px solid rgba(201,168,76,0.2); }
        .hero-right { display: flex; flex-direction: column; }
        .top-bar { display: flex; align-items: center; justify-content: space-between; }
        .logo-row { display: flex; align-items: center; gap: 12px; }
        .logo-circle { width: 38px; height: 38px; border-radius: 50%; border: 1px solid rgba(201,168,76,0.5); overflow: hidden; }
        .logo-circle img { width: 100%; height: 100%; object-fit: cover; }
        .restaurant-name { font-family: 'Cormorant Garamond', serif; font-size: 15px; letter-spacing: 0.12em; color: #F5F0E8; }
        .table-badge { font-size: 11px; letter-spacing: 0.18em; color: #C9A84C; border: 0.5px solid rgba(201,168,76,0.4); padding: 5px 14px; border-radius: 20px; }
        .hero-main { flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 3rem 0 2rem; }
        .offer-label { font-size: 11px; letter-spacing: 0.2em; color: #888; text-transform: uppercase; margin-bottom: 1.2rem; }
        .hero-heading { font-family: 'Cormorant Garamond', serif; font-size: clamp(3rem, 5vw, 5rem); font-weight: 400; line-height: 1.05; color: #F5F0E8; margin: 0 0 1.5rem; }
        .hero-heading span { color: #C9A84C; font-style: italic; }
        .hero-sub { font-size: 14px; color: #888; font-weight: 300; letter-spacing: 0.04em; margin-bottom: 2.5rem; line-height: 1.7; max-width: 340px; }
        .btn-row { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
        .btn-primary { background: #C9A84C; color: #0d0d0d; border: none; padding: 14px 28px; font-family: 'Jost', sans-serif; font-size: 13px; letter-spacing: 0.14em; text-transform: uppercase; cursor: pointer; border-radius: 2px; font-weight: 500; transition: background 0.25s; }
        .btn-primary:hover { background: #E8D5A3; }
        .btn-secondary { background: transparent; color: #F5F0E8; border: 0.5px solid rgba(245,240,232,0.3); padding: 14px 28px; font-family: 'Jost', sans-serif; font-size: 13px; letter-spacing: 0.14em; text-transform: uppercase; cursor: pointer; border-radius: 2px; transition: all 0.25s; }
        .btn-secondary:hover { border-color: rgba(201,168,76,0.6); color: #C9A84C; }
        .gold-line { width: 48px; height: 1px; background: #C9A84C; margin-bottom: 1.5rem; }
        .hero-right-top { flex: 1.2; overflow: hidden; }
        .hero-right-top img { width: 100%; height: 100%; object-fit: cover; filter: brightness(0.75) contrast(1.05); }
        .hero-right-bottom { flex: 1; background: #161616; padding: 2rem 2.5rem; display: flex; flex-direction: column; justify-content: center; border-top: 0.5px solid rgba(201,168,76,0.15); }
        .featured-label { font-size: 10px; letter-spacing: 0.22em; color: #C9A84C; text-transform: uppercase; margin-bottom: 0.8rem; }
        .featured-name { font-family: 'Cormorant Garamond', serif; font-size: 2rem; font-weight: 400; color: #F5F0E8; margin: 0 0 0.5rem; }
        .featured-desc { font-size: 13px; color: #888; font-weight: 300; margin-bottom: 1.2rem; line-height: 1.6; }
        .featured-footer { display: flex; align-items: center; justify-content: space-between; }
        .featured-price { font-family: 'Cormorant Garamond', serif; font-size: 1.6rem; color: #C9A84C; }
        .badge-tag { font-size: 10px; letter-spacing: 0.15em; color: #C9A84C; border: 0.5px solid rgba(201,168,76,0.4); padding: 4px 12px; border-radius: 2px; }
        .cart-bar { background: #1a1a1a; border-top: 0.5px solid rgba(201,168,76,0.25); padding: 1rem 2.5rem; display: flex; align-items: center; justify-content: space-between; cursor: pointer; }
        .cart-bar:hover { background: #1f1f1f; }
        .cart-left { display: flex; align-items: center; gap: 14px; }
        .cart-icon-wrap { width: 36px; height: 36px; border: 0.5px solid rgba(201,168,76,0.4); border-radius: 50%; display: flex; align-items: center; justify-content: center; }
        .cart-text { font-size: 13px; color: #F5F0E8; margin: 0; }
        .cart-count { font-size: 11px; color: #888; margin: 4px 0 0; }
        .cart-total { font-family: 'Cormorant Garamond', serif; font-size: 1.4rem; color: #C9A84C; }
        .stats-row { display: flex; gap: 2.5rem; padding-top: 1.5rem; border-top: 0.5px solid rgba(255,255,255,0.08); }
        .stat-divider { width: 0.5px; background: rgba(255,255,255,0.08); }
        .stat-num { font-family: 'Cormorant Garamond', serif; font-size: 1.6rem; color: #C9A84C; margin: 0; }
        .stat-label { font-size: 11px; color: #888; letter-spacing: 0.1em; margin: 4px 0 0; }
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr; }
          .hero-right { display: none; }
        }
      `}</style>

      <div className="hero-wrap">
        <div className="hero-grid">
          <div className="hero-left">
            <div className="top-bar">
              <div className="logo-row">
                <div className="logo-circle">
                  <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=80&q=80" alt="restaurant logo" />
                </div>
                <span className="restaurant-name">Zafran</span>
              </div>
              <span className="table-badge">TABLE {tableNumber}</span>
            </div>

            <div className="hero-main">
              <div className="gold-line" />
              <p className="offer-label">Today's Special</p>
              <h1 className="hero-heading">
                Every dish,<br />a <span>story</span><br />on your plate.
              </h1>
              <p className="hero-sub">
                Handcrafted flavours rooted in tradition. Discover our curated menu and order directly from your table.
              </p>
              <div className="btn-row">
                <button className="btn-primary" onClick={onBrowseMenu}>
                  Browse Menu →
                </button>
                <button className="btn-secondary" type="button" onClick={onBrowseMenu}>
                  Chef&apos;s Picks
                </button>
              </div>
            </div>

            <div className="stats-row">
              <div>
                <p className="stat-num">48+</p>
                <p className="stat-label">Dishes</p>
              </div>
              <div className="stat-divider" />
              <div>
                <p className="stat-num">5</p>
                <p className="stat-label">Categories</p>
              </div>
              <div className="stat-divider" />
              <div>
                <p className="stat-num">30yr</p>
                <p className="stat-label">Heritage</p>
              </div>
            </div>
          </div>

          <div className="hero-right">
            <div className="hero-right-top">
              <img
                src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=800&q=85"
                alt="featured dish"
              />
            </div>
            <div className="hero-right-bottom">
              <p className="featured-label">Tempting Choice</p>
              <h2 className="featured-name">Paneer Tikka</h2>
              <p className="featured-desc">
                Cottage cheese marinated in spiced yogurt, slow-grilled to perfection over charcoal.
              </p>
              <div className="featured-footer">
                <span className="featured-price">₹249</span>
                <span className="badge-tag">+ Best Seller</span>
              </div>
            </div>
          </div>
        </div>

        {cartCount > 0 && (
          <div className="cart-bar" onClick={onOpenCart}>
            <div className="cart-left">
              <div className="cart-icon-wrap">🛍</div>
              <div>
                <p className="cart-text">View Order</p>
                <p className="cart-count">{cartCount} item{cartCount > 1 ? 's' : ''}</p>
              </div>
            </div>
            <span className="cart-total">₹{cartTotal}</span>
          </div>
        )}
      </div>
    </>
  )
}

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
      } catch {
        /* fall through */
      }

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
    () => ['All', ...Array.from(new Set(menuItems.map((item) => item.category).filter(Boolean)))],
    [menuItems],
  )

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      if (item.available === false) return false

      const matchCat = activeCategory === 'All' || item.category === activeCategory
      const query = searchQuery.trim().toLowerCase()
      const matchSearch =
        !query ||
        item.name?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query)
      const matchFilter = filter === 'all' || (filter === 'veg' ? item.isVeg : !item.isVeg)

      return matchCat && matchSearch && matchFilter
    })
  }, [menuItems, activeCategory, searchQuery, filter])

  const catCounts = useMemo(() => {
    const map = {}
    menuItems.forEach((item) => {
      const key = item.category || 'Other'
      map[key] = (map[key] || 0) + 1
    })
    return map
  }, [menuItems])

  if (loading) return <LoadingSpinner message="Curating the menu..." />

  const shouldShowSections = !searchQuery && filter === 'all'
  const handleBrowseMenu = () => {
    const firstSection = sectionRefs.current[activeCategory === 'All' ? categories[1] : activeCategory]
    firstSection?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="menu-page min-h-dvh pb-28" style={{ paddingBottom: cartCount > 0 ? 118 : 36 }}>
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
              <h2 className="mt-2 font-display text-4xl font-semibold text-[var(--text-primary)]">Choose your course, then linger.</h2>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowSearch((value) => !value)}
                  className={`flex h-12 items-center gap-2 rounded-full border px-4 text-xs uppercase tracking-[0.22em] ${showSearch ? 'border-[rgba(201,168,76,0.34)] bg-[rgba(201,168,76,0.08)] text-[var(--gold-light)]' : 'border-[rgba(201,168,76,0.18)] bg-[rgba(255,255,255,0.02)] text-[rgba(245,240,232,0.7)]'}`}
                  aria-label="Search menu"
                >
                  <SearchIcon /> Search
                </button>
              </div>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowFilterMenu((value) => !value)}
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
                      {[
                        { id: 'all', label: 'All Items' },
                        { id: 'veg', label: 'Veg Only' },
                        { id: 'nonveg', label: 'Non-Veg' },
                      ].map((entry) => (
                        <button
                          key={entry.id}
                          type="button"
                          className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm transition-colors hover:bg-[rgba(201,168,76,0.08)] ${filter === entry.id ? 'text-[var(--gold-light)]' : 'text-[rgba(245,240,232,0.72)]'}`}
                          onClick={() => {
                            setFilter(entry.id)
                            setShowFilterMenu(false)
                          }}
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
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search dishes, ingredients, or moods"
                  className="input-field h-14 rounded-full pl-12 pr-14"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(201,168,76,0.22)] text-[var(--gold-light)]"
                    aria-label="Clear search"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          )}

          {(searchQuery || filter !== 'all') && (
            <div className="mt-4 flex items-center justify-between border-t border-[rgba(201,168,76,0.14)] pt-4">
              <p className="text-sm text-[rgba(245,240,232,0.72)]">
                <span className="font-medium text-[var(--text-primary)]">{filteredItems.length}</span> dishes
                {searchQuery && (
                  <span>
                    {' '}
                    for <span className="text-[var(--gold-light)]">“{searchQuery}”</span>
                  </span>
                )}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('')
                  setFilter('all')
                }}
                className="text-xs uppercase tracking-[0.22em] text-[var(--gold-light)]"
              >
                Clear
              </button>
            </div>
          )}
        </section>

        <section className="mt-6">
          <div className="mb-4">
            <CategoryTabs
              categories={categories}
              activeCategory={activeCategory}
              onChange={setActiveCategory}
              counts={catCounts}
            />
          </div>

          {shouldShowSections ? (
            <div className="space-y-10">
              {categories
                .filter((category) => category !== 'All')
                .map((category, index) => {
                  const categoryItems = menuItems.filter((item) => item.available !== false && item.category === category)
                  if (!categoryItems.length) return null

                  return (
                    <section
                      key={category}
                      ref={(node) => {
                        if (node) sectionRefs.current[category] = node
                      }}
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
                          <div
                            key={item.id}
                            className="section-fade-enter"
                            style={{ animationDelay: `${180 + itemIndex * 50}ms`, animationFillMode: 'both' }}
                          >
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
                <div
                  key={item.id || index}
                  className="section-fade-enter"
                  style={{ animationDelay: `${Math.min(index, 8) * 70}ms`, animationFillMode: 'both' }}
                >
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