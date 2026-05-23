import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

const ToastContext = createContext(null);

export function useToast() {
  return useContext(ToastContext);
}

const ICONS = {
  success: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="10" fill="rgba(34,139,34,0.15)" />
      <path d="M5.5 10.5l3 3 6-6" stroke="#228B22" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  error: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="10" fill="rgba(200,40,40,0.15)" />
      <path d="M7 7l6 6M13 7l-6 6" stroke="#C82828" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  info: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="10" fill="rgba(230,92,0,0.15)" />
      <path d="M10 9v5M10 7v.5" stroke="#E65C00" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  cart: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="10" fill="rgba(247,183,49,0.2)" />
      <path d="M4 5h1.5l1.8 7h7.4l1.3-5H7" stroke="#E65C00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="8.5" cy="15" r="1" fill="#E65C00" />
      <circle cx="13.5" cy="15" r="1" fill="#E65C00" />
    </svg>
  ),
};

function ToastItem({ toast, onDismiss }) {
  return (
    <div
      className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-lg border border-[rgba(230,92,0,0.1)] animate-fade-up"
      style={{ minWidth: 260, maxWidth: 340, marginBottom: 8 }}
      onClick={() => onDismiss(toast.id)}
    >
      <span className="flex-shrink-0">{ICONS[toast.type] || ICONS.info}</span>
      <div className="flex-1 min-w-0">
        {toast.title && (
          <p className="text-xs font-semibold text-[#1A1A1A] leading-tight mb-0.5">{toast.title}</p>
        )}
        <p className="text-xs text-[#5A4A3A] leading-snug">{toast.message}</p>
      </div>
    </div>
  );
}

export function Toaster() {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef({});

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    if (timersRef.current[id]) clearTimeout(timersRef.current[id]);
  }, []);

  const addToast = useCallback(({ type = 'info', title, message, duration = 3000 }) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev.slice(-4), { id, type, title, message }]);
    timersRef.current[id] = setTimeout(() => dismiss(id), duration);
    return id;
  }, [dismiss]);

  return (
    <ToastContext.Provider value={addToast}>
      <div className="fixed top-4 right-4 z-[100] flex flex-col items-end pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem toast={t} onDismiss={dismiss} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export default Toaster;