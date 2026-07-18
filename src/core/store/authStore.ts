import { create } from 'zustand'
import { LoginDto, Profile, RegisterDto, User } from '../models/types'
import { authService } from '../services/api/auth'
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
}

// Helper para ler erros do NestJS
const extractErrorMessage = (error: unknown): string => {
  const err = error as { response?: { data?: { message?: string | string[] } } }
  const message = err.response?.data?.message
  if (Array.isArray(message)) return message[0] // Pega o primeiro erro real da API
  if (typeof message === 'string') return message
  return 'Ocorreu um erro inesperado. Tente novamente.'
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  error: null,

  checkAuth: async () => {
    try {
      const savedUser = await storage.getUser()
      const token = await storage.getToken()

      if (savedUser && token && token !== 'undefined') {
        set({ user: savedUser, isLoading: false })
      } else {
        set({ user: null, isLoading: false })
      }
    } catch (error) {
      set({ user: null, isLoading: false })
    }
  },

  login: async (credentials: LoginDto) => {
    set({ isLoading: true, error: null })
    try {
      const response = await authService.login(credentials)
      set({ user: response.user, isLoading: false })
    } catch (error) {
      set({ error: extractErrorMessage(error), isLoading: false })
      throw error
    }
  },

  register: async (data: RegisterDto) => {
    set({ isLoading: true, error: null })
    try {
      const response = await authService.register(data)
      set({ user: response.user, isLoading: false })
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
    await authService.logout()
    set({ user: null, isLoading: false })
  },
}))
