import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  MapPin,
  Home,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const [query, setQuery] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)

  const { user, logout } = useAuth()
  const { totalItems, setIsOpen } = useCart()
  const navigate = useNavigate()

  const submitSearch = (e) => {
    e.preventDefault()

    navigate(
      query.trim()
        ? `/search?q=${encodeURIComponent(query.trim())}`
        : '/'
    )

    setMobileOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 bg-navy text-white shadow-card">

      {/* ========================= */}
      {/* TOP UTILITY STRIP         */}
      {/* ========================= */}

      <div className="hidden md:flex items-center justify-between px-6 py-1.5 text-xs text-white/70 border-b border-white/10">

        <span className="flex items-center gap-1">
          <MapPin size={12} />
          Deliver to India — Free shipping on orders over ₹499
        </span>

        <div className="flex items-center gap-4">
          <Link
            to="/orders"
            className="hover:text-white transition-colors"
          >
            Track order
          </Link>

          <span>Help</span>
        </div>
      </div>


      {/* ========================= */}
      {/* MAIN NAVBAR                */}
      {/* ========================= */}

      <div className="flex items-center gap-3 px-4 md:px-6 py-3">

        {/* Mobile menu button */}

        <button
          className="md:hidden p-2 -ml-2 rounded-lg hover:bg-white/10"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X size={22} />
          ) : (
            <Menu size={22} />
          )}
        </button>


        {/* Logo */}

        <Link
          to="/"
          className="flex items-center gap-1.5 shrink-0"
        >
          <span className="font-display font-extrabold text-2xl tracking-tight">
            Shop<span className="text-violet-300">Nest</span>
          </span>
        </Link>


        {/* ========================= */}
        {/* DESKTOP SEARCH             */}
        {/* ========================= */}

        <form
          onSubmit={submitSearch}
          className="hidden md:flex flex-1 max-w-2xl mx-4"
        >
          <div className="flex w-full rounded-lg overflow-hidden ring-1 ring-white/10 focus-within:ring-2 focus-within:ring-violet-300 transition-shadow">

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text"
              placeholder="Search for products, brands and more"
              className="flex-1 px-4 py-2.5 text-ink bg-white text-sm outline-none placeholder:text-slate"
            />

            <button
              type="submit"
              className="bg-violet hover:bg-violet-hover px-4 flex items-center justify-center transition-colors"
              aria-label="Search"
            >
              <Search size={18} />
            </button>

          </div>
        </form>


        {/* ========================= */}
        {/* RIGHT SIDE NAVIGATION      */}
        {/* ========================= */}

        <div className="flex items-center gap-1 md:gap-2 ml-auto">

          {/* Home button */}

          <Link
            to="/"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Home"
          >
            <Home size={19} />

            <span className="hidden sm:inline text-sm">
              Home
            </span>
          </Link>


          {/* User */}

          {user ? (
            <div className="relative group">

              <button
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-white/10 text-sm"
              >
                <User size={18} />

                <span className="hidden sm:inline max-w-[100px] truncate">
                  {user.fullName.split(' ')[0]}
                </span>
              </button>


              {/* User dropdown */}

              <div className="absolute right-0 top-full mt-1 w-44 bg-white text-ink rounded-lg shadow-popover py-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">

                <Link
                  to="/orders"
                  className="block px-4 py-2 text-sm hover:bg-surface"
                >
                  Your orders
                </Link>

                {user.role === 'ADMIN' && (
                  <Link
                    to="/admin"
                    className="block px-4 py-2 text-sm hover:bg-surface"
                  >
                    Admin panel
                  </Link>
                )}

                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-surface text-discount"
                >
                  Sign out
                </button>

              </div>
            </div>
          ) : (

            /* Sign in */

            <Link
              to="/login"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-white/10 text-sm"
            >
              <User size={18} />

              <span className="hidden sm:inline">
                Sign in
              </span>
            </Link>
          )}


          {/* ========================= */}
          {/* CART                       */}
          {/* ========================= */}

          <button
            onClick={() => setIsOpen(true)}
            className="relative flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-white/10"
            aria-label="Open cart"
          >

            <ShoppingCart size={20} />

            {totalItems > 0 && (
              <span className="absolute -top-0.5 right-1 bg-violet text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}

            <span className="hidden sm:inline text-sm">
              Cart
            </span>

          </button>

        </div>
      </div>


      {/* ========================= */}
      {/* MOBILE SEARCH              */}
      {/* ========================= */}

      <form
        onSubmit={submitSearch}
        className="md:hidden px-4 pb-3"
      >
        <div className="flex w-full rounded-lg overflow-hidden ring-1 ring-white/10">

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Search ShopNest"
            className="flex-1 px-4 py-2 text-ink bg-white text-sm outline-none placeholder:text-slate"
          />

          <button
            type="submit"
            className="bg-violet px-4 flex items-center justify-center"
          >
            <Search size={18} />
          </button>

        </div>
      </form>


      {/* ========================= */}
      {/* MOBILE MENU                */}
      {/* ========================= */}

      {mobileOpen && (
        <div className="md:hidden bg-navy border-t border-white/10 px-4 py-3 space-y-1 animate-fade-in">

          <Link
            to="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 py-2 text-sm"
          >
            <Home size={16} />
            Home
          </Link>

          <Link
            to="/orders"
            onClick={() => setMobileOpen(false)}
            className="block py-2 text-sm"
          >
            Your orders
          </Link>

          {user?.role === 'ADMIN' && (
            <Link
              to="/admin"
              onClick={() => setMobileOpen(false)}
              className="block py-2 text-sm"
            >
              Admin panel
            </Link>
          )}

        </div>
      )}

    </header>
  )
}