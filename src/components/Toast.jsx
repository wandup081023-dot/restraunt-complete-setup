import React, { createContext, useContext, useState, useCallback, useRef } from 'react'

const ToastContext = createContext(null);

export function useToast() {
  return useContext(ToastContext);
}

const ICONS = {
  success: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="10" fill="rgba(201,168,76,0.12)" />
      <path d="M5.5 10.5l3 3 6-6" stroke="rgba(232,213,163,0.95)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  error: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="10" fill="rgba(220,80,80,0.14)" />
      <path d="M7 7l6 6M13 7l-6 6" stroke="rgba(245,240,232,0.9)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  info: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="10" fill="rgba(201,168,76,0.12)" />
      <path d="M10 9v5M10 7v.5" stroke="rgba(232,213,163,0.95)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  cart: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="10" fill="rgba(201,168,76,0.12)" />
      <path d="M4 5h1.5l1.8 7h7.4l1.3-5H7" stroke="rgba(232,213,163,0.95)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="8.5" cy="15" r="1" fill="rgba(232,213,163,0.95)" />
      <circle cx="13.5" cy="15" r="1" fill="rgba(232,213,163,0.95)" />
    </svg>
  ),
}

function ToastItem({ toast, onDismiss }) {
  return (
    <div
      className="flex items-center gap-3 rounded-[22px] border border-[rgba(201,168,76,0.14)] bg-[rgba(16,16,16,0.96)] px-4 py-3 shadow-[0_18px_48px_rgba(0,0,0,0.34)] animate-fade-up backdrop-blur-xl"
      style={{ minWidth: 260, maxWidth: 340, marginBottom: 8 }}
      onClick={() => onDismiss(toast.id)}
    >
      <span className="flex-shrink-0">{ICONS[toast.type] || ICONS.info}</span>
      <div className="flex-1 min-w-0">
        {toast.title && (
          <p className="mb-0.5 text-xs font-medium leading-tight text-[var(--text-primary)]">{toast.title}</p>
        )}
        <p className="text-xs leading-snug text-[rgba(245,240,232,0.66)]">{toast.message}</p>
      </div>
    </div>
  )
}

export function Toaster() {
  const [toasts, setToasts] = useState([])
  const timersRef = useRef({})

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
    if (timersRef.current[id]) clearTimeout(timersRef.current[id])
  }, [])

  const addToast = useCallback(({ type = 'info', title, message, duration = 3000 }) => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev.slice(-4), { id, type, title, message }])
    timersRef.current[id] = setTimeout(() => dismiss(id), duration)
    return id
  }, [dismiss])

  return (
    <ToastContext.Provider value={addToast}>
      <div className="fixed right-4 top-4 z-[100] flex flex-col items-end pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem toast={t} onDismiss={dismiss} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export default Toaster;