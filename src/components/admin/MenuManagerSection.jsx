import { useState } from 'react'
import { CATEGORIES } from '../../data/defaultMenu'
import { getMenuItems, saveMenuItems } from '../../utils/storage'
import { formatPrice } from '../../utils/format'
import Toast from '../Toast'

const emptyItem = {
  name: '',
  category: 'Starters',
  description: '',
  price: '',
  image: '',
  available: true,
}

export default function MenuManagerSection() {
  const [items, setItems] = useState(getMenuItems)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyItem)
  const [showForm, setShowForm] = useState(false)
  const [toast, setToast] = useState(null)
  const [settings] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('restaurant_settings') || '{}')
    } catch {
      return {}
    }
  })
  const currency = settings.currencySymbol || '₹'

  const persist = (next) => {
    setItems(next)
    saveMenuItems(next)
  }

  const openAdd = () => {
    setEditing(null)
    setForm(emptyItem)
    setShowForm(true)
  }

  const openEdit = (item) => {
    setEditing(item.id)
    setForm({ ...item, price: String(item.price) })
    setShowForm(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const payload = {
      ...form,
      price: Number(form.price),
      id: editing || crypto.randomUUID(),
    }

    let next
    if (editing) {
      next = items.map((i) => (i.id === editing ? payload : i))
    } else {
      next = [...items, payload]
    }
    persist(next)
    setShowForm(false)
    setForm(emptyItem)
    setEditing(null)
    setToast({ message: editing ? 'Item updated!' : 'Item added!', type: 'success' })
  }

  const handleDelete = (id) => {
    if (!confirm('Delete this menu item?')) return
    persist(items.filter((i) => i.id !== id))
    setToast({ message: 'Item deleted', type: 'info' })
  }

  const toggleAvailable = (id) => {
    persist(items.map((i) => (i.id === id ? { ...i, available: !i.available } : i)))
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-2xl font-bold text-charcoal">Menu Manager</h2>
          <p className="mt-1 text-sm text-charcoal/60">{items.length} items total</p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="min-h-12 rounded-xl bg-saffron px-5 font-semibold text-white"
        >
          + Add New Item
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 rounded-2xl border border-charcoal/10 bg-cream p-5"
        >
          <h3 className="font-heading text-lg font-semibold">
            {editing ? 'Edit Item' : 'Add New Item'}
          </h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="text-sm font-medium">Item Name</span>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1 min-h-12 w-full rounded-xl border bg-white px-4"
              />
            </label>
            <label>
              <span className="text-sm font-medium">Category</span>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="mt-1 min-h-12 w-full rounded-xl border bg-white px-4"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className="text-sm font-medium">Price</span>
              <input
                required
                type="number"
                min="0"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="mt-1 min-h-12 w-full rounded-xl border bg-white px-4"
              />
            </label>
            <label className="sm:col-span-2">
              <span className="text-sm font-medium">Description</span>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={2}
                className="mt-1 w-full rounded-xl border bg-white px-4 py-3"
              />
            </label>
            <label className="sm:col-span-2">
              <span className="text-sm font-medium">Image URL</span>
              <input
                required
                type="url"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                className="mt-1 min-h-12 w-full rounded-xl border bg-white px-4"
              />
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={form.available}
                onChange={(e) => setForm({ ...form, available: e.target.checked })}
                className="h-5 w-5 accent-saffron"
              />
              <span className="text-sm font-medium">Available on menu</span>
            </label>
          </div>
          <div className="mt-4 flex gap-3">
            <button type="submit" className="min-h-12 rounded-xl bg-saffron px-6 font-semibold text-white">
              {editing ? 'Update' : 'Add'} Item
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="min-h-12 rounded-xl border px-6 font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <ul className="mt-6 space-y-4">
        {items.map((item) => (
          <li
            key={item.id}
            className={`flex gap-4 rounded-2xl border bg-white p-4 shadow-sm ${!item.available ? 'opacity-60' : ''}`}
          >
            <img
              src={item.image}
              alt=""
              className="h-20 w-20 shrink-0 rounded-xl object-cover"
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h4 className="font-semibold text-charcoal">{item.name}</h4>
                  <p className="text-xs text-charcoal/50">{item.category}</p>
                </div>
                <span className="font-bold text-saffron">
                  {formatPrice(item.price, currency)}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={item.available}
                    onChange={() => toggleAvailable(item.id)}
                    className="accent-saffron"
                  />
                  Available
                </label>
                <button
                  type="button"
                  onClick={() => openEdit(item)}
                  className="rounded-lg bg-cream px-3 py-1.5 text-sm font-medium"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="rounded-lg bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  )
}
