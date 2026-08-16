import apiClient from './client'

export const login = (payload) => apiClient.post('/auth/login', payload).then((r) => r.data)
export const register = (payload) => apiClient.post('/auth/register', payload).then((r) => r.data)
