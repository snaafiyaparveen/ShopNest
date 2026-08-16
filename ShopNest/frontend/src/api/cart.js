import apiClient from './client'

export const getCart = () => apiClient.get('/cart').then((r) => r.data)
export const addToCart = (productId, quantity = 1) =>
  apiClient.post('/cart/items', { productId, quantity }).then((r) => r.data)
export const updateCartItem = (cartItemId, quantity) =>
  apiClient.put(`/cart/items/${cartItemId}`, null, { params: { quantity } }).then((r) => r.data)
export const removeCartItem = (cartItemId) =>
  apiClient.delete(`/cart/items/${cartItemId}`).then((r) => r.data)
