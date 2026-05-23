export default function LoadingSpinner({ size = 'md', className = '' }) {
  const sizeClass = size === 'lg' ? 'h-12 w-12 border-4' : 'h-8 w-8 border-2'

  return (
    <div
      className={`inline-block animate-spin rounded-full border-cream border-t-gold ${sizeClass} ${className}`}
      role="status"
      aria-label="Loading"
    />
  )
}
