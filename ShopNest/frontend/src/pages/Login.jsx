import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Unable to sign in. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-card border border-slate-border rounded-2xl p-8 shadow-card">
        <h1 className="text-2xl font-display font-bold text-ink text-center">Sign in to ShopNest</h1>
        <p className="text-sm text-slate text-center mt-1">Welcome back — let's get you shopping.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
            <label className="block text-sm font-medium text-ink mb-1.5">Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-slate-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-violet"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-sm text-discount">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-violet hover:bg-violet-hover text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="text-sm text-slate text-center mt-6">
          New to ShopNest? <Link to="/register" className="text-violet font-semibold hover:underline">Create an account</Link>
        </p>

        <p className="text-xs text-slate text-center mt-4 bg-surface rounded-lg p-2.5">
          Demo admin: <span className="font-mono">admin@shopnest.com</span> / <span className="font-mono">Admin@123</span>
        </p>
      </div>
    </div>
  )
}
