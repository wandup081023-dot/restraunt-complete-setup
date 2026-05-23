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
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose} />
      <div
        className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-[60] bg-white rounded-2xl shadow-xl max-w-md mx-auto overflow-hidden"
        style={{ animation: 'scaleIn 0.3s cubic-bezier(0.34,1.2,0.64,1) both' }}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[rgba(230,92,0,0.1)] flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-[#1A1A1A] text-lg">{isNew ? 'Add New Dish' : 'Edit Dish'}</h3>
            <p className="text-xs text-[#8B7355]">{isNew ? 'Fill in the details below' : 'Update dish information'}</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full bg-[rgba(26,26,26,0.06)] hover:bg-[rgba(26,26,26,0.1)] transition-colors">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 4l8 8M12 4L4 12" stroke="#1A1A1A" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4 overflow-y-auto" style={{ maxHeight: '60vh' }}>
          <div>
            <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5">Dish Name *</label>
            <input className="input-field" value={form.name} onChange={(e) => handleChange('name', e.target.value)} placeholder="e.g. Butter Chicken" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5">Price (₹) *</label>
              <input className="input-field" type="number" min="0" value={form.price} onChange={(e) => handleChange('price', e.target.value)} placeholder="299" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5">Category</label>
              <input className="input-field" value={form.category} onChange={(e) => handleChange('category', e.target.value)} placeholder="Mains" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5">Description</label>
            <textarea className="input-field resize-none" rows={2} value={form.description} onChange={(e) => handleChange('description', e.target.value)} placeholder="Short description of the dish..." />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5">Image URL</label>
            <input className="input-field" value={form.image} onChange={(e) => handleChange('image', e.target.value)} placeholder="https://..." />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <label className="text-xs font-semibold text-[#1A1A1A]">Veg</label>
              <label className="toggle-switch">
                <input type="checkbox" checked={form.isVeg} onChange={(e) => handleChange('isVeg', e.target.checked)} />
                <span className="toggle-slider" />
              </label>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-xs font-semibold text-[#1A1A1A]">Available</label>
              <label className="toggle-switch">
                <input type="checkbox" checked={form.available !== false} onChange={(e) => handleChange('available', e.target.checked)} />
                <span className="toggle-slider" />
              </label>
            </div>
          </div>
        </form>

        <div className="px-6 py-4 border-t border-[rgba(230,92,0,0.08)] flex gap-3">
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
      {/* Header row */}
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div>
          <p className="text-sm text-[#8B7355]">{items.length} total dishes · {items.filter(i => i.available !== false).length} available</p>
        </div>
        <button
          onClick={() => { setEditItem(null); setShowModal(true); }}
          className="btn-primary gap-2"
          style={{ paddingTop: 12, paddingBottom: 12 }}
        >
          <PlusIcon /> Add Dish
        </button>
      </div>

      {/* Search + Category */}
      <div className="flex gap-3 mb-5 flex-wrap">
        <div className="relative flex-1" style={{ minWidth: 200 }}>
          <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="7" cy="7" r="4.5" stroke="#8B7355" strokeWidth="1.4" />
            <path d="M11 11l2 2" stroke="#8B7355" strokeWidth="1.4" strokeLinecap="round" />
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

      {/* Items list */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-12 text-[#8B7355] text-sm">
            No dishes found. <button className="text-[#E65C00] font-medium" onClick={() => { setEditItem(null); setShowModal(true); }}>Add one?</button>
          </div>
        )}
        {filtered.map((item, idx) => (
          <div
            key={item.id}
            className="admin-menu-row flex items-center gap-4"
            style={{ animation: `fadeUp 0.35s ease ${idx * 40}ms both` }}
          >
            {/* Image */}
            <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0" style={{ background: 'linear-gradient(135deg, #FDECD8, #F7B731)' }}>
              {item.image ? (
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="rgba(230,92,0,0.3)">
                    <circle cx="12" cy="12" r="8" stroke="rgba(230,92,0,0.3)" strokeWidth="1.5" fill="none" />
                  </svg>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-semibold text-[#1A1A1A] text-sm truncate">{item.name}</h4>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${item.isVeg ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'}`}>
                  {item.isVeg ? 'VEG' : 'NON-VEG'}
                </span>
              </div>
              <p className="text-xs text-[#8B7355] mt-0.5 truncate">{item.category} {item.description && `· ${item.description.substring(0, 40)}${item.description.length > 40 ? '...' : ''}`}</p>
              <p className="text-sm font-bold text-[#E65C00] mt-1">₹{item.price}</p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {/* Available toggle */}
              <div className="flex flex-col items-center gap-1">
                <label className="toggle-switch" style={{ width: 44, height: 24 }}>
                  <input
                    type="checkbox"
                    checked={item.available !== false}
                    onChange={() => handleToggleAvailable(item.id)}
                  />
                  <span className="toggle-slider" style={{ borderRadius: 12 }} />
                </label>
                <span className="text-[9px] text-[#8B7355] font-medium">{item.available !== false ? 'ON' : 'OFF'}</span>
              </div>

              <button
                onClick={() => { setEditItem(item); setShowModal(true); }}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-[rgba(230,92,0,0.08)] text-[#E65C00] hover:bg-[rgba(230,92,0,0.15)] transition-colors"
                aria-label={`Edit ${item.name}`}
              >
                <EditIcon />
              </button>

              <button
                onClick={() => handleDelete(item.id)}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-[rgba(200,40,40,0.08)] text-[#C82828] hover:bg-[rgba(200,40,40,0.14)] transition-colors"
                aria-label={`Delete ${item.name}`}
              >
                <TrashIcon />
              </button>
            </div>
          </div>
        ))}
      </div>

      {saving && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#1A1A1A] text-white text-sm px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2">
          <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
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