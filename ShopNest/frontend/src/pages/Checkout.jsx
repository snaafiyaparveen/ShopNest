import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, ShieldCheck, CheckCircle2, X } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import * as ordersApi from '../api/orders'

export default function Checkout() {
  const { items, totalAmount } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [completedOrder, setCompletedOrder] = useState(null)

  const handlePay = async (e) => {
    e.preventDefault()
    setError('')

    if (!user) {
      navigate('/login')
      return
    }

    if (!address.trim()) {
      setError('Please enter your shipping address.')
      return
    }

    setLoading(true)

    try {
      /*
       * STEP 1
       * Create the ShopNest order from the cart.
       */
      const order = await ordersApi.createOrder(address)

      /*
       * STEP 2
       * Complete DEMO payment directly.
       *
       * No Razorpay credentials or Razorpay checkout
       * are required in DEMO mode.
       */
      const payment = await ordersApi.completeDemoPayment(order.id)

      /*
       * STEP 3
       * Payment successful.
       */
      if (payment.status === 'success') {
        setCompletedOrder({
          orderId: payment.orderId || order.id,
          amount: totalAmount,
        })

        setPaymentSuccess(true)
      } else {
        throw new Error('Demo payment was not completed.')
      }
    } catch (err) {
      setError(
        err?.message ||
        'Unable to complete checkout. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  /*
   * Empty cart
   */
  if (items.length === 0 && !paymentSuccess) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <p className="text-slate">
          Your cart is empty — add something before checking out.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-10">

        <h1 className="text-2xl font-display font-bold text-ink mb-6">
          Checkout
        </h1>

        <div className="grid md:grid-cols-5 gap-6">

          {/* ========================= */}
          {/* CHECKOUT FORM              */}
          {/* ========================= */}

          <form
            onSubmit={handlePay}
            className="md:col-span-3 bg-card border border-slate-border rounded-2xl p-6 space-y-4"
          >
            <h2 className="font-semibold text-ink">
              Shipping address
            </h2>

            <textarea
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={4}
              placeholder="House no, street, city, state, PIN code"
              className="w-full px-3.5 py-2.5 border border-slate-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-violet resize-none"
            />

            {error && (
              <p className="text-sm text-discount">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-violet hover:bg-violet-hover text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-60"
            >
              <Lock size={16} />

              {loading
                ? 'Processing…'
                : `Pay ₹${totalAmount.toLocaleString('en-IN')}`
              }
            </button>

            <p className="flex items-center gap-1.5 text-xs text-slate justify-center">
              <ShieldCheck size={13} />
              Demo payment mode enabled
            </p>
          </form>

          {/* ========================= */}
          {/* ORDER SUMMARY              */}
          {/* ========================= */}

          <div className="md:col-span-2 bg-card border border-slate-border rounded-2xl p-6 h-fit">

            <h2 className="font-semibold text-ink mb-3">
              Order summary
            </h2>

            <ul className="space-y-2 mb-4 max-h-64 overflow-y-auto">

              {items.map((i) => (
                <li
                  key={i.cartItemId}
                  className="flex justify-between text-sm"
                >
                  <span className="text-slate truncate pr-2">
                    {i.product.name} × {i.quantity}
                  </span>

                  <span className="text-ink font-medium shrink-0">
                    ₹{(
                      i.product.price * i.quantity
                    ).toLocaleString('en-IN')}
                  </span>
                </li>
              ))}

            </ul>

            <div className="border-t border-slate-border pt-3 flex justify-between font-bold text-ink">
              <span>Total</span>

              <span>
                ₹{totalAmount.toLocaleString('en-IN')}
              </span>
            </div>

          </div>
        </div>
      </div>

      {/* ================================= */}
      {/* PAYMENT SUCCESS POPUP              */}
      {/* ================================= */}

      {paymentSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">

          {/* Background overlay */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setPaymentSuccess(false)}
          />

          {/* Popup */}
          <div className="relative w-full max-w-md bg-card rounded-2xl shadow-2xl p-7 text-center">

            {/* Close button */}
            <button
              type="button"
              onClick={() => setPaymentSuccess(false)}
              className="absolute top-4 right-4 text-slate hover:text-ink transition-colors"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            {/* Success icon */}
            <div className="flex justify-center mb-5">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2
                  size={48}
                  className="text-green-600"
                />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-display font-bold text-ink mb-2">
              Payment Successful!
            </h2>

            <p className="text-slate text-sm mb-6">
              Your order has been placed successfully.
            </p>

            {/* Order details */}
            <div className="bg-slate-50 rounded-xl p-4 mb-6 text-sm">

              <div className="flex justify-between mb-2">
                <span className="text-slate">
                  Order ID
                </span>

                <span className="font-semibold text-ink">
                  #{completedOrder?.orderId}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate">
                  Amount Paid
                </span>

                <span className="font-semibold text-ink">
                  ₹{completedOrder?.amount?.toLocaleString('en-IN')}
                </span>
              </div>

            </div>

            {/* Demo payment notice */}
            <div className="flex items-center justify-center gap-2 text-xs text-slate mb-6">
              <ShieldCheck size={14} />
              Demo payment completed successfully
            </div>

            {/* View orders */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => navigate('/orders')}
                className="w-full bg-violet hover:bg-violet-hover text-white font-semibold py-3 rounded-lg transition-colors"
              >
                View My Orders
              </button>

              <button
                type="button"
                onClick={() => navigate('/')}
                className="w-full border border-slate-border text-ink hover:bg-slate-50 font-semibold py-3 rounded-lg transition-colors"
              >
                Home
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  )
}