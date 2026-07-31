import { isAxiosError } from 'axios'
import { create } from 'zustand'
import { LoginDto, Profile, RegisterDto, User } from '../models/types'
import { authService } from '../services/api/auth'
import api from '../services/api/client'
import { storage } from '../storage'

interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
  checkAuth: () => Promise<void>
  login: (credentials: LoginDto) => Promise<void>
  register: (data: RegisterDto) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (profile: Profile) => Promise<void>
  clearSession: () => Promise<void>
}

const extractErrorMessage = (error: unknown): string => {
  const err = error as { response?: { data?: { message?: string | string[] } } }
  const message = err.response?.data?.message
  if (Array.isArray(message)) return message[0]
  if (typeof message === 'string') return message
  return 'Ocorreu um erro inesperado. Tente novamente.'
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  error: null,

  clearSession: async () => {
    await storage.clearAllSensitives()
    set({ user: null, error: 'Sessão expirada. Faça login novamente.', isLoading: false })
  },

  checkAuth: async () => {
    set({ isLoading: true }) 
    try {
      const savedUser = await storage.getUser()
      const token = await storage.getToken()

      if (savedUser && token && token !== 'undefined') {
        try {
          // Busca os dados FRESCOS do perfil no banco para não perder o Pet!
          const response = await api.get('/profile', {
            headers: { Authorization: `Bearer ${token}` }
          })
          
          const freshProfile = response.data?.data || response.data;
          const fullUser = { ...savedUser, profile: freshProfile };
          
          await storage.setUser(fullUser);
          set({ user: fullUser, isLoading: false })
        } catch (error: unknown) {
          if (isAxiosError(error) && error.response?.status === 401) {
            await get().clearSession()
          } else {
            set({ user: savedUser, isLoading: false })
          }
        }
      } else {
        await get().clearSession()
      }
    } catch (error) {
      await get().clearSession()
    }
  },

  login: async (credentials: LoginDto) => {
    set({ isLoading: true, error: null })
    try {
      const response = await authService.login(credentials)
      
      // Logo após o login, buscamos o perfil ativamente para garantir que temos o pet
      try {
         const profileRes = await api.get('/profile')
         const freshProfile = profileRes.data?.data || profileRes.data
         const fullUser = { ...response.user, profile: freshProfile }
         
         await storage.setUser(fullUser)
         set({ user: fullUser, isLoading: false })
      } catch (e) {
         set({ user: response.user, isLoading: false })
      }
    } catch (error) {
      set({ error: extractErrorMessage(error), isLoading: false })
      throw error
    }
  },

  register: async (data: RegisterDto) => {
    set({ isLoading: true, error: null })
    try {
      const response = await authService.register(data)
      
      try {
         const profileRes = await api.get('/profile')
         const freshProfile = profileRes.data?.data || profileRes.data
         const fullUser = { ...response.user, profile: freshProfile }
         
         await storage.setUser(fullUser)
         set({ user: fullUser, isLoading: false })
      } catch (e) {
         set({ user: response.user, isLoading: false })
      }
    } catch (error) {
      set({ error: extractErrorMessage(error), isLoading: false })
      throw error
    }
  },

  updateProfile: async (profile: Profile) => {
    const currentUser = get().user
    if (currentUser) {
      const updatedUser = { ...currentUser, profile }
      set({ user: updatedUser })
      await storage.setUser(updatedUser)
    }
  },

  logout: async () => {
    set({ isLoading: true })
    try {
      await authService.logout()
    } catch (error) {}
    await get().clearSession()
  },
}))