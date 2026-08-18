import axios from 'axios'

baseURL: import.meta.env.VITE_API_BASE_URL + '/api',

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('shopnest_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err?.response?.data?.message || 'Something went wrong. Please try again.'
    return Promise.reject(new Error(message))
  }
)

export default apiClient
