import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import MenuCard from '../components/MenuCard'
import CartDrawer from '../components/CartDrawer'
import OrderConfirmation from '../components/OrderConfirmation'
import Toast from '../components/Toast'
import { CATEGORIES } from '../data/defaultMenu'
import { getMenuItems, getSettings } from '../utils/storage'
import { formatPrice } from '../utils/format'
import { placeOrder } from '../utils/orderSubmit'

export default function MenuPage() {
  const [searchParams] = useSearchParams()
  const tableParam = searchParams.get('table') || '1'
  const tableNumber = tableParam.replace(/\D/g, '') || '1'
  const tableLabel = `Table ${tableNumber}`

  const [settings, setSettings] = useState(getSettings)
  const [menuItems, setMenuItems] = useState(getMenuItems)
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0])
  const [cart, setCart] = useState({})
  const [cartOpen, setCartOpen] = useState(false)
  const [customerName, setCustomerName] = useState('')
  const [specialInstructions, setSpecialInstructions] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [toast, setToast] = useState(null)

  const currencySymbol = settings.currencySymbol || '₹'

  const refreshData = useCallback(() => {
    setSettings(getSettings())
    setMenuItems(getMenuItems())
  }, [])

  useEffect(() => {
    refreshData()
    window.addEventListener('settings-updated', refreshData)
    window.addEventListener('menu-updated', refreshData)
    window.addEventListener('storage', refreshData)
    return () => {
      window.removeEventListener('settings-updated', refreshData)
      window.removeEventListener('menu-updated', refreshData)
      window.removeEventListener('storage', refreshData)
    }
  }, [refreshData])

  const availableItems = useMemo(
    () => menuItems.filter((item) => item.available),
    [menuItems],
  )

  const filteredItems = useMemo(
    () => availableItems.filter((item) => item.category === activeCategory),
    [availableItems, activeCategory],
  )

  const cartArray = useMemo(
    () => Object.entries(cart).map(([id, quantity]) => ({ id, quantity })),
    [cart],
  )

  const { itemCount, subtotal } = useMemo(() => {
    let count = 0
    let total = 0
    for (const [id, qty] of Object.entries(cart)) {
      const item = menuItems.find((m) => m.id === id)
      if (item) {
        count += qty
        total += item.price * qty
      }
    }
    return { itemCount: count, subtotal: total }
  }, [cart, menuItems])

  const addItem = (id) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }))
  }

  const removeItem = (id) => {
    setCart((prev) => {
      const next = { ...prev }
      if (!next[id]) return next
      if (next[id] <= 1) {
        delete next[id]
      } else {
        next[id] -= 1
      }
      return next
    })
  }

  const handlePlaceOrder = async () => {
    if (itemCount === 0 || orderPlaced) return

    setIsSubmitting(true)
    try {
      await placeOrder({
        settings,
        tableLabel,
        customerName,
        cart: cartArray,
        menuItems,
        total: subtotal,
        specialInstructions,
      })

      setOrderPlaced(true)
      setShowConfirmation(true)
      setCartOpen(false)
    } catch {
      setToast({
        message: 'Could not save your order. Please try again or ask staff for help.',
        type: 'error',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNewOrder = () => {
    setCart({})
    setCustomerName('')
    setSpecialInstructions('')
    setOrderPlaced(false)
    setShowConfirmation(false)
  }

  return (
    <div className="min-h-dvh bg-cream pb-28">
      <header className="sticky top-0 z-30 bg-gradient-to-b from-charcoal to-charcoal/95 px-4 pb-5 pt-6 text-white shadow-lg">
        <div className="mx-auto flex max-w-lg items-center gap-4">
          <img
            src={settings.restaurantLogo}
            alt=""
            className="h-14 w-14 rounded-full border-2 border-gold object-cover"
          />
          <div className="min-w-0 flex-1">
            <h1 className="font-heading truncate text-xl font-bold">
              {settings.restaurantName}
            </h1>
            <span className="mt-1 inline-block rounded-full bg-saffron px-3 py-1 text-sm font-semibold">
              You are at {tableLabel}
            </span>
          </div>
        </div>
      </header>

      <nav className="sticky top-[88px] z-20 border-b border-charcoal/10 bg-cream/95 backdrop-blur-sm">
        <div className="scrollbar-hide flex gap-2 overflow-x-auto px-4 py-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors min-h-12 ${
                activeCategory === cat
                  ? 'bg-saffron text-white shadow-md'
                  : 'bg-white text-charcoal shadow-sm'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </nav>

      <main className="mx-auto max-w-lg px-4 py-5">
        <h2 className="font-heading mb-4 text-2xl font-bold text-charcoal">{activeCategory}</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          {filteredItems.length === 0 ? (
            <p className="col-span-full py-12 text-center text-charcoal/50">
              No items in this category
            </p>
          ) : (
            filteredItems.map((item) => (
              <MenuCard
                key={item.id}
                item={item}
                quantity={cart[item.id] || 0}
                onAdd={() => addItem(item.id)}
                onRemove={() => removeItem(item.id)}
                currencySymbol={currencySymbol}
              />
            ))
          )}
        </div>
      </main>

      {itemCount > 0 && !showConfirmation && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-charcoal/10 bg-white px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
          <div className="mx-auto flex max-w-lg items-center gap-4">
            <div className="flex-1">
              <p className="text-sm text-charcoal/60">{itemCount} items</p>
              <p className="text-xl font-bold text-saffron">
                {formatPrice(subtotal, currencySymbol)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="min-h-14 rounded-xl bg-saffron px-8 text-lg font-semibold text-white shadow-lg active:scale-95"
            >
              View Cart
            </button>
          </div>
        </div>
      )}

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cartArray}
        menuItems={menuItems}
        currencySymbol={currencySymbol}
        customerName={customerName}
        setCustomerName={setCustomerName}
        specialInstructions={specialInstructions}
        setSpecialInstructions={setSpecialInstructions}
        subtotal={subtotal}
        itemCount={itemCount}
        onPlaceOrder={handlePlaceOrder}
        isSubmitting={isSubmitting}
        orderPlaced={orderPlaced}
      />

      {showConfirmation && (
        <OrderConfirmation
          tableNumber={tableNumber}
          cart={cartArray}
          menuItems={menuItems}
          total={subtotal}
          currencySymbol={currencySymbol}
          onNewOrder={handleNewOrder}
        />
      )}

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  )
}
