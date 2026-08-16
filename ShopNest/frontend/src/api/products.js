import apiClient from './client'

export const getProducts = (params) => apiClient.get('/products', { params }).then((r) => r.data)
export const getRecommended = () => apiClient.get('/products/recommended').then((r) => r.data)
export const getProductById = (id) => apiClient.get(`/products/${id}`).then((r) => r.data)
