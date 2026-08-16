import apiClient from './client'

/*
 * Create ShopNest order from cart
 */
export const createOrder = (shippingAddress) =>
  apiClient
    .post('/orders', { shippingAddress })
    .then((r) => r.data)


/*
 * Get logged-in user's orders
 */
export const getMyOrders = () =>
  apiClient
    .get('/orders')
    .then((r) => r.data)

export const createRazorpayOrder = (orderId) =>
  apiClient
    .post(`/payments/razorpay/order/${orderId}`)
    .then((r) => r.data)


/*
 * Complete a DEMO payment.
 */
export const completeDemoPayment = (orderId) =>
  apiClient
    .post(`/payments/demo/${orderId}`)
    .then((r) => r.data)


/*
 * Verify real Razorpay payment.
 */
export const verifyPayment = (payload) =>
  apiClient
    .post('/payments/razorpay/verify', payload)
    .then((r) => r.data)