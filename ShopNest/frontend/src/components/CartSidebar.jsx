import { Link } from 'react-router-dom'
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function CartSidebar() {
  const { items, totalAmount, isOpen, setIsOpen, updateQuantity, removeItem } = useCart()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-ink/40 animate-fade-in"
        onClick={() => setIsOpen(false)}
      />
      <div className="relative w-full max-w-sm bg-white h-full flex flex-col animate-slide-in shadow-popover">
        <div className="flex items-center justify-between px-4 py-4 border-b border-slate-border">
          <h2 className="font-display font-bold text-lg flex items-center gap-2">
            <ShoppingBag size={19} /> Your cart
          </h2>
          <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg hover:bg-surface" aria-label="Close cart">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-2 py-16">
              <ShoppingBag size={40} className="text-slate-border" />
              <p className="text-slate text-sm">Your cart is empty.</p>
              <button
                onClick={() => setIsOpen(false)}
                className="mt-2 text-violet text-sm font-semibold hover:underline"
              >
                Continue shopping
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-slate-border">
              {items.map((item) => (
                <li key={item.cartItemId} className="py-3 flex gap-3">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="h-16 w-16 rounded-lg object-cover bg-surface shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink line-clamp-2">{item.product.name}</p>
                    <p className="text-sm font-bold text-ink mt-1">₹{item.product.price.toLocaleString('en-IN')}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-slate-border rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                          className="p-1.5 hover:bg-surface rounded-l-lg"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-7 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          className="p-1.5 hover:bg-surface rounded-r-lg"
                          aria-label="Increase quantity"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.cartItemId)}
                        className="p-1.5 text-slate hover:text-discount"
                        aria-label="Remove item"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-slate-border px-4 py-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate">Subtotal</span>
              <span className="font-bold text-ink text-base">₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>
            <Link
              to="/checkout"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center bg-violet hover:bg-violet-hover text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Proceed to checkout
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
