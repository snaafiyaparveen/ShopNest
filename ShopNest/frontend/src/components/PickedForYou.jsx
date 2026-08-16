import { Sparkles } from 'lucide-react'
import ProductCard from './ProductCard'

export default function PickedForYou({ products }) {
  if (!products?.length) return null

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 py-6">
      <div className="rounded-2xl bg-gradient-to-br from-navy to-[#1E293B] p-5 md:p-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="flex items-center justify-center h-7 w-7 rounded-full bg-violet/20 text-violet-300">
            <Sparkles size={15} />
          </span>
          <h2 className="text-lg md:text-xl font-display font-bold text-white">Picked for you</h2>
        </div>
        <p className="text-sm text-white/60 mb-4 ml-9">Based on your recent browsing</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {products.map((p) => (
            <div key={p.id} className="rounded-xl overflow-hidden">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
