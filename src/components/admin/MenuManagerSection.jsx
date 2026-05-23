import React, { useState, useEffect } from 'react';
import { useSettings } from '../../utils/SettingsContext';
import { defaultMenu } from '../../data/defaultMenu';
import { fetchMenuFromSheets } from '../../utils/orderSubmit';
import { getMenuItems, saveMenuItems } from '../../utils/storage';
import { useToast } from '../Toast';

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M11.5 2.5a1.5 1.5 0 012.1 2.1L5 13.2l-3 .8.8-3L11.5 2.5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
  </svg>
);
const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M2.5 4h11M5 4V2.5a.5.5 0 01.5-.5h5a.5.5 0 01.5.5V4M6 7v5M10 7v5M4 4l.8 9a.5.5 0 00.5.5h5.4a.5.5 0 00.5-.5L12 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const EMPTY_ITEM = { name: '', price: '', category: '', description: '', isVeg: true, available: true, image: '' };

function MenuItemModal({ item, onSave, onClose }) {
  const [form, setForm] = useState(item || EMPTY_ITEM);
  const isNew = !item?.id;

  const handleChange = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price) return;
    onSave({ ...form, id: form.id || Date.now(), price: Number(form.price) });
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose} />
      <div
        className="fixed inset-x-4 top-1/2 z-[60] mx-auto max-w-md -translate-y-1/2 overflow-hidden rounded-[28px] border border-[rgba(201,168,76,0.16)] bg-[rgba(14,14,14,0.98)] shadow-[0_30px_90px_rgba(0,0,0,0.6)]"
        style={{ animation: 'scaleIn 0.3s cubic-bezier(0.34,1.2,0.64,1) both' }}
      >
        <div className="flex items-center justify-between border-b border-[rgba(201,168,76,0.12)] px-6 py-4">
          <div>
            <h3 className="font-display text-2xl font-semibold text-[var(--text-primary)]">{isNew ? 'Add New Dish' : 'Edit Dish'}</h3>
            <p className="text-xs uppercase tracking-[0.2em] text-[rgba(245,240,232,0.5)]">{isNew ? 'Fill in the details below' : 'Update dish information'}</p>
          </div>
          <button onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(201,168,76,0.14)] bg-[rgba(255,255,255,0.02)] text-[var(--text-primary)] transition-colors hover:bg-[rgba(201,168,76,0.08)]">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 4l8 8M12 4L4 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto px-6 py-5" style={{ maxHeight: '60vh' }}>
          <div>
            <label className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-[rgba(245,240,232,0.58)]">Dish Name *</label>
            <input className="input-field" value={form.name} onChange={(e) => handleChange('name', e.target.value)} placeholder="e.g. Butter Chicken" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-[rgba(245,240,232,0.58)]">Price (₹) *</label>
              <input className="input-field" type="number" min="0" value={form.price} onChange={(e) => handleChange('price', e.target.value)} placeholder="299" required />
            </div>
            <div>
              <label className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-[rgba(245,240,232,0.58)]">Category</label>
              <input className="input-field" value={form.category} onChange={(e) => handleChange('category', e.target.value)} placeholder="Mains" />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-[rgba(245,240,232,0.58)]">Description</label>
            <textarea className="input-field resize-none" rows={2} value={form.description} onChange={(e) => handleChange('description', e.target.value)} placeholder="Short description of the dish..." />
          </div>
          <div>
            <label className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-[rgba(245,240,232,0.58)]">Image URL</label>
            <input className="input-field" value={form.image} onChange={(e) => handleChange('image', e.target.value)} placeholder="https://..." />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <label className="text-xs uppercase tracking-[0.18em] text-[rgba(245,240,232,0.72)]">Veg</label>
              <label className="toggle-switch">
                <input type="checkbox" checked={form.isVeg} onChange={(e) => handleChange('isVeg', e.target.checked)} />
                <span className="toggle-slider" />
              </label>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-xs uppercase tracking-[0.18em] text-[rgba(245,240,232,0.72)]">Available</label>
              <label className="toggle-switch">
                <input type="checkbox" checked={form.available !== false} onChange={(e) => handleChange('available', e.target.checked)} />
                <span className="toggle-slider" />
              </label>
            </div>
          </div>
        </form>

        <div className="flex gap-3 border-t border-[rgba(201,168,76,0.1)] px-6 py-4">
          <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button onClick={handleSubmit} className="btn-primary flex-1">
            {isNew ? 'Add Dish' : 'Save Changes'}
          </button>
        </div>
      </div>
    </>
  );
}

export default function MenuManagerSection() {
  const { settings } = useSettings();
  const addToast = useToast();
  const [items, setItems] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        if (settings?.googleScriptUrl) {
          const remote = await fetchMenuFromSheets(settings.googleScriptUrl);
          if (remote?.length) {
            setItems(remote);
            return;
          }
        }
      } catch (_) {
        /* fall through */
      }
      const local = getMenuItems();
      setItems(local?.length ? local : defaultMenu);
    };
    load();
  }, [settings]);

  const categories = ['All', ...Array.from(new Set(items.map((i) => i.category).filter(Boolean)))];

  const filtered = items.filter((item) => {
    const matchCat = activeCategory === 'All' || item.category === activeCategory;
    const matchSearch = !searchQuery || item.name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleSave = async (item) => {
    let updated;
    if (item.id && items.find((i) => i.id === item.id)) {
      updated = items.map((i) => (i.id === item.id ? item : i));
    } else {
      updated = [...items, item];
    }
    setItems(updated);
    saveMenuItems(updated);
    setShowModal(false);
    setEditItem(null);
    addToast({ type: 'success', message: `${item.name} saved successfully` });

    if (settings?.googleScriptUrl) {
      setSaving(true);
      try {
        await fetch(settings.googleScriptUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'updateMenu', items: updated }),
        });
      } catch (_) {}
      setSaving(false);
    }
  };

  const handleToggleAvailable = async (id) => {
    const updated = items.map((i) => i.id === id ? { ...i, available: !i.available } : i);
    setItems(updated);
    saveMenuItems(updated);
    if (settings?.googleScriptUrl) {
      try {
        await fetch(settings.googleScriptUrl, {
          method: 'POST', mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'updateMenu', items: updated }),
        });
      } catch (_) {}
    }
  };

  const handleDelete = (id) => {
    const updated = items.filter((i) => i.id !== id);
    setItems(updated);
    saveMenuItems(updated);
    addToast({ type: 'info', message: 'Item removed' });
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-[rgba(245,240,232,0.6)]">{items.length} total dishes · {items.filter((i) => i.available !== false).length} available</p>
        </div>
        <button
          onClick={() => { setEditItem(null); setShowModal(true); }}
          className="btn-secondary gap-2"
          style={{ paddingTop: 12, paddingBottom: 12 }}
        >
          <PlusIcon /> Add Dish
        </button>
      </div>

      <div className="mb-5 flex flex-wrap gap-3">
        <div className="relative flex-1" style={{ minWidth: 200 }}>
          <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.4" className="text-[rgba(245,240,232,0.48)]" />
            <path d="M11 11l2 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" className="text-[rgba(245,240,232,0.48)]" />
          </svg>
          <input className="input-field pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search dishes..." />
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`category-tab ${activeCategory === cat ? 'active' : ''}`}
              style={{ minHeight: 42 }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-[rgba(245,240,232,0.56)]">
            No dishes found. <button className="font-medium text-[var(--gold-light)]" onClick={() => { setEditItem(null); setShowModal(true); }}>Add one?</button>
          </div>
        )}
        {filtered.map((item, idx) => (
          <div
            key={item.id}
            className="admin-menu-row flex items-center gap-4 rounded-[22px] p-4"
            style={{ animation: `fadeUp 0.35s ease ${idx * 40}ms both` }}
          >
            <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl border border-[rgba(201,168,76,0.12)] bg-[rgba(201,168,76,0.06)]">
              {item.image ? (
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="rgba(201,168,76,0.3)">
                    <circle cx="12" cy="12" r="8" stroke="rgba(201,168,76,0.3)" strokeWidth="1.5" fill="none" />
                  </svg>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="truncate text-sm font-medium text-[var(--text-primary)]">{item.name}</h4>
                <span className={`rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] ${item.isVeg ? 'border-[rgba(201,168,76,0.18)] text-[var(--gold-light)]' : 'border-[rgba(201,168,76,0.18)] text-[rgba(245,240,232,0.82)]'}`}>
                  {item.isVeg ? 'Veg' : 'Non-Veg'}
                </span>
              </div>
              <p className="mt-0.5 truncate text-xs text-[rgba(245,240,232,0.54)]">{item.category} {item.description && `· ${item.description.substring(0, 40)}${item.description.length > 40 ? '...' : ''}`}</p>
              <p className="mt-1 text-sm font-semibold text-[var(--gold-light)]">₹{item.price}</p>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="flex flex-col items-center gap-1">
                <label className="toggle-switch" style={{ width: 44, height: 24 }}>
                  <input
                    type="checkbox"
                    checked={item.available !== false}
                    onChange={() => handleToggleAvailable(item.id)}
                  />
                  <span className="toggle-slider" style={{ borderRadius: 12 }} />
                </label>
                <span className="text-[9px] font-medium uppercase tracking-[0.12em] text-[rgba(245,240,232,0.46)]">{item.available !== false ? 'On' : 'Off'}</span>
              </div>

              <button
                onClick={() => { setEditItem(item); setShowModal(true); }}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-[rgba(201,168,76,0.14)] bg-[rgba(255,255,255,0.02)] text-[var(--gold-light)] transition-colors hover:bg-[rgba(201,168,76,0.08)]"
                aria-label={`Edit ${item.name}`}
              >
                <EditIcon />
              </button>

              <button
                onClick={() => handleDelete(item.id)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-[rgba(220,80,80,0.14)] bg-[rgba(220,80,80,0.06)] text-[rgba(245,240,232,0.9)] transition-colors hover:bg-[rgba(220,80,80,0.12)]"
                aria-label={`Delete ${item.name}`}
              >
                <TrashIcon />
              </button>
            </div>
          </div>
        ))}
      </div>

      {saving && (
        <div className="fixed bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-[rgba(201,168,76,0.16)] bg-[rgba(10,10,10,0.95)] px-4 py-2.5 text-sm text-[var(--text-primary)] shadow-[0_18px_48px_rgba(0,0,0,0.4)]">
          <div className="h-4 w-4 rounded-full border-2 border-[rgba(201,168,76,0.24)] border-t-[var(--gold-light)] animate-spin" />
          Saving changes...
        </div>
      )}

      {showModal && (
        <MenuItemModal
          item={editItem}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditItem(null); }}
        />
      )}
    </div>
  );
}