import ProductCard from './ProductCard'

export default function ProductGrid({ title, subtitle, products, columns = 'default' }) {
  if (!products?.length) return null

  const gridCols =
    columns === 'wide'
      ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5'
      : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 py-6">
      {title && (
        <div className="mb-4">
          <h2 className="text-xl font-display font-bold text-ink">{title}</h2>
          {subtitle && <p className="text-sm text-slate mt-0.5">{subtitle}</p>}
        </div>
      )}
      <div className={`grid ${gridCols} gap-3 md:gap-4`}>
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  )
}
