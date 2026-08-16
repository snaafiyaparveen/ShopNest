import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import CategoryChips from '../components/CategoryChips'
import PromoBanner from '../components/PromoBanner'
import PickedForYou from '../components/PickedForYou'
import ProductGrid from '../components/ProductGrid'
import * as productsApi from '../api/products'
import { mockProducts } from '../data/mockProducts'

export default function Home() {
  const [searchParams] = useSearchParams()
  const category = searchParams.get('category')
  const query = searchParams.get('q')

  const [products, setProducts] = useState([])
  const [recommended, setRecommended] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    productsApi
      .getProducts({ category: category || undefined, q: query || undefined })
      .then(setProducts)
      .catch(() => {
        // Demo fallback when the Spring Boot backend isn't running.
        let filtered = mockProducts
        if (category) filtered = filtered.filter((p) => p.category === category)
        if (query) {
          const q = query.toLowerCase()
          filtered = filtered.filter(
            (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
          )
        }
        setProducts(filtered)
      })
      .finally(() => setLoading(false))
  }, [category, query])

  useEffect(() => {
    productsApi
      .getRecommended()
      .then(setRecommended)
      .catch(() => {
        setRecommended([...mockProducts].sort((a, b) => b.rating - a.rating).slice(0, 5))
      })
  }, [])

  const showHero = !category && !query

  return (
    <div className="pb-10">
      <CategoryChips />
      {showHero && <PromoBanner />}
      {showHero && <PickedForYou products={recommended} />}

      {loading ? (
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-card border border-slate-border rounded-xl overflow-hidden animate-pulse">
              <div className="aspect-square bg-slate-border/40" />
              <div className="p-3 space-y-2">
                <div className="h-3 bg-slate-border/40 rounded w-3/4" />
                <div className="h-3 bg-slate-border/40 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <ProductGrid
          title={query ? `Results for "${query}"` : category ? category : 'All products'}
          subtitle={!showHero ? `${products.length} products found` : undefined}
          products={products}
        />
      )}

      {products.length === 0 && !loading && (
        <p className="text-center text-slate py-10">No products found. Try a different search or category.</p>
      )}
    </div>
  )
}
