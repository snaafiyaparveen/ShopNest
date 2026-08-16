import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Minus, Plus, ShoppingCart, Zap, ShieldCheck, Truck } from 'lucide-react'
import StarRating from '../components/StarRating'
import ProductGrid from '../components/ProductGrid'
import * as productsApi from '../api/products'
import { mockProducts } from '../data/mockProducts'
import { useCart } from '../context/CartContext'

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [qty, setQty] = useState(1)
  const { addItem } = useCart()

  useEffect(() => {
    setQty(1)
    productsApi
      .getProductById(id)
      .then(setProduct)
      .catch(() => {
        const found = mockProducts.find((p) => String(p.id) === String(id))
        setProduct(found || null)
      })
  }, [id])

  useEffect(() => {
    if (!product) return
    productsApi
      .getProducts({ category: product.category })
      .then((list) => setRelated(list.filter((p) => p.id !== product.id).slice(0, 5)))
      .catch(() => {
        setRelated(mockProducts.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 5))
      })
  }, [product])

  if (!product) {
    return <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 text-center text-slate">Loading product…</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 pb-20">
      <div className="text-xs text-slate mb-4 flex gap-1.5">
        <Link to="/" className="hover:text-violet">Home</Link>
        <span>/</span>
        <Link to={`/?category=${encodeURIComponent(product.category)}`} className="hover:text-violet">{product.category}</Link>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-card border border-slate-border rounded-2xl overflow-hidden aspect-square">
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
        </div>

        <div>
          <h1 className="text-2xl font-display font-bold text-ink leading-snug">{product.name}</h1>
          <div className="mt-2"><StarRating rating={product.rating} count={product.ratingCount} /></div>

          <div className="flex items-baseline gap-3 mt-4">
            <span className="text-3xl font-extrabold text-ink">₹{product.price.toLocaleString('en-IN')}</span>
            {product.mrp > product.price && (
              <>
                <span className="text-base text-slate line-through">₹{product.mrp.toLocaleString('en-IN')}</span>
                <span className="text-sm font-semibold text-success">{product.discountPercent}% off</span>
              </>
            )}
          </div>

          <p className="text-sm text-slate mt-4 leading-relaxed">{product.description}</p>

          <div className="flex flex-col gap-2 mt-5 text-sm text-ink">
            <span className="flex items-center gap-2"><Truck size={16} className="text-violet" /> Free delivery in 3–5 business days</span>
            <span className="flex items-center gap-2"><ShieldCheck size={16} className="text-violet" /> Secure checkout via Razorpay</span>
            <span className="flex items-center gap-2"><Zap size={16} className="text-violet" /> {product.stock > 0 ? `In stock (${product.stock} left)` : 'Out of stock'}</span>
          </div>

          <div className="flex items-center gap-3 mt-6">
            <div className="flex items-center border border-slate-border rounded-lg">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-2.5 hover:bg-surface" aria-label="Decrease quantity">
                <Minus size={15} />
              </button>
              <span className="w-10 text-center text-sm font-medium">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="p-2.5 hover:bg-surface" aria-label="Increase quantity">
                <Plus size={15} />
              </button>
            </div>

            <button
              onClick={() => addItem(product, qty)}
              className="flex-1 flex items-center justify-center gap-2 bg-violet hover:bg-violet-hover text-white font-semibold py-3 rounded-lg transition-colors"
            >
              <ShoppingCart size={18} /> Add to cart
            </button>
          </div>
        </div>
      </div>

      <ProductGrid title="You may also like" products={related} />
    </div>
  )
}
