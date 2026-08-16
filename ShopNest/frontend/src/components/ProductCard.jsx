import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import StarRating from './StarRating'
import { useCart } from '../context/CartContext'

export default function ProductCard({ product }) {
  const { addItem } = useCart()

  const handleAdd = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product, 1)
  }

  return (
    <Link
      to={`/product/${product.id}`}
      className="group flex flex-col bg-card rounded-xl border border-slate-border overflow-hidden hover:shadow-popover hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="relative aspect-square bg-surface overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.discountPercent > 0 && (
          <span className="absolute top-2 left-2 bg-discount text-white text-[11px] font-bold px-2 py-1 rounded-md">
            {product.discountPercent}% OFF
          </span>
        )}
        <button
          onClick={handleAdd}
          className="absolute bottom-2 right-2 bg-navy text-white rounded-full p-2 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-200 hover:bg-violet"
          aria-label={`Add ${product.name} to cart`}
        >
          <Plus size={16} />
        </button>
      </div>

      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <p className="text-sm text-ink font-medium line-clamp-2 leading-snug min-h-[2.5rem]">{product.name}</p>
        <StarRating rating={product.rating} count={product.ratingCount} />
        <div className="flex items-baseline gap-2 mt-0.5">
          <span className="text-base font-bold text-ink">₹{product.price.toLocaleString('en-IN')}</span>
          {product.mrp > product.price && (
            <span className="text-xs text-slate line-through">₹{product.mrp.toLocaleString('en-IN')}</span>
          )}
        </div>
        {product.discountPercent >= 40 && (
          <span className="text-xs text-success font-semibold">Great deal</span>
        )}
      </div>
    </Link>
  )
}
