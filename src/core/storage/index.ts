import AsyncStorage from '@react-native-async-storage/async-storage'

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
}
