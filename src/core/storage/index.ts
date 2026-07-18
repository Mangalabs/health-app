import AsyncStorage from '@react-native-async-storage/async-storage'
import * as SecureStore from 'expo-secure-store'
import { User } from '../models/types'

const TOKEN_KEY = 'healthy_access_token'
const USER_KEY = 'healthy_user_data'

export const storage = {
  getItem: async <T>(key: string): Promise<T | null> => {
    try {
      const item = await AsyncStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch {
      return null
    }
  },
  setItem: async <T>(key: string, value: T): Promise<void> => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value))
    } catch (e) {
      console.error('Storage error', e)
    }
  },
  removeItem: async (key: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key)
    } catch (e) {
      console.error('Storage error', e)
    }
  },

  async getToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(TOKEN_KEY)
    } catch {
      return null
    }
  },
  async setToken(token: string): Promise<void> {
    try {
      // Barreira de segurança contra 401
      if (!token || token === 'undefined' || token === 'null') return
      await SecureStore.setItemAsync(TOKEN_KEY, String(token))
    } catch (e) {
      console.error('Erro setToken', e)
    }
  },
  async removeToken(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY)
    } catch (e) {
      console.error('Erro removeToken', e)
    }
  },

  async getUser(): Promise<User | null> {
    try {
      const userData = await SecureStore.getItemAsync(USER_KEY)
      return userData ? JSON.parse(userData) : null
    } catch {
      return null
    }
  },
  async setUser(user: User): Promise<void> {
    try {
      if (!user) return
      const userString = JSON.stringify(user)
      await SecureStore.setItemAsync(USER_KEY, userString)
    } catch (e) {
      console.error('Erro setUser', e)
    }
  },
  async removeUser(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(USER_KEY)
    } catch (e) {
      console.error('Erro removeUser', e)
    }
  },

  async clearAllSensitives(): Promise<void> {
    await this.removeToken()
    await this.removeUser()
  },
}
