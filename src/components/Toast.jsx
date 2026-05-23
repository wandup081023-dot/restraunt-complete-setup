import { useEffect } from 'react'

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3500)
    return () => clearTimeout(timer)
  }, [onClose])

  const bg =
    type === 'error'
      ? 'bg-red-600'
      : type === 'info'
        ? 'bg-charcoal'
        : 'bg-saffron'

  return (
    <div
      className={`fixed top-4 left-4 right-4 z-[100] mx-auto max-w-md animate-fade-in rounded-xl px-4 py-3 text-center text-sm font-medium text-white shadow-lg ${bg}`}
      role="alert"
    >
      {message}
    </div>
  )
}
