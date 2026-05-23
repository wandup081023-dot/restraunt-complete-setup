import { useEffect, useRef, useState } from 'react'

export default function CategoryTabs({ categories, activeCategory, onChange, counts = {} }) {
  const scrollRef = useRef(null)
  const tabRefs = useRef({})
  const [indicator, setIndicator] = useState({ left: 0, width: 0 })

  useEffect(() => {
    const update = () => {
      const el = tabRefs.current[activeCategory]
      const container = scrollRef.current
      if (!el || !container) return
      setIndicator({
        left: el.offsetLeft - container.scrollLeft,
        width: el.offsetWidth,
      })
      el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
    }
    update()
    const container = scrollRef.current
    container?.addEventListener('scroll', update)
    window.addEventListener('resize', update)
    return () => {
      container?.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [activeCategory, categories])

  return (
    <div className="category-tabs-wrap">
      <div className="category-tabs-track scrollbar-hide" ref={scrollRef}>
        <div
          className="category-tabs-indicator"
          style={{
            transform: `translateX(${indicator.left}px)`,
            width: indicator.width,
          }}
        />
        {categories.map((cat) => {
          const active = activeCategory === cat
          const count = cat === 'All' ? 0 : counts[cat] || 0
          return (
            <button
              key={cat}
              ref={(node) => {
                if (node) tabRefs.current[cat] = node
              }}
              type="button"
              className={`category-tab-pill ${active ? 'is-active' : ''}`}
              onClick={() => onChange(cat)}
              aria-pressed={active}
            >
              <span>{cat}</span>
              {count > 0 && (
                <span className={`category-tab-count ${active ? 'is-active' : ''}`}>
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
