import { useEffect, useRef } from 'react'

export default function CategoryTabs({ categories, activeCategory, onChange, counts = {} }) {
  const scrollRef = useRef(null)
  const tabRefs = useRef({})

  useEffect(() => {
    const update = () => {
      const el = tabRefs.current[activeCategory]
      const container = scrollRef.current
      if (!el || !container) return
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
      <div className="category-tabs-track scrollbar-hide flex items-center gap-5 overflow-x-auto" ref={scrollRef}>
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
              className={`category-tab-pill relative flex-shrink-0 pb-3 pt-1 ${active ? 'is-active' : ''}`}
              style={{
                borderBottom: active ? '1px solid rgba(201,168,76,0.9)' : '1px solid transparent',
              }}
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
