import { useEffect, useRef } from 'react'

export default function CategoryTabs({ categories, activeCategory, onChange, counts = {} }) {
  const scrollRef = useRef(null)
  const tabRefs = useRef({})

  useEffect(() => {
    const el = tabRefs.current[activeCategory]
    const container = scrollRef.current
    if (!el || !container) return
    const elLeft = el.offsetLeft
    const elWidth = el.offsetWidth
    const containerWidth = container.offsetWidth
    const scrollTarget = elLeft - containerWidth / 2 + elWidth / 2
    container.scrollTo({ left: scrollTarget, behavior: 'smooth' })
  }, [activeCategory, categories])

  return (
    <div className="category-tabs-wrap">
      <div
        ref={scrollRef}
        className="category-tabs-track scrollbar-hide"
        style={{
          display: 'flex',
          gap: '0',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          padding: '6px 8px',
          background: 'rgba(15,15,15,0.76)',
          borderRadius: '9999px',
          border: '1px solid rgba(201,168,76,0.14)',
        }}
      >
        {categories.map((cat) => {
          const active = activeCategory === cat
          const count = cat === 'All' ? 0 : counts[cat] || 0
          return (
            <button
              key={cat}
              ref={(node) => { if (node) tabRefs.current[cat] = node }}
              type="button"
              onClick={() => onChange(cat)}
              aria-pressed={active}
              style={{
                flexShrink: 0,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 18px',
                minHeight: '44px',
                border: 'none',
                borderBottom: active ? '1px solid rgba(201,168,76,0.9)' : '1px solid transparent',
                background: 'transparent',
                fontFamily: "'Jost', sans-serif",
                fontSize: '12px',
                fontWeight: active ? '500' : '400',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: active ? '#E8D5A3' : 'rgba(245,240,232,0.55)',
                cursor: 'pointer',
                transition: 'color 0.25s ease, border-color 0.25s ease',
                whiteSpace: 'nowrap',
                borderRadius: 0,
                paddingBottom: '12px',
              }}
            >
              <span>{cat}</span>
              {count > 0 && (
                <span style={{
                  fontSize: '10px',
                  fontWeight: '600',
                  padding: '2px 7px',
                  borderRadius: '9999px',
                  background: active ? 'rgba(201,168,76,0.18)' : 'rgba(201,168,76,0.1)',
                  color: '#E8D5A3',
                }}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}