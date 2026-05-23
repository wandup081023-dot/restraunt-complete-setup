import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import MenuCard from '../components/MenuCard';
import CartDrawer from '../components/CartDrawer';
import CategoryTabs from '../components/CategoryTabs';
import LoadingSpinner from '../components/LoadingSpinner';
import { useCart } from '../utils/CartContext';
import { useSettings } from '../utils/SettingsContext';
import { defaultMenu } from '../data/defaultMenu';
import { fetchMenuFromSheets } from '../utils/orderSubmit';
import { getMenuItems } from '../utils/storage';
import { getOrderPricing } from '../utils/pricing';

// ── Icons ──────────────────────────────────────────────
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <circle cx="8" cy="8" r="5.5" stroke="#8B7355" strokeWidth="1.6" />
    <path d="M13 13l2.5 2.5" stroke="#8B7355" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);
const CartBagIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <path d="M4 4h14l-1.5 10.5a2 2 0 01-2 1.5H7.5a2 2 0 01-2-1.5L4 4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M8 4V3a3 3 0 016 0v1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);
const FilterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M2 4h14M5 9h8M8 14h2" stroke="#5A4A3A" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

function CartCTA({ count, pricing, onClick }) {
  if (count === 0) return null;
  return (
    <div className="cart-fab">
      <div className="cart-fab-glow" />
      <button type="button" onClick={onClick} className="cart-fab-btn" aria-label={`View cart, ${count} items`}>
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
            <CartBagIcon />
            <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-white px-1 text-[10px] font-bold text-[#E65C00]">
              {count}
            </span>
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold opacity-90">View cart</p>
            <p className="text-xs opacity-75">{count} {count === 1 ? 'item' : 'items'}</p>
          </div>
        </div>
        <div className="text-right">
          {pricing?.hasDiscount && (
            <p className="text-xs line-through opacity-70">₹{pricing.subtotal}</p>
          )}
          <p className="font-display text-xl font-bold">₹{pricing.total}</p>
        </div>
      </button>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────
export default function MenuPage() {
  const [searchParams] = useSearchParams();
  const tableNumber = searchParams.get('table') || '1';
  const { settings } = useSettings();
  const { cartCount, cartTotal } = useCart();

  const cartPricing = useMemo(
    () => getOrderPricing(cartTotal, settings),
    [cartTotal, settings],
  );

  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [filter, setFilter] = useState('all'); // all | veg | nonveg
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const searchRef = useRef(null);
  // Load menu: Google Sheets → localStorage → default
  useEffect(() => {
    const load = async () => {
      try {
        if (settings?.googleScriptUrl) {
          const remote = await fetchMenuFromSheets(settings.googleScriptUrl);
          if (remote?.length) {
            setMenuItems(remote);
            setLoading(false);
            return;
          }
        }
      } catch (_) {
        /* fall through */
      }
      const local = getMenuItems();
      setMenuItems(local?.length ? local : defaultMenu);
      setLoading(false);
    };
    load();
  }, [settings]);

  useEffect(() => {
    if (showSearch) searchRef.current?.focus();
  }, [showSearch]);

  // Derived
  const categories = useMemo(() => {
    const cats = ['All', ...Array.from(new Set(menuItems.map((i) => i.category).filter(Boolean)))];
    return cats;
  }, [menuItems]);

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      if (item.available === false) return false;
      const matchCat = activeCategory === 'All' || item.category === activeCategory;
      const matchSearch = !searchQuery || item.name?.toLowerCase().includes(searchQuery.toLowerCase()) || item.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchFilter = filter === 'all' || (filter === 'veg' ? item.isVeg : !item.isVeg);
      return matchCat && matchSearch && matchFilter;
    });
  }, [menuItems, activeCategory, searchQuery, filter]);

  const catCounts = useMemo(() => {
    const map = {};
    menuItems.forEach((item) => {
      const c = item.category || 'Other';
      map[c] = (map[c] || 0) + 1;
    });
    return map;
  }, [menuItems]);

  const restaurantName = settings?.restaurantName || 'Spice Garden';
  const restaurantTagline = settings?.tagline || 'Authentic Flavours Since 1994';

  if (loading) return <LoadingSpinner message="Loading menu..." />;

  const logoUrl = settings?.logoUrl || settings?.restaurantLogo;

  return (
    <div className="menu-page" style={{ paddingBottom: cartCount > 0 ? 110 : 32 }}>

      <header className="premium-header px-4 py-3.5">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="logo-ring flex-shrink-0">
              <div className="logo-inner flex items-center justify-center overflow-hidden">
                {logoUrl ? (
                  <img src={logoUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="font-display text-lg font-bold text-[#F7B731]">
                    {restaurantName.charAt(0)}
                  </span>
                )}
              </div>
            </div>
            <div className="min-w-0">
              <h1 className="font-display truncate text-lg font-bold leading-tight text-[#1A1A1A]">
                {restaurantName}
              </h1>
              <p className="truncate text-[11px] text-[#8B7355]">{restaurantTagline}</p>
            </div>
          </div>

          <div className="flex flex-shrink-0 items-center gap-2">
            <div className="table-badge-premium animate-float-badge">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="#F7B731">
                <rect x="1" y="4" width="10" height="6" rx="1" />
                <rect x="3.5" y="2" width="5" height="2.5" rx="0.5" />
              </svg>
              Table {tableNumber}
            </div>
            <button
              type="button"
              onClick={() => setShowSearch(!showSearch)}
              className={`flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-300 ${
                showSearch
                  ? 'border-[#E65C00] bg-[rgba(230,92,0,0.1)]'
                  : 'border-[rgba(230,92,0,0.12)] bg-white shadow-sm hover:border-[#E65C00]'
              }`}
              aria-label="Search menu"
            >
              <SearchIcon />
            </button>
          </div>
        </div>

        {/* Search bar */}
        {showSearch && (
          <div className="max-w-md mx-auto mt-3" style={{ animation: 'fadeUp 0.25s ease both' }}>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <SearchIcon />
              </div>
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dishes..."
                className="input-field pl-10 pr-10"
                style={{ borderRadius: 12 }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#8B7355] flex items-center justify-center"
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="white">
                    <path d="M2 2l6 6M8 2L2 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      <div className="mx-auto max-w-lg px-4">

        {!searchQuery && (
          <div className="hero-premium relative z-[1] mt-4 mb-6">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[rgba(247,183,49,0.15)] blur-2xl" />
            <div className="absolute -bottom-6 right-4 h-24 w-24 rounded-full bg-[rgba(230,92,0,0.2)] blur-xl" />

            <div className="relative z-[2]">
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#F7B731]">
              {cartPricing.offerActive
                ? settings.offerTitle || "Today's Offer"
                : "Today's Special"}
            </p>
            <h2 className="font-display text-white text-2xl font-bold leading-tight mb-2">
              {cartPricing.offerActive && cartPricing.discountPercent > 0 ? (
                <>
                  <span style={{ backgroundImage: 'linear-gradient(135deg, #E65C00, #F7B731)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    {settings.discountPercent}% OFF
                  </span>
                  <br />
                  <span className="text-lg text-white/90">on your order</span>
                </>
              ) : (
                <>
                  Freshly Crafted<br />
                  <span style={{ backgroundImage: 'linear-gradient(135deg, #E65C00, #F7B731)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    For You
                  </span>
                </>
              )}
            </h2>
            <p className="text-[rgba(255,255,255,0.5)] text-xs">
              {cartPricing.offerActive && settings.offerDescription
                ? settings.offerDescription
                : `Explore ${menuItems.filter((i) => i.available !== false).length}+ dishes made with love`}
            </p>
            </div>
          </div>
        )}

        <div className="mb-5 flex items-center gap-2">
          <div className="min-w-0 flex-1">
            <CategoryTabs
              categories={categories}
              activeCategory={activeCategory}
              onChange={setActiveCategory}
              counts={catCounts}
            />
          </div>

          {/* Filter button */}
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className={`flex items-center gap-1.5 px-3 py-2.5 rounded-full border text-sm font-medium transition-all ${
                filter !== 'all'
                  ? 'bg-[rgba(230,92,0,0.1)] border-[rgba(230,92,0,0.3)] text-[#E65C00]'
                  : 'bg-white border-[rgba(230,92,0,0.15)] text-[#5A4A3A]'
              }`}
              style={{ minHeight: 44 }}
              aria-label="Filter options"
            >
              <FilterIcon />
              {filter === 'veg' ? 'Veg' : filter === 'nonveg' ? 'Non-Veg' : 'Filter'}
            </button>

            {showFilterMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowFilterMenu(false)} />
                <div
                  className="absolute right-0 top-12 z-20 bg-white rounded-2xl shadow-lg border border-[rgba(230,92,0,0.1)] overflow-hidden"
                  style={{ minWidth: 160, animation: 'scaleIn 0.2s ease both' }}
                >
                  {[
                    { id: 'all', label: 'All Items', icon: '✦' },
                    { id: 'veg', label: 'Veg Only', icon: '🟢' },
                    { id: 'nonveg', label: 'Non-Veg', icon: '🔴' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 transition-colors hover:bg-[rgba(230,92,0,0.05)] ${filter === f.id ? 'text-[#E65C00] font-semibold bg-[rgba(230,92,0,0.04)]' : 'text-[#1A1A1A]'}`}
                      onClick={() => { setFilter(f.id); setShowFilterMenu(false); }}
                    >
                      <span>{f.icon}</span> {f.label}
                      {filter === f.id && (
                        <svg className="ml-auto" width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M3 7l3 3 5-5" stroke="#E65C00" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── Results header ── */}
        {(searchQuery || filter !== 'all') && (
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-[#5A4A3A]">
              <span className="font-semibold text-[#1A1A1A]">{filteredItems.length}</span> results
              {searchQuery && <span> for "<span className="text-[#E65C00]">{searchQuery}</span>"</span>}
            </p>
            <button
              onClick={() => { setSearchQuery(''); setFilter('all'); }}
              className="text-xs text-[#E65C00] font-medium"
            >
              Clear
            </button>
          </div>
        )}

        {/* ── Menu grid ── */}
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4" style={{ background: 'rgba(230,92,0,0.08)' }}>
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <circle cx="18" cy="18" r="14" stroke="rgba(230,92,0,0.3)" strokeWidth="2" />
                <path d="M12 18h12M18 12v12" stroke="rgba(230,92,0,0.3)" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <p className="font-semibold text-[#1A1A1A] text-base mb-1">No dishes found</p>
            <p className="text-sm text-[#8B7355]">Try a different search or category</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3.5 stagger-children">
            {filteredItems.map((item, idx) => (
              <div
                key={item.id || idx}
                className="animate-fade-up"
                style={{ animationDelay: `${Math.min(idx, 8) * 40}ms`, animationFillMode: 'both' }}
              >
                <MenuCard item={item} />
              </div>
            ))}
          </div>
        )}

        {/* Bottom spacer */}
        <div style={{ height: 80 }} />
      </div>

      {/* ── Cart CTA ── */}
      <CartCTA count={cartCount} pricing={cartPricing} onClick={() => setCartOpen(true)} />

      {/* ── Cart Drawer ── */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}