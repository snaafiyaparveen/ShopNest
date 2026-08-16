import { useEffect, useState } from 'react'
import { LayoutDashboard, Plus, Trash2, Pencil, X } from 'lucide-react'
import apiClient from '../api/client'
import * as productsApi from '../api/products'
import { useAuth } from '../context/AuthContext'

const emptyForm = { name: '', description: '', price: '', mrp: '', category: '', imageUrl: '', stock: '' }

export default function Admin() {
  const { isAdmin } = useAuth()
  const [tab, setTab] = useState('products')
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')

  const loadProducts = () => productsApi.getProducts().then(setProducts).catch(() => {})
  const loadOrders = () => apiClient.get('/admin/orders').then((r) => setOrders(r.data)).catch(() => {})

  useEffect(() => {
    loadProducts()
    loadOrders()
  }, [])

  if (!isAdmin) {
    return <div className="max-w-xl mx-auto px-4 py-20 text-center text-slate">Admin access only. Please sign in with an admin account.</div>
  }

  const resetForm = () => {
    setForm(emptyForm)
    setEditingId(null)
    setShowForm(false)
    setError('')
  }

  const submitProduct = async (e) => {
    e.preventDefault()
    setError('')
    const payload = {
      ...form,
      price: parseFloat(form.price),
      mrp: form.mrp ? parseFloat(form.mrp) : null,
      stock: parseInt(form.stock || '0', 10),
    }
    try {
      if (editingId) {
        await apiClient.put(`/admin/products/${editingId}`, payload)
      } else {
        await apiClient.post('/admin/products', payload)
      }
      resetForm()
      loadProducts()
    } catch (err) {
      setError(err.message)
    }
  }

  const editProduct = (p) => {
    setForm({
      name: p.name,
      description: p.description || '',
      price: p.price,
      mrp: p.mrp || '',
      category: p.category,
      imageUrl: p.imageUrl || '',
      stock: p.stock ?? '',
    })
    setEditingId(p.id)
    setShowForm(true)
  }

  const deleteProduct = async (id) => {
    if (!confirm('Remove this product from the catalog?')) return
    try {
      await apiClient.delete(`/admin/products/${id}`)
      loadProducts()
    } catch (err) {
      alert(err.message)
    }
  }

  const updateOrderStatus = async (id, status) => {
    try {
      await apiClient.patch(`/admin/orders/${id}/status`, null, { params: { status } })
      loadOrders()
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
      <h1 className="text-2xl font-display font-bold text-ink mb-6 flex items-center gap-2">
        <LayoutDashboard size={22} /> Admin panel
      </h1>

      <div className="flex gap-2 mb-6 border-b border-slate-border">
        {['products', 'orders'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium capitalize border-b-2 -mb-px transition-colors
              ${tab === t ? 'border-violet text-violet' : 'border-transparent text-slate hover:text-ink'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'products' && (
        <div>
          <button
            onClick={() => { resetForm(); setShowForm(true) }}
            className="flex items-center gap-1.5 bg-violet hover:bg-violet-hover text-white text-sm font-semibold px-4 py-2.5 rounded-lg mb-5"
          >
            <Plus size={16} /> Add product
          </button>

          {showForm && (
            <form onSubmit={submitProduct} className="bg-card border border-slate-border rounded-2xl p-5 mb-6 grid sm:grid-cols-2 gap-3 relative">
              <button type="button" onClick={resetForm} className="absolute top-3 right-3 text-slate hover:text-ink">
                <X size={18} />
              </button>
              <h3 className="sm:col-span-2 font-semibold text-ink">{editingId ? 'Edit product' : 'New product'}</h3>
              <input required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="px-3 py-2 border border-slate-border rounded-lg text-sm" />
              <input required placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="px-3 py-2 border border-slate-border rounded-lg text-sm" />
              <input required type="number" step="0.01" placeholder="Price (₹)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="px-3 py-2 border border-slate-border rounded-lg text-sm" />
              <input type="number" step="0.01" placeholder="MRP (₹, optional)" value={form.mrp} onChange={(e) => setForm({ ...form, mrp: e.target.value })} className="px-3 py-2 border border-slate-border rounded-lg text-sm" />
              <input type="number" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="px-3 py-2 border border-slate-border rounded-lg text-sm" />
              <input placeholder="Image URL" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className="px-3 py-2 border border-slate-border rounded-lg text-sm" />
              <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="sm:col-span-2 px-3 py-2 border border-slate-border rounded-lg text-sm" rows={2} />
              {error && <p className="sm:col-span-2 text-sm text-discount">{error}</p>}
              <button type="submit" className="sm:col-span-2 bg-navy hover:bg-ink text-white font-semibold py-2.5 rounded-lg text-sm">
                {editingId ? 'Save changes' : 'Create product'}
              </button>
            </form>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate border-b border-slate-border">
                  <th className="py-2 pr-4">Product</th>
                  <th className="py-2 pr-4">Category</th>
                  <th className="py-2 pr-4">Price</th>
                  <th className="py-2 pr-4">Stock</th>
                  <th className="py-2 pr-4"></th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-slate-border">
                    <td className="py-2.5 pr-4 flex items-center gap-2">
                      <img src={p.imageUrl} alt="" className="h-9 w-9 rounded object-cover bg-surface" />
                      {p.name}
                    </td>
                    <td className="py-2.5 pr-4 text-slate">{p.category}</td>
                    <td className="py-2.5 pr-4">₹{p.price?.toLocaleString('en-IN')}</td>
                    <td className="py-2.5 pr-4">{p.stock}</td>
                    <td className="py-2.5 pr-4">
                      <div className="flex gap-2">
                        <button onClick={() => editProduct(p)} className="text-slate hover:text-violet"><Pencil size={15} /></button>
                        <button onClick={() => deleteProduct(p.id)} className="text-slate hover:text-discount"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'orders' && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate border-b border-slate-border">
                <th className="py-2 pr-4">Order</th>
                <th className="py-2 pr-4">Customer</th>
                <th className="py-2 pr-4">Total</th>
                <th className="py-2 pr-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-slate-border">
                  <td className="py-2.5 pr-4">#{o.id}</td>
                  <td className="py-2.5 pr-4 text-slate">{o.shippingAddress?.slice(0, 30)}…</td>
                  <td className="py-2.5 pr-4">₹{o.totalAmount?.toLocaleString('en-IN')}</td>
                  <td className="py-2.5 pr-4">
                    <select
                      value={o.status}
                      onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                      className="border border-slate-border rounded-lg px-2 py-1 text-xs"
                    >
                      {['CREATED', 'PAID', 'FAILED', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
