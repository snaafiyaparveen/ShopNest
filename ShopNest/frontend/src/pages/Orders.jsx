import { useEffect, useState } from 'react'
import { Package } from 'lucide-react'
import * as ordersApi from '../api/orders'

const statusColor = {
  CREATED: 'bg-slate-border text-ink',
  PAID: 'bg-success/10 text-success',
  FAILED: 'bg-discount/10 text-discount',
  SHIPPED: 'bg-violet/10 text-violet',
  DELIVERED: 'bg-success/10 text-success',
  CANCELLED: 'bg-discount/10 text-discount',
}

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    ordersApi
      .getMyOrders()
      .then(setOrders)
      .catch((err) => setError(err.message || 'Sign in to view your orders.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-10">
      <h1 className="text-2xl font-display font-bold text-ink mb-6 flex items-center gap-2">
        <Package size={22} /> Your orders
      </h1>

      {loading && <p className="text-slate text-sm">Loading orders…</p>}
      {error && !loading && <p className="text-slate text-sm">{error}</p>}

      {!loading && !error && orders.length === 0 && (
        <p className="text-slate text-sm">You haven't placed any orders yet.</p>
      )}

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-card border border-slate-border rounded-2xl p-5">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div>
                <p className="text-sm font-semibold text-ink">Order #{order.id}</p>
                <p className="text-xs text-slate">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              </div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor[order.status] || 'bg-slate-border text-ink'}`}>
                {order.status}
              </span>
            </div>

            <ul className="divide-y divide-slate-border">
              {order.items.map((item, idx) => (
                <li key={idx} className="py-2 flex justify-between text-sm">
                  <span className="text-ink">{item.productName} × {item.quantity}</span>
                  <span className="text-slate">₹{(item.priceAtPurchase * item.quantity).toLocaleString('en-IN')}</span>
                </li>
              ))}
            </ul>

            <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-border">
              <span className="text-sm text-slate">Total</span>
              <span className="font-bold text-ink">₹{order.totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
