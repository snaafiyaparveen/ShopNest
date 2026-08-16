import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [form, setForm] = useState({ fullName: '', email: '', password: '', phone: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(form)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Unable to create your account.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-card border border-slate-border rounded-2xl p-8 shadow-card">
        <h1 className="text-2xl font-display font-bold text-ink text-center">Create your account</h1>
        <p className="text-sm text-slate text-center mt-1">Join ShopNest for faster checkout & order tracking.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">Full name</label>
            <input
              required
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-slate-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-violet"
              placeholder="Jane Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-slate-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-violet"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">Phone (optional)</label>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-slate-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-violet"
              placeholder="+91 98765 43210"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-slate-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-violet"
              placeholder="At least 6 characters"
            />
          </div>

          {error && <p className="text-sm text-discount">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-violet hover:bg-violet-hover text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-60"
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="text-sm text-slate text-center mt-6">
          Already have an account? <Link to="/login" className="text-violet font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
