import { useNavigate, useSearchParams } from 'react-router-dom'
import { categories } from '../data/mockProducts'

export default function CategoryChips() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const active = searchParams.get('category') || 'All'

  return (
    <div className="bg-card border-b border-slate-border sticky top-[52px] md:top-[93px] z-30">
      <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 md:px-6 py-3 max-w-7xl mx-auto">
        {categories.map((c) => {
          const isActive = c.name === active
          return (
            <button
              key={c.name}
              onClick={() => navigate(c.name === 'All' ? '/' : `/?category=${encodeURIComponent(c.name)}`)}
              className={`flex items-center gap-1.5 whitespace-nowrap px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors shrink-0
                ${isActive
                  ? 'bg-navy text-white border-navy'
                  : 'bg-white text-ink border-slate-border hover:border-violet hover:text-violet'}`}
            >
              <span>{c.icon}</span>
              {c.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}
