import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { WeightLog } from '../../core/models/types'

interface WeightState {
  logs: WeightLog[]
  addOrUpdateWeight: (weightKg: number) => void
}

export const useWeightStore = create<WeightState>()(
  persist(
    (set) => ({
      logs: [],

      addOrUpdateWeight: (weightKg) => {
        const today = new Date().toISOString().split('T')[0]
        set((state) => {
          const existingIndex = state.logs.findIndex((l) => l.date === today)
          if (existingIndex >= 0) {
            const newLogs = [...state.logs]
            newLogs[existingIndex] = { ...newLogs[existingIndex], weightKg }
            return { logs: newLogs }
          }
          return {
            logs: [
              ...state.logs,
              { id: `w_${Date.now()}`, date: today, weightKg },
            ],
          }
        })
      },
    }),
    {
      name: 'weight-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
)
