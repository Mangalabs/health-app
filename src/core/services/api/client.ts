import axios from 'axios'
import { storage } from '../../storage'

const API_URL =
  process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:3000/api/v1'

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(async (config) => {
  const token = await storage.getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.warn('Sessão expirada. Limpando credenciais...')
      await storage.clearAllSensitives()

      try {
        const { useAuthStore } = require('../../store/authStore')
        useAuthStore.getState().clearSession()

        const { router } = require('expo-router')
        router.replace('/login')
      } catch (e) {
        console.warn('Erro ao forçar redirecionamento no interceptor', e)
      }
    }
    return Promise.reject(error)
  },
)

export default api