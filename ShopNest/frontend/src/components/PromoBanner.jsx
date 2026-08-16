import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { banners } from '../data/mockProducts'

export default function PromoBanner() {
  const [index, setIndex] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % banners.length), 5000)
    return () => clearInterval(timer)
  }, [])

  const banner = banners[index]

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 pt-4">
      <div
        className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${banner.bg} min-h-[160px] md:min-h-[220px] flex items-center px-6 md:px-12`}
      >
        <div className="relative z-10 max-w-md">
          <p className="text-violet-200 text-xs font-semibold tracking-wide uppercase mb-2">Limited time</p>
          <h2 className="text-2xl md:text-4xl font-display font-extrabold text-white leading-tight">
            {banner.title}
          </h2>
          <p className="text-white/70 mt-2 text-sm md:text-base">{banner.subtitle}</p>
          <button
            onClick={() => navigate(`/?category=${encodeURIComponent(banner.category)}`)}
            className="mt-4 bg-white text-navy font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-violet-50 transition-colors"
          >
            {banner.cta}
          </button>
        </div>

        {/* decorative blob */}
        <div className="hidden md:block absolute -right-10 -top-10 h-64 w-64 rounded-full bg-white/5" />
        <div className="hidden md:block absolute right-16 bottom-0 h-32 w-32 rounded-full bg-violet/20" />

        <button
          onClick={() => setIndex((i) => (i - 1 + banners.length) % banners.length)}
          className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25 z-10"
          aria-label="Previous banner"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={() => setIndex((i) => (i + 1) % banners.length)}
          className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25 z-10"
          aria-label="Next banner"
        >
          <ChevronRight size={18} />
        </button>

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {banners.map((b, i) => (
            <button
              key={b.id}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${i === index ? 'w-6 bg-white' : 'w-1.5 bg-white/40'}`}
              aria-label={`Go to banner ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
